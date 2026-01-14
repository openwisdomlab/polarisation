"""
Polarization Feature Template (PFT) for Microalgae Identification
微藻偏振特征模版识别算法

This script implements the polarization feature template method for identifying
microalgae cells in Mueller matrix microscopy images using K-means super-pixel
clustering and statistical classification.

本脚本实现了基于K-means超像素聚类和统计分类的微藻偏振特征模版方法，
用于在Mueller矩阵显微图像中识别微藻细胞。

Workflow 工作流程:
1. Load Mueller matrix data (pbps.mat) and cell masks
   加载Mueller矩阵数据和细胞掩膜
2. Apply K-means clustering to create super-pixels (512 clusters)
   应用K-means聚类创建超像素（512个聚类）
3. Calculate polarization feature templates for target species
   计算目标藻种的偏振特征模版
4. Classify unknown samples based on template matching
   基于模版匹配对未知样本进行分类
5. Visualize results with contour overlay
   使用轮廓叠加可视化结果

Dependencies 依赖:
- numpy, scipy, matplotlib
- scikit-learn (MiniBatchKMeans)
- scikit-image (morphology)
- hdf5storage (for .mat files)
- PIL/Pillow

Author: Weijinfu Lab
"""

from numpy import *
from pylab import *
from scipy.ndimage import gaussian_filter, median_filter
from IPython.display import clear_output
import mat73
import scipy.io as sio
import csv
from PIL import Image
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import MiniBatchKMeans
import matplotlib as mpl
from hdf5storage import loadmat, savemat
import os
import gc

# Mueller matrix parameter names
# Mueller矩阵参数名称
parameters = ['FinalM11', 'FinalM12', 'FinalM13', 'FinalM14',
              'FinalM21', 'FinalM22', 'FinalM23', 'FinalM24',
              'FinalM31', 'FinalM32', 'FinalM33', 'FinalM34',
              'FinalM41', 'FinalM42', 'FinalM43', 'FinalM44']


def load_microalgae_data(infile_paths, samples_per_class=10):
    """
    Load microalgae data from specified directories.
    从指定目录加载微藻数据。

    Args:
        infile_paths: List of paths to microalgae data folders
        samples_per_class: Number of samples to use per class

    Returns:
        fl: List of file paths for training data
    """
    fl_ = []

    for file1 in infile_paths:
        fl1 = os.listdir(file1)
        fl1.sort(key=lambda x: int(x.split('/')[-1]))
        for file in fl1:
            folder1 = file1 + "/" + file
            fl_.append(folder1)

    print(f"Total files found: {len(fl_)}")

    # Select samples for training (example: first 10 from each class)
    # 选择训练样本（示例：每类前10个）
    fl = fl_[:samples_per_class] + fl_[31:31+samples_per_class]

    return fl


def extract_features(file_paths, num_samples=10):
    """
    Extract polarization features from microalgae images.
    从微藻图像中提取偏振特征。

    Args:
        file_paths: List of paths to data files
        num_samples: Number of samples to process

    Returns:
        xx_pbp: List of extracted feature arrays
        mask_all: Dictionary of masks
    """
    num = 0
    xx = {}
    mask_all = {}

    for file_path in file_paths[:num_samples]:
        data = loadmat(file_path + '/pbps.mat')
        mask = loadmat(file_path + '/mask.mat')
        size = data['pbps'].shape[0], data['pbps'].shape[1]
        xx[num] = num, (data['pbps'][mask['mask'] == 1])
        mask_all[num] = mask['mask']
        num = num + 1

    print(f"Loaded {num} samples")
    print("Data load successfully finished")

    # Clean up memory
    del data
    del mask
    gc.collect()

    # Concatenate all features
    xx_pbp = []
    for i in range(num):
        xx_pbp.append(xx[i][1])

    temp = xx_pbp[0]
    for i in range(num - 1):
        temp = concatenate((temp, xx_pbp[i + 1]))

    return temp, mask_all


def train_kmeans_model(features, n_clusters=512):
    """
    Train K-means model for super-pixel clustering.
    训练K-means模型进行超像素聚类。

    Args:
        features: Feature array to cluster
        n_clusters: Number of clusters (super-pixels)

    Returns:
        minikm: Trained KMeans model
        ss: StandardScaler object
        groups_mean: Cluster centroids
        groups_std: Cluster standard deviations
        triple_std: 3-sigma thresholds for outlier detection
    """
    # Standardize features
    ss = StandardScaler()
    xx_final = ss.fit_transform(features)

    # Train MiniBatchKMeans
    minikm = MiniBatchKMeans(
        n_clusters=n_clusters,
        batch_size=10 * n_clusters,
        random_state=2023214566
    )
    minikm.fit(xx_final)

    # Calculate cluster statistics
    groups_mean = []
    groups_std = []
    for i in range(n_clusters):
        groups_mean.append(xx_final[minikm.labels_ == i].mean(axis=0))
        groups_std.append(xx_final[minikm.labels_ == i].std(axis=0))

    groups_mean = array(groups_mean)
    groups_std = array(groups_std)

    # Calculate 3-sigma threshold for outlier detection
    triple_std = np.sqrt(3) * np.sqrt(np.sum(groups_std**2, axis=1))

    return minikm, ss, groups_mean, groups_std, triple_std


