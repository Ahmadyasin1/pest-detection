import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Clock, 
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ModelInfo {
  version: string;
  input_size: number;
  format: string;
  f1_score: number;
  base_model: string;
  input_channels: number;
  output_classes: number;
  training_samples: number;
  validation_split: number;
  data_augmentation: boolean;
}

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  requests_per_minute: number;
  average_inference_time: number;
  uptime: number;
  total_requests: number;
  failed_requests: number;
  success_rate: number;
  model_info: {
    version: string;
    input_size: number;
    classes: number;
    supported_formats: string[];
    max_file_size: number;
  };
  prediction_distribution: {
    [key: string]: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ModelAnalysis: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<any[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const response = await fetch('https://cropbugdetection.pythonanywhere.com/model-info');
        if (!response.ok) {
          throw new Error('Failed to fetch model information');
        }
        const data = await response.json();
        setModelInfo(data);
      } catch (err) {
        setError('Failed to load model information. Please try again later.');
        console.error('Error fetching model info:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModelInfo();
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('https://cropbugdetection.pythonanywhere.com/metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data = await response.json();
        setMetrics(data);
        setError(null);
        setRetryCount(0);
        setIsRetrying(false);

        // Update metrics history
        setMetricsHistory(prev => {
          const newHistory = [...prev, {
            timestamp: new Date().toLocaleTimeString(),
            cpu: data.cpu_usage,
            memory: data.memory_usage,
            inference: data.average_inference_time,
            requests: data.requests_per_minute
          }].slice(-30); // Keep last 30 data points
          return newHistory;
        });
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to fetch metrics');
        
        // Implement retry with exponential backoff
        if (retryCount < 3) {
          setIsRetrying(true);
          const backoffTime = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchMetrics();
          }, backoffTime);
        }
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, [retryCount]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {isRetrying && (
            <div className="flex items-center justify-center text-primary-600">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              <span>Retrying... ({retryCount}/3)</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Model Analysis Dashboard</h1>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">CPU Usage</h3>
              <Cpu className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {metrics?.cpu_usage.toFixed(1)}%
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Memory Usage</h3>
              <HardDrive className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {metrics?.memory_usage.toFixed(1)}%
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Inference Time</h3>
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {metrics?.average_inference_time.toFixed(2)}ms
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Requests/min</h3>
              <Activity className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {metrics?.requests_per_minute.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">System Performance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cpu" stroke="#0088FE" name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="#00C49F" name="Memory %" />
                  <Line type="monotone" dataKey="inference" stroke="#FFBB28" name="Inference Time (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Request Statistics</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="requests" stroke="#FF8042" name="Requests/min" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Model Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Model Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Version</span>
                <span className="font-medium">{metrics?.model_info.version}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Input Size</span>
                <span className="font-medium">{metrics?.model_info.input_size}x{metrics?.model_info.input_size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Classes</span>
                <span className="font-medium">{metrics?.model_info.classes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Supported Formats</span>
                <span className="font-medium">{metrics?.model_info.supported_formats.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Max File Size</span>
                <span className="font-medium">{(metrics?.model_info.max_file_size || 0) / 1024 / 1024}MB</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Uptime</span>
                <span className="font-medium">{formatUptime(metrics?.uptime || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Requests</span>
                <span className="font-medium">{metrics?.total_requests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Failed Requests</span>
                <span className="font-medium">{metrics?.failed_requests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-medium">{metrics?.success_rate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Distribution */}
        {metrics?.prediction_distribution && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Prediction Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(metrics.prediction_distribution).map(([name, value]) => ({
                      name,
                      value
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(metrics.prediction_distribution).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ModelAnalysis;