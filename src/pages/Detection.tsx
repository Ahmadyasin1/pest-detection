import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Image, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Camera,
  FileImage,
  Zap,
  WifiOff,
  Server,
  RefreshCw,
  Shield,
  Thermometer,
  Clock,
  BarChart2
} from 'lucide-react';

interface PredictionResult {
  success: boolean;
  pest_name: string;
  confidence: number;
  treatment: string;
  severity: string;
  class_probabilities?: Record<string, number>;
  inference_time?: number;
  model_version?: string;
}

const Detection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Check server status on component mount
  React.useEffect(() => {
    checkServerStatus();
    // Load prediction history from localStorage
    const savedHistory = localStorage.getItem('predictionHistory');
    if (savedHistory) {
      setPredictionHistory(JSON.parse(savedHistory));
    }
  }, []);

  const checkServerStatus = async () => {
    setServerStatus('checking');
    try {
      const response = await fetch('https://cropbugdetection.pythonanywhere.com/health', {
        method: 'GET'
      });
      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Please upload an image smaller than 5MB.');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, BMP, or TIFF).');
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    } else {
      setError('Please drop a valid image file.');
    }
  }, [handleFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handlePrediction = async () => {
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    if (serverStatus === 'offline') {
      setError('Backend server is not running. Please start the Flask server and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('https://cropbugdetection.pythonanywhere.com/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        // Add to prediction history
        const newHistory = [data, ...predictionHistory].slice(0, 10); // Keep last 10 predictions
        setPredictionHistory(newHistory);
        localStorage.setItem('predictionHistory', JSON.stringify(newHistory));
      } else {
        setError(data.message || 'Prediction failed');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to connect to the backend server. Please ensure the Flask server is running.');
      setServerStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const ServerStatusIndicator = () => (
    <div className="mb-6">
      <div className={`flex items-center justify-between p-4 rounded-lg border ${
        serverStatus === 'online' 
          ? 'bg-green-50 border-green-200' 
          : serverStatus === 'offline'
          ? 'bg-red-50 border-red-200'
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            serverStatus === 'online' 
              ? 'bg-green-500' 
              : serverStatus === 'offline'
              ? 'bg-red-500'
              : 'bg-yellow-500 animate-pulse'
          }`} />
          <div>
            <div className={`font-medium ${
              serverStatus === 'online' 
                ? 'text-green-900' 
                : serverStatus === 'offline'
                ? 'text-red-900'
                : 'text-yellow-900'
            }`}>
              {serverStatus === 'online' 
                ? 'Server Online' 
                : serverStatus === 'offline'
                ? 'Server Offline'
                : 'Checking Server...'}
            </div>
            <div className={`text-sm ${
              serverStatus === 'online' 
                ? 'text-green-700' 
                : serverStatus === 'offline'
                ? 'text-red-700'
                : 'text-yellow-700'
            }`}>
              {serverStatus === 'online' 
                ? 'Backend server is running and ready' 
                : serverStatus === 'offline'
                ? 'Please start the Flask backend server'
                : 'Verifying server connection...'}
            </div>
          </div>
        </div>
        <button
          onClick={checkServerStatus}
          className={`p-2 rounded-lg transition-colors ${
            serverStatus === 'online' 
              ? 'text-green-600 hover:bg-green-100' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${serverStatus === 'checking' ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );

  const PredictionHistory = () => (
    <div className="mt-8">
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
      >
        <BarChart2 className="w-5 h-5" />
        <span>{showHistory ? 'Hide' : 'Show'} Prediction History</span>
      </button>
      
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 space-y-4"
        >
          {predictionHistory.map((pred, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{pred.pest_name}</h4>
                  <p className="text-sm text-gray-600">Confidence: {pred.confidence.toFixed(1)}%</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(pred.severity)}`}>
                  {pred.severity}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            <Camera className="w-4 h-4 mr-2" />
            AI-Powered Pest Detection
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Upload & Detect Crop Pests
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload an image of your crop to get instant pest identification with treatment recommendations using our advanced deep learning model.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Server Status */}
            <ServerStatusIndicator />

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">How to Use</h3>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>1. Ensure the backend server is running (green status above)</li>
                    <li>2. Upload a clear image of your crop showing the pest</li>
                    <li>3. Ensure good lighting and focus on the affected area</li>
                    <li>4. Click "Analyze Image" to get instant results</li>
                    <li>5. View detailed pest identification and treatment advice</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                preview 
                  ? 'border-primary-300 bg-primary-50' 
                  : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
              }`}
            >
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <div className="text-gray-600">
                      <p className="font-medium">Drag and drop your image here</p>
                      <p className="text-sm mt-1">or</p>
                      <label className="mt-2 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer">
                        <FileImage className="w-5 h-5 mr-2" />
                        Browse Files
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Supported formats: JPEG, PNG, GIF, BMP, TIFF (max 5MB)
                    </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <p className="text-red-800">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handlePrediction}
              disabled={!selectedFile || isLoading || serverStatus !== 'online'}
              className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all duration-300 ${
                !selectedFile || isLoading || serverStatus !== 'online'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Analyze Image</span>
                </div>
              )}
            </button>

            {/* Prediction History */}
            <PredictionHistory />
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {result ? (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Detection Results</h2>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                    {result.severity} Severity
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Pest Type</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{result.pest_name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Thermometer className="w-5 h-5" />
                      <span className="font-medium">Confidence</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{result.confidence.toFixed(1)}%</p>
                  </div>
                  </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Info className="w-5 h-5" />
                    <span className="font-medium">Treatment Recommendation</span>
                  </div>
                  <p className="text-gray-900">{result.treatment}</p>
                  </div>

                  {result.class_probabilities && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Top Predictions</h3>
                      <div className="space-y-2">
                        {Object.entries(result.class_probabilities)
                        .sort(([, a], [, b]) => b - a)
                          .slice(0, 3)
                          .map(([pest, probability]) => (
                          <div key={pest} className="flex items-center justify-between">
                            <span className="text-gray-600">{pest}</span>
                            <span className="font-medium text-gray-900">
                              {(probability * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {result.inference_time && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Inference Time</span>
                </div>
                    <p className="text-gray-900">{result.inference_time.toFixed(0)}ms</p>
              </div>
            )}

                {result.model_version && (
                  <div className="text-sm text-gray-500 text-right">
                    Model Version: {result.model_version}
                  </div>
                )}
                </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
                <p className="text-gray-600">
                  Upload an image and click "Analyze Image" to get started.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Detection;