def calculate_pft(file_paths_A, file_paths_B, minikm, ss, groups_mean, triple_std, clustern=512):
    """
    Calculate Polarization Feature Template (PFT).
    计算偏振特征模版（PFT）。

    Args:
        file_paths_A: Paths to target species (Class A)
        file_paths_B: Paths to non-target species (Class B)
        minikm: Trained KMeans model
        ss: StandardScaler
        groups_mean: Cluster centroids
        triple_std: 3-sigma thresholds
        clustern: Number of clusters

    Returns:
        pft: List of cluster indices that identify target species
        prop_rst_num: Proportion of each cluster belonging to Class A
    """
    from collections import Counter

    # Get labels for Class A (from training data)
    rst_labels = minikm.labels_
    counter_A = Counter(rst_labels)

    # Process Class B data
    counter_B = Counter()
    for file_path in file_paths_B:
        data2 = loadmat(file_path + '/pbps.mat')
        if os.path.exists(file_path + '/mask.mat'):
            mask2 = loadmat(file_path + '/mask.mat')['mask'] == 1
        else:
            mask2 = loadmat(file_path + '/label.mat')['imbw'] == 1

        valid_data = data2['pbps'][mask2]
        valid_data_flat = valid_data.reshape(-1, valid_data.shape[-1])
        xx_final_single = ss.transform(valid_data_flat)
        rst_labels_single = minikm.predict(xx_final_single)

        # Outlier detection: mark pixels outside 3-sigma as -1
        for i in range(len(xx_final_single)):
            cluster_label = rst_labels_single[i]
            distance = np.linalg.norm(xx_final_single[i] - groups_mean[cluster_label])
            if distance > triple_std[cluster_label]:
                rst_labels_single[i] = -1

        counter_B.update(rst_labels_single)

        # Clean up memory
        del data2, mask2, valid_data, valid_data_flat, xx_final_single, rst_labels_single
        gc.collect()

    # Calculate proportions
    num_A = {i: 0 for i in range(clustern)}
    num_B = {i: 0 for i in range(clustern)}

    for label in range(clustern):
        if label in counter_A:
            num_A[label] = counter_A[label]
        if label in counter_B:
            num_B[label] = counter_B[label]

    # Calculate cluster proportions
    prop_rst_num = {}
    total_A = 0
    total_AB = 0
    for i in range(clustern):
        prop_rst_num[i] = num_A[i] / (num_A[i] + num_B[i])
        total_A += num_A[i]
        total_AB += (num_A[i] + num_B[i])
        print(f'Cluster {i} proportion: {num_A[i]}/{num_A[i]+num_B[i]}={prop_rst_num[i]:.3f}')

    contrast = total_A / total_AB

    # Select top clusters as PFT (default: top 85%)
    top_percent = int(clustern * 0.85)
    sorted_items = sorted(prop_rst_num.items(), key=lambda x: x[1], reverse=True)
    pft = [item[0] for item in sorted_items[:top_percent]]

    print(f"Selected {len(pft)} clusters for PFT")

    return pft, prop_rst_num, contrast


