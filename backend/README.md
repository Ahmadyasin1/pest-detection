# AgroPest AI Backend

This is the Flask backend for the AgroPest AI pest detection system. It provides REST API endpoints for image-based pest detection using an ONNX deep learning model with proper ImageNet normalization.

## Features

- **Advanced Image Processing**: Proper resize, center crop, and ImageNet normalization
- **ONNX Model Integration**: Optimized inference with softmax probability calculation
- **Comprehensive Error Handling**: Detailed error messages and validation
- **Model Information API**: Complete model metadata and statistics
- **Health Monitoring**: System status and performance monitoring
- **Test Endpoints**: Built-in testing capabilities

## Installation

### Local Development

1. **Create Virtual Environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

3. **Add Model File**:
Place your `best_pest_detector_model_bug_detector.onnx` file in the backend directory.

4. **Run the Application**:
```bash
python app.py
```

The API will be available at `https://cropbugdetection.pythonanywhere.com`

### PythonAnywhere Deployment

1. **Upload Files**:
   - Upload all backend files to your PythonAnywhere account
   - Ensure the ONNX model file is in the same directory as `app.py`

2. **Install Dependencies**:
```bash
pip3.10 install --user -r requirements.txt
```

3. **Configure Web App**:
   - Create a new web app in PythonAnywhere dashboard
   - Set the source code directory to your backend folder
   - Set the WSGI configuration file to point to your `app.py`

4. **WSGI Configuration**:
```python
import sys
import os

# Add your project directory to sys.path
sys.path.insert(0, '/home/yourusername/mysite')

from app import app as application

if __name__ == "__main__":
    application.run()
```

## API Endpoints

### POST /predict
Upload an image for pest detection with advanced preprocessing.

**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body: image file (PNG, JPG, JPEG, GIF, BMP, TIFF)

**Response**:
```json
{
  "success": true,
  "pest_name": "Aphids",
  "confidence": 87.3,
  "treatment": "Apply neem oil spray or use ladybugs as biological control",
  "severity": "Medium",
  "class_probabilities": {
    "Aphids": 87.3,
    "Caterpillars": 5.2,
    "Whiteflies": 3.1,
    "Spider_Mites": 2.8,
    "Thrips": 1.6
  },
  "model_info": {
    "model_name": "best_pest_detector_model_bug_detector.onnx",
    "input_size": 224,
    "preprocessing": "ImageNet normalization applied"
  }
}
```

### GET /model-info
Get comprehensive model information and statistics.

**Response**:
```json
{
  "model_name": "best_pest_detector_model_bug_detector.onnx",
  "model_version": "2.0.0",
  "input_details": {
    "name": "input",
    "shape": [1, 3, 224, 224],
    "type": "tensor(float)",
    "expected_size": 224
  },
  "classes": {
    "num_classes": 15,
    "class_names": ["Aphids", "Armyworm", "..."],
    "class_mapping": {"0": "Aphids", "1": "Armyworm", "..."}
  },
  "preprocessing": {
    "resize_method": "Resize to 256x256, then center crop",
    "normalization": "ImageNet standard (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])",
    "input_format": "NCHW (batch, channels, height, width)"
  },
  "performance": {
    "expected_accuracy": "94.7%",
    "supported_formats": ["PNG", "JPG", "JPEG", "GIF", "BMP", "TIFF"]
  }
}
```

