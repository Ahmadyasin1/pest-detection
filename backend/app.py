from flask import Flask, request, jsonify
import onnxruntime as ort
import numpy as np
from PIL import Image
import io
import json
from flask_cors import CORS
import os
import time
from datetime import datetime
import psutil
from collections import deque
import threading

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
ONNX_MODEL_PATH = 'best_pest_detector_model_bug_detector.onnx'
MODEL_INPUT_SIZE = 224  # Adjust if your model uses different size (240 for b1, 260 for b2, etc.)
MODEL_VERSION = '2.0.0'
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}

# Enhanced model configuration
MODEL_CONFIG = {
    'version': '2.0.0',
    'input_size': 224,
    'channels': 3,
    'classes': 12,
    'architecture': 'EfficientNet-B0',
    'framework': 'ONNX Runtime',
    'precision': 'float32',
    'optimization_level': 'high',
    'batch_size': 1,
    'supported_formats': ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'],
    'max_file_size': 5 * 1024 * 1024,  # 5MB
    'confidence_threshold': 0.5,
    'inference_timeout': 10.0  # seconds
}

# Real-time metrics tracking
request_times = deque(maxlen=60)  # Store last 60 seconds of request timestamps
inference_times = deque(maxlen=100)  # Store last 100 inference times
last_metrics_update = time.time()
metrics_lock = threading.Lock()
app_start_time = time.time()  # Track application start time

# Pest class mappings
PEST_CLASSES = {
    0: "ants",
    1: "bees",
    2: "beetle",
    3: "catterpillar",
    4: "earthworms",
    5: "earwig",
    6: "grasshopper",
    7: "moth",
    8: "slug",
    9: "snail",
    10: "wasp",
    11: "weevil"
}

# Treatment recommendations for each pest
TREATMENTS = {
    "ants": "Use ant baits and barriers. Keep food sealed and clean up spills promptly.",
    "bees": "Contact a beekeeper for safe removal. Avoid disturbing the hive.",
    "beetle": "Use neem oil or insecticidal soap. Remove affected plants.",
    "catterpillar": "Apply Bacillus thuringiensis (Bt) or handpick caterpillars.",
    "earthworms": "Earthworms are beneficial for soil health. No treatment needed.",
    "earwig": "Use diatomaceous earth or traps. Remove hiding places.",
    "grasshopper": "Apply neem oil or insecticidal soap. Use row covers.",
    "moth": "Use pheromone traps. Keep storage areas clean and sealed.",
    "slug": "Use copper barriers or beer traps. Apply diatomaceous earth.",
    "snail": "Use copper barriers or beer traps. Apply diatomaceous earth.",
    "wasp": "Use wasp traps or contact pest control. Seal entry points.",
    "weevil": "Use neem oil or insecticidal soap. Store grains properly."
}

# Severity levels for each pest
SEVERITY_LEVELS = {
    "ants": "Low",
    "bees": "Medium",
    "beetle": "Medium",
    "catterpillar": "High",
    "earthworms": "None",
    "earwig": "Low",
    "grasshopper": "High",
    "moth": "Medium",
    "slug": "Medium",
    "snail": "Medium",
    "wasp": "High",
    "weevil": "High"
}

