
# Image Classification with Transfer Learning (PyTorch)

This project demonstrates how to perform multi-class image classification using PyTorch and transfer learning with popular architectures such as ResNet18 and EfficientNetB0.

## 📁 Project Structure

- **Data Loaders**: Efficient loading of train, validation, and test datasets using `torchvision.datasets.ImageFolder` and `DataLoader`.
- **Model Initialization**: Supports ResNet18 and EfficientNetB0 with optional feature freezing.
- **Training Loop**: Two-phase training: first trains only the classifier layers, then fine-tunes all layers.
- **Evaluation**: Includes accuracy calculation and ROC curve plotting for multi-class problems.
- **Model Export**: Save the model in both `.pth` and ONNX formats.

## 🛠️ Requirements

- Python 3.8+
- PyTorch
- Torchvision
- Scikit-learn
- Matplotlib
- NumPy

Install requirements via:
```bash
pip install torch torchvision scikit-learn matplotlib numpy
```

## 🚀 Usage

1. **Prepare Dataset**:
   - Organize your dataset in the following structure:
     ```
     dataset/
       train/
         class1/
         class2/
         ...
       val/
         class1/
         class2/
         ...
       test/
         class1/
         class2/
         ...
     ```

2. **Run Training**:
   - Execute the notebook step-by-step or all at once.
   - Select desired model: `resnet18` or `efficientnet_b0`.

3. **Evaluate and Save Model**:
   - Accuracy and ROC curves are automatically generated.
   - Model is saved as `.pth` and optionally exported to ONNX.

## 📊 Outputs

- Training/Validation loss and accuracy plots
- ROC curves for each class
- Trained model saved as `.pth`
- Optional ONNX export

## 📄 Notes

- Freezing is done during Phase 1 to train only the classifier.
- Unfreezing is done in Phase 2 for full model fine-tuning.