def predict_and_visualize(test_paths, minikm, ss, groups_mean, triple_std, pft, clustern=512):
    """
    Predict target microalgae in unknown samples and visualize results.
    预测未知样本中的目标微藻并可视化结果。

    Args:
        test_paths: Paths to test data
        minikm: Trained KMeans model
        ss: StandardScaler
        groups_mean: Cluster centroids
        triple_std: 3-sigma thresholds
        pft: Polarization Feature Template (cluster indices)
        clustern: Number of clusters
    """
    from skimage import morphology, measure
    from scipy.ndimage import binary_erosion, binary_closing, generate_binary_structure
    from copy import deepcopy as dc

    # Visualization parameters
    merge_structure_size = 4
    contour_thickness = 4

    for ft in test_paths:
        # Load test data
        data_test = loadmat(ft + '/pbps.mat')['pbps']
        data_temp_m11 = loadmat(ft + '/FinalMM.mat')['CalibratedM11']
        region_0_mask_test = loadmat(ft + '/mask.mat')['mask'] == 0

        # Process and predict
        temp_2 = data_test.reshape(data_test.shape[0] * data_test.shape[1], data_test.shape[2])
        xx_final_2 = ss.transform(temp_2)
        pred_rst_temp = minikm.predict(xx_final_2)

        # Apply outlier detection
        final_labels = pred_rst_temp.copy()
        for a in range(clustern):
            cluster_mask = (pred_rst_temp == a)
            distance = sqrt(sum((xx_final_2[cluster_mask] - groups_mean[a])**2, axis=1))
            outliers_mask = distance >= triple_std[a]
            final_labels[cluster_mask] = np.where(outliers_mask, -1, a)

        pred_rst_temp_copy = dc(final_labels)
        pred_rst_temp_copy = pred_rst_temp_copy.reshape(data_test.shape[0], data_test.shape[1])
        pred_rst_temp_copy[region_0_mask_test == 1] = -1

        # Create highlight mask for PFT clusters
        highlight_mask = np.isin(pred_rst_temp_copy, pft)
        highlight_mask = morphology.remove_small_objects(highlight_mask, min_size=50)
        highlight_mask = morphology.remove_small_holes(highlight_mask, area_threshold=500)

        # Region-based decision (threshold: 30% coverage)
        target_region_mask = (region_0_mask_test == 0)
        labeled_regions = measure.label(target_region_mask)
        regions = measure.regionprops(labeled_regions)

        final_decision_mask = np.zeros_like(highlight_mask, dtype=bool)
        for region in regions:
            region_mask = (labeled_regions == region.label)
            highlight_in_region = np.sum(highlight_mask & region_mask)
            if region.area > 0 and (highlight_in_region / region.area) >= 0.3:
                final_decision_mask[region_mask] = True

        result_plot = final_decision_mask

        # Generate contour visualization
        calibratedM11 = data_temp_m11

        if np.sum(result_plot) > 0:
            # Merge nearby regions
            merge_structure = generate_binary_structure(2, 2)
            merge_structure = np.pad(merge_structure, pad_width=merge_structure_size // 2,
                                    mode='constant', constant_values=1)
            merged_regions = binary_closing(result_plot, structure=merge_structure)
            large_regions = merged_regions

            # Generate thick contour
            base_eroded = large_regions
            thick_contour = np.zeros_like(large_regions)
            for _ in range(contour_thickness):
                eroded = binary_erosion(base_eroded, structure=np.ones((3, 3)))
                layer_contour = base_eroded & (~eroded)
                thick_contour |= layer_contour
                base_eroded = eroded
            contour = thick_contour
        else:
            contour = result_plot

        # Visualize results
        plt.figure(figsize=(10, 8))
        plt.imshow(calibratedM11, cmap='gray',
                  vmax=np.percentile(calibratedM11, 99),
                  vmin=np.percentile(calibratedM11, 1))

        # Overlay red contour
        contour_rgba = np.zeros((calibratedM11.shape[0], calibratedM11.shape[1], 4), dtype=np.float32)
        contour_rgba[contour, 0] = 1.0  # Red channel
        contour_rgba[contour, 3] = 0.9  # Alpha
        plt.imshow(contour_rgba)

        plt.axis('off')
        plt.title(f'Target Microalgae Detection: {ft.split("/")[-1]}')
        plt.tight_layout()
        plt.show()


# Main execution example
# 主程序示例
if __name__ == '__main__':
    # Define data paths (modify according to your data location)
    # 定义数据路径（根据您的数据位置修改）
    infile = [
        'path/to/species_A_data',  # Target species 目标藻种
        'path/to/species_B_data',  # Non-target species 非目标藻种
    ]

    test_paths = [
        'path/to/test_sample_1',
        'path/to/test_sample_2',
    ]

    print("="*60)
    print("Polarization Feature Template (PFT) Microalgae Identification")
    print("偏振特征模版微藻识别系统")
    print("="*60)

    # Step 1: Load data
    print("\n[Step 1] Loading microalgae data...")
    fl = load_microalgae_data(infile)

    # Step 2: Extract features
    print("\n[Step 2] Extracting polarization features...")
    features, masks = extract_features(fl)

    # Step 3: Train K-means model
    print("\n[Step 3] Training K-means super-pixel model...")
    minikm, ss, groups_mean, groups_std, triple_std = train_kmeans_model(features)

    # Step 4: Calculate PFT
    print("\n[Step 4] Calculating Polarization Feature Template...")
    pft, proportions, contrast = calculate_pft(fl[:10], fl[10:], minikm, ss, groups_mean, triple_std)

    # Step 5: Predict and visualize
    print("\n[Step 5] Predicting target microalgae in test samples...")
    predict_and_visualize(test_paths, minikm, ss, groups_mean, triple_std, pft)

    print("\n" + "="*60)
    print("Analysis complete! 分析完成！")
    print("="*60)