# Performance metrics tracking
class PerformanceMetrics:
    def __init__(self):
        self.request_times = deque(maxlen=60)  # Last 60 seconds
        self.inference_times = deque(maxlen=100)  # Last 100 inferences
        self.predictions = {
            class_name: {'count': 0, 'correct': 0} 
            for class_name in PEST_CLASSES.values()
        }
        self.total_requests = 0
        self.failed_requests = 0
        self.start_time = time.time()
        self.lock = threading.Lock()

    def update_metrics(self, inference_time, predicted_class, confidence):
        with self.lock:
            current_time = time.time()
            self.request_times.append(current_time)
            self.inference_times.append(inference_time)
            self.total_requests += 1
            
            if predicted_class in self.predictions:
                self.predictions[predicted_class]['count'] += 1
                # Note: We can't track correctness without ground truth
                # This would require additional validation data

    def get_metrics(self):
        with self.lock:
            current_time = time.time()
            uptime = current_time - self.start_time
            
            # Calculate request rate
            requests_per_minute = len([t for t in self.request_times if current_time - t <= 60])
            
            # Calculate average inference time
            avg_inference_time = sum(self.inference_times) / len(self.inference_times) if self.inference_times else 0
            
            # Get system metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.Process().memory_info()
            memory_mb = memory.rss / (1024 * 1024)
            
            # Calculate class distribution
            class_distribution = {
                class_name: {
                    'count': data['count'],
                    'percentage': (data['count'] / self.total_requests * 100) if self.total_requests > 0 else 0
                }
                for class_name, data in self.predictions.items()
            }
            
            return {
                'system': {
                    'cpu_usage': cpu_percent,
                    'memory_usage': round(memory_mb, 2),
                    'requests_per_minute': requests_per_minute,
                    'avg_inference_time': round(avg_inference_time * 1000, 2),  # Convert to ms
                    'uptime_seconds': round(uptime, 2),
                    'total_requests': self.total_requests,
                    'failed_requests': self.failed_requests,
                    'success_rate': round((1 - self.failed_requests / self.total_requests) * 100, 2) if self.total_requests > 0 else 100
                },
                'model': {
                    'version': MODEL_CONFIG['version'],
                    'architecture': MODEL_CONFIG['architecture'],
                    'input_size': MODEL_CONFIG['input_size'],
                    'classes': MODEL_CONFIG['classes'],
                    'confidence_threshold': MODEL_CONFIG['confidence_threshold']
                },
                'predictions': class_distribution,
                'timestamp': datetime.now().isoformat()
            }

# Initialize performance metrics
performance_metrics = PerformanceMetrics()

def get_system_metrics():
    """Get current system metrics"""
    with metrics_lock:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.Process().memory_info()
        memory_mb = memory.rss / (1024 * 1024)  # Convert to MB
        
        # Calculate requests per minute
        current_time = time.time()
        request_times.append(current_time)
        requests_per_minute = len([t for t in request_times if current_time - t <= 60])
        
        # Calculate average inference time
        avg_inference_time = sum(inference_times) / len(inference_times) if inference_times else 0
        
        return {
            'cpu_usage': cpu_percent,
            'memory_usage': round(memory_mb, 2),
            'requests_per_minute': requests_per_minute,
            'avg_inference_time': round(avg_inference_time * 1000, 2)  # Convert to milliseconds
        }

# Load the ONNX model
ort_session = None
input_name = None
output_name = None

def load_onnx_model():
    global ort_session, input_name, output_name
    try:
        ort_session = ort.InferenceSession(ONNX_MODEL_PATH)
        input_name = ort_session.get_inputs()[0].name
        output_name = ort_session.get_outputs()[0].name
        print(f"ONNX model '{ONNX_MODEL_PATH}' loaded successfully.")
        print(f"Input name: {input_name}, Output name: {output_name}")
        print(f"Input shape: {ort_session.get_inputs()[0].shape}")
        return True
    except Exception as e:
        print(f"Error loading ONNX model: {e}")
        ort_session = None
        return False

# Load model when the app starts
model_loaded = load_onnx_model()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image):
    """
    Preprocess image for model inference using proper normalization
    This matches the preprocessing used during training
    """
    try:
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize with center crop (matching training preprocessing)
        # First resize to 256, then center crop to MODEL_INPUT_SIZE
        image = image.resize((256, 256), Image.LANCZOS)
        
        # Center crop to model input size
        left = (256 - MODEL_INPUT_SIZE) // 2
        top = (256 - MODEL_INPUT_SIZE) // 2
        right = left + MODEL_INPUT_SIZE
        bottom = top + MODEL_INPUT_SIZE
        image = image.crop((left, top, right, bottom))
        
        # Convert to numpy array
        img_array = np.array(image).astype(np.float32)
        
        # Normalize to [0, 1]
        img_array = img_array / 255.0
        
        # Apply ImageNet normalization (MUST MATCH TRAINING)
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        
        img_array = (img_array - mean) / std
        
        # Rearrange dimensions for ONNX (NCHW format)
        img_array = np.transpose(img_array, (2, 0, 1))  # HWC to CHW
        img_array = np.expand_dims(img_array, axis=0)   # Add batch dimension
        
        return img_array.astype(np.float32)
        
    except Exception as e:
        print(f"Error in preprocessing: {e}")
        return None