### GET /health
Comprehensive health check endpoint.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "model": {
    "status": "loaded",
    "file_exists": true,
    "path": "best_pest_detector_model_bug_detector.onnx",
    "input_size": 224
  },
  "api": {
    "version": "2.0.0",
    "endpoints": ["/", "/predict", "/model-info", "/health"]
  },
  "system": {
    "onnxruntime_version": "1.16.0",
    "providers": ["CPUExecutionProvider"]
  }
}
```

### GET /test-prediction
Test endpoint to verify model functionality.

**Response**:
```json
{
  "test_status": "success",
  "message": "Model is working correctly",
  "dummy_prediction": {
    "pest_name": "Aphids",
    "confidence": 23.4,
    "note": "This is a test with random data"
  }
}
```

### GET /
API information endpoint.

**Response**:
```json
{
  "message": "AgroPest AI Backend API",
  "version": "2.0.0",
  "status": "running",
  "model_loaded": true,
  "model_path": "best_pest_detector_model_bug_detector.onnx",
  "input_size": 224
}
```

## Image Preprocessing Pipeline

The backend uses advanced preprocessing that matches training conditions:

1. **Format Conversion**: Convert to RGB if necessary
2. **Resize**: Resize image to 256x256 using LANCZOS resampling
3. **Center Crop**: Crop to model input size (224x224 by default)
4. **Normalization**: Convert to [0,1] range, then apply ImageNet normalization
5. **Format Conversion**: Convert to NCHW format for ONNX inference

### ImageNet Normalization Values:
- **Mean**: [0.485, 0.456, 0.406]
- **Std**: [0.229, 0.224, 0.225]

## Supported Pest Classes

The model can detect the following 15 pest categories:

1. Aphids
2. Armyworm
3. Beetle
4. Bollworm
5. Grasshopper
6. Mites
7. Mosquito
8. Sawfly
9. Stem Borer
10. Termite
11. Thrips
12. Whitefly
13. Caterpillar
14. Scale Insects
15. Leaf Miners

## Model Configuration

- **Input Format**: RGB images, 224x224 pixels (configurable)
- **Model Format**: ONNX (Open Neural Network Exchange)
- **File Name**: `best_pest_detector_model_bug_detector.onnx`
- **Input Shape**: [1, 3, 224, 224] (batch_size, channels, height, width)
- **Output**: Logits for 15 classes (softmax applied during inference)

## Error Handling

The API includes comprehensive error handling for:
- Missing or invalid image files
- Model loading failures
- Image processing errors
- Prediction failures
- File type validation
- Model compatibility issues

## Performance Optimization

- **Efficient Preprocessing**: Optimized image processing pipeline
- **Memory Management**: Proper cleanup of image data
- **Error Recovery**: Graceful handling of edge cases
- **Caching**: Model loaded once at startup
- **Validation**: Input validation before processing

## Security Considerations

- File type validation for uploaded images
- Input sanitization and validation
- CORS configuration for cross-origin requests
- Error message sanitization to prevent information leakage
- Secure file handling with proper cleanup

## Monitoring and Debugging

The API includes built-in monitoring capabilities:
- Health check endpoints with detailed system information
- Model status monitoring
- Test prediction endpoint for verification
- Comprehensive error logging
- Performance metrics collection

## Troubleshooting

### Common Issues

1. **Model Not Loading**:
   - Ensure the ONNX file is in the correct directory
   - Check file permissions and integrity
   - Verify ONNX runtime installation
   - Check model file name matches `ONNX_MODEL_PATH`

2. **Image Processing Errors**:
   - Verify image format is supported
   - Check image file integrity
   - Ensure sufficient memory for processing
   - Validate image dimensions

3. **Prediction Failures**:
   - Check model input requirements
   - Verify preprocessing pipeline matches training
   - Monitor system resources
   - Use `/test-prediction` endpoint for debugging

4. **Low Accuracy**:
   - Ensure preprocessing matches training exactly
   - Verify class mappings are correct
   - Check image quality and lighting
   - Validate model file integrity

### Debug Endpoints

- `GET /health` - System health and model status
- `GET /test-prediction` - Test model with dummy data
- `GET /model-info` - Detailed model information

### Logs

Check application logs for detailed error information:
```bash
tail -f /var/log/yourusername.pythonanywhere.com.error.log
```

## Model Input Size Configuration

If your model was trained with different input sizes:
- **EfficientNet-B0**: 224x224 (default)
- **EfficientNet-B1**: 240x240
- **EfficientNet-B2**: 260x260
- **EfficientNet-B3**: 300x300

Update the `MODEL_INPUT_SIZE` variable accordingly.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is part of an academic research initiative for advancing agricultural technology through AI.