def predict_image_with_onnx(processed_image):
    """
    Run inference using ONNX model with proper softmax application
    """
    try:
        if ort_session is None:
            return None, None, None
        
        # Run inference
        outputs = ort_session.run([output_name], {input_name: processed_image})
        logits = outputs[0]
        
        # Apply softmax to get probabilities
        probabilities = np.exp(logits) / np.sum(np.exp(logits), axis=1, keepdims=True)
        
        # Get predicted class and confidence
        predicted_class_idx = np.argmax(probabilities, axis=1)[0]
        confidence = float(probabilities[0, predicted_class_idx]) * 100
        
        # Get pest information
        pest_name = PEST_CLASSES.get(predicted_class_idx, "Unknown")
        
        # Get top 5 predictions for detailed analysis
        top_k_indices = np.argsort(probabilities[0])[::-1][:5]
        top_predictions = {}
        for i in top_k_indices:
            class_name = PEST_CLASSES.get(i, f"Class_{i}")
            top_predictions[class_name] = round(float(probabilities[0, i]), 4)
        
        return pest_name, confidence, top_predictions
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return None, None, None

@app.route('/')
def home():
    return jsonify({
        "message": "AgroPest AI Backend API",
        "version": MODEL_VERSION,
        "status": "running",
        "model_loaded": ort_session is not None,
        "model_path": ONNX_MODEL_PATH,
        "input_size": MODEL_INPUT_SIZE
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if model is loaded
        if ort_session is None:
            return jsonify({
                "success": False,
                "error": "Model not loaded",
                "message": f"ONNX model '{ONNX_MODEL_PATH}' could not be loaded. Please ensure the model file exists."
            }), 500
        
        # Check if image is provided
        if 'image' not in request.files:
            return jsonify({
                "success": False,
                "error": "No image provided",
                "message": "Please upload an image file using the 'image' field"
            }), 400
        
        file = request.files['image']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected",
                "message": "Please select an image file"
            }), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({
                "success": False,
                "error": "Invalid file type",
                "message": f"Allowed file types: {', '.join(ALLOWED_EXTENSIONS)}"
            }), 400
        
        # Check file size
        file_content = file.read()
        if len(file_content) > MAX_FILE_SIZE:
            return jsonify({
                "success": False,
                "error": "File too large",
                "message": f"Maximum file size is {MAX_FILE_SIZE/1024/1024}MB"
            }), 400
        
        # Read and process the image
        image = Image.open(io.BytesIO(file_content))
        
        # Preprocess the image
        processed_image = preprocess_image(image)
        if processed_image is None:
            return jsonify({
                "success": False,
                "error": "Image processing failed",
                "message": "Could not process the uploaded image. Please ensure it's a valid image file."
            }), 400
        
        # Start timing inference
        start_time = time.time()
        
        # Run prediction
        pest_name, confidence, top_predictions = predict_image_with_onnx(processed_image)
        
        # Calculate inference time
        inference_time = time.time() - start_time
        
        # Update performance metrics
        performance_metrics.update_metrics(inference_time, pest_name, confidence)
        
        if pest_name is None:
            performance_metrics.failed_requests += 1
            return jsonify({
                "success": False,
                "error": "Prediction failed",
                "message": "Model inference failed. Please try again."
            }), 500
        
        # Get additional information
        treatment = TREATMENTS.get(pest_name, "Consult with agricultural expert for specific treatment recommendations.")
        severity = SEVERITY_LEVELS.get(pest_name, "Unknown")
        
        # Prepare response
        response = {
            "success": True,
            "pest_name": pest_name,
            "confidence": confidence,
            "treatment": treatment,
            "severity": severity,
            "class_probabilities": top_predictions,
            "inference_time": round(inference_time * 1000, 2),  # Convert to milliseconds
            "model_version": MODEL_CONFIG['version'],
            "timestamp": datetime.now().isoformat()
            }
        
        return jsonify(response)
        
    except Exception as e:
        performance_metrics.failed_requests += 1
        print(f"Error in prediction endpoint: {e}")
        return jsonify({
            "success": False,
            "error": "Internal server error",
            "message": str(e)
        }), 500

@app.route('/metrics', methods=['GET'])
def get_metrics():
    """Get real-time system metrics"""
    try:
        # Get system metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.Process().memory_info()
        memory_mb = memory.rss / (1024 * 1024)  # Convert to MB
        
        # Calculate requests per minute
        current_time = time.time()
        request_times.append(current_time)
        requests_per_minute = len([t for t in request_times if current_time - t <= 60])
        
        # Calculate average inference time
        avg_inference_time = sum(inference_times) / len(inference_times) if inference_times else 0
        
        # Get model information
        model_info = {
            'version': MODEL_VERSION,
            'input_size': MODEL_INPUT_SIZE,
            'classes': len(PEST_CLASSES),
            'supported_formats': list(ALLOWED_EXTENSIONS),  # Convert set to list
            'max_file_size': MAX_FILE_SIZE
        }
        
        # Calculate prediction distribution
        prediction_distribution = {}
        for class_name, data in performance_metrics.predictions.items():
            prediction_distribution[class_name] = {
                'count': data['count'],
                'percentage': (data['count'] / performance_metrics.total_requests * 100) if performance_metrics.total_requests > 0 else 0
            }
        
        metrics = {
            'system': {
                'cpu_usage': cpu_percent,
                'memory_usage': round(memory_mb, 2),
                'requests_per_minute': requests_per_minute,
                'avg_inference_time': round(avg_inference_time * 1000, 2),  # Convert to ms
                'uptime_seconds': round(time.time() - app_start_time, 2),
                'total_requests': performance_metrics.total_requests,
                'failed_requests': performance_metrics.failed_requests,
                'success_rate': round((1 - performance_metrics.failed_requests / performance_metrics.total_requests) * 100, 2) if performance_metrics.total_requests > 0 else 100
            },
            'model': model_info,
            'predictions': prediction_distribution,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify({
            "success": True,
            "metrics": metrics
        })
    except Exception as e:
        print(f"Error in metrics endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to get metrics",
            "message": str(e)
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get detailed model information"""
    try:
    if ort_session is None:
        return jsonify({
                "success": False,
            "error": "Model not loaded",
                "message": f"ONNX model '{ONNX_MODEL_PATH}' could not be loaded."
        }), 500
    
        # Get model metadata
        model_metadata = {
            "version": MODEL_CONFIG['version'],
            "architecture": MODEL_CONFIG['architecture'],
            "framework": MODEL_CONFIG['framework'],
            "precision": MODEL_CONFIG['precision'],
            "optimization_level": MODEL_CONFIG['optimization_level'],
            "input_details": {
                "shape": [1, MODEL_CONFIG['channels'], MODEL_CONFIG['input_size'], MODEL_CONFIG['input_size']],
                "type": "float32",
                "expected_size": MODEL_CONFIG['input_size'],
                "channels": MODEL_CONFIG['channels']
            },
            "output_details": {
                "shape": [1, MODEL_CONFIG['classes']],
                "type": "float32",
                "classes": MODEL_CONFIG['classes']
            },
            "supported_formats": list(MODEL_CONFIG['supported_formats']),
            "max_file_size": MODEL_CONFIG['max_file_size'],
            "confidence_threshold": MODEL_CONFIG['confidence_threshold'],
            "classes": list(PEST_CLASSES.values()),
            "treatments": TREATMENTS,
            "severity_levels": SEVERITY_LEVELS
        }

        return jsonify({
            "success": True,
            "model_info": model_metadata
        })

    except Exception as e:
        print(f"Error in model-info endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to get model info",
            "message": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": ort_session is not None,
        "version": MODEL_VERSION,
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)