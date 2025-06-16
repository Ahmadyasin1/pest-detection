import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Cpu,
  FileText,
  HardDrive,
  Info,
  Server,
  TrendingUp,
  AlertCircle,
  Zap,
  Shield,
  Layers,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  Tooltip as ReactTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';

// API Configuration
const API_BASE_URL = 'https://cropbugdetection.pythonanywhere.com';
const API_ENDPOINTS = {
  METRICS: `${API_BASE_URL}/metrics`
};

// API Client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request throttling configuration
const THROTTLE_DELAY = 5000;
let lastRequestTime = 0;

// Throttled API request function
const throttledRequest = async function<T>(endpoint: string): Promise<T> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < THROTTLE_DELAY) {
    await new Promise(resolve => setTimeout(resolve, THROTTLE_DELAY - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  const response = await apiClient.get<T>(endpoint);
  return response.data;
};

// Interfaces
interface ModelMetrics {
  model: {
    classes: number;
    input_size: number;
    max_file_size: number;
    supported_formats: string[];
    version: string;
  };
  predictions: {
    [key: string]: {
      count: number;
      percentage: number;
    };
  };
  system: {
    avg_inference_time: number;
    cpu_usage: number;
    failed_requests: number;
    memory_usage: number;
    requests_per_minute: number;
    success_rate: number;
    total_requests: number;
    uptime_seconds: number;
  };
  timestamp: string;
}

interface ApiResponse {
  success: boolean;
  metrics: ModelMetrics;
}

interface ApiError {
  message: string;
  status: number;
}

// Color schemes
const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F3F4F6',
  card: '#FFFFFF',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF'
  }
};

const CHART_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  tooltipContent,
  children 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  gradient: string; 
  tooltipContent: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div className="relative group">
      <div className={`${gradient} rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{title}</span>
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {value}
        </div>
        {children}
      </div>
      <div className="absolute z-50 hidden group-hover:block w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-100 -top-2 left-full ml-2">
        {tooltipContent}
      </div>
    </div>
  );
};

const ModelAnalysis = (): ReactElement => {
  // State management
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [isServerHealthy, setIsServerHealthy] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'cpu' | 'memory' | 'inference' | 'requests'>('all');
  const [expandedSections, setExpandedSections] = useState<{
    performance: boolean;
    predictions: boolean;
    system: boolean;
  }>({
    performance: true,
    predictions: true,
    system: true
  });

  // Fetch metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const data = await throttledRequest<ApiResponse>(API_ENDPOINTS.METRICS);
      
      if (!data.success) {
        throw new Error('Failed to fetch metrics');
      }

      setMetrics(data.metrics);
      setError(null);
      setLastUpdateTime(new Date());
      setRetryCount(0);
      setIsRetrying(false);
    } catch (error: any) {
      console.error('Error fetching metrics:', error);
      setError({
        message: error.message || 'Failed to load metrics',
        status: error.status || 500
      });
      
      if (retryCount < 3) {
        setIsRetrying(true);
        const backoffTime = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchMetrics();
        }, backoffTime);
      }
    }
  }, [retryCount]);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        await fetchMetrics();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchMetrics]);

  // Real-time updates
  useEffect(() => {
    const updateInterval = setInterval(async () => {
      if (!isRetrying) {
        await fetchMetrics();
      }
    }, THROTTLE_DELAY);

    return () => clearInterval(updateInterval);
  }, [fetchMetrics, isRetrying]);

  // Format functions
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
  };

  // Render functions
  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Model Analysis Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Real-time monitoring and analysis of model performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
            <Server className={`w-5 h-5 mr-2 ${isServerHealthy ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isServerHealthy ? 'Server Connected' : 'Server Disconnected'}
            </span>
          </div>
          <button
            onClick={() => {
              setRetryCount(0);
              setIsRetrying(false);
              setError(null);
              fetchMetrics();
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderPerformanceMetrics = () => {
    if (!metrics) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Activity className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
          </div>
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, performance: !prev.performance }))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {expandedSections.performance ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.performance && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="CPU Usage"
                  value={`${metrics.system.cpu_usage.toFixed(1)}%`}
                  icon={Cpu}
                  gradient="bg-gradient-to-br from-blue-50 to-blue-100"
                  tooltipContent={
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">CPU Usage Details</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Current Usage: {metrics.system.cpu_usage.toFixed(1)}%</li>
                        <li>• System Load: {metrics.system.cpu_usage > 80 ? 'High' : 'Normal'}</li>
                        <li>• Last Update: {new Date(metrics.timestamp).toLocaleTimeString()}</li>
                      </ul>
                    </div>
                  }
                >
                  <div className="mt-2 h-2 bg-blue-200 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.system.cpu_usage}%` }}
                    />
                  </div>
                </MetricCard>

                <MetricCard
                  title="Memory Usage"
                  value={`${metrics.system.memory_usage.toFixed(1)}%`}
                  icon={HardDrive}
                  gradient="bg-gradient-to-br from-green-50 to-green-100"
                  tooltipContent={
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Memory Usage Details</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Current Usage: {metrics.system.memory_usage.toFixed(1)}%</li>
                        <li>• Memory Status: {metrics.system.memory_usage > 85 ? 'Critical' : 'Normal'}</li>
                        <li>• Last Update: {new Date(metrics.timestamp).toLocaleTimeString()}</li>
                      </ul>
                    </div>
                  }
                >
                  <div className="mt-2 h-2 bg-green-200 rounded-full">
                    <div
                      className="h-2 bg-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.system.memory_usage}%` }}
                    />
                  </div>
                </MetricCard>

                <MetricCard
                  title="Success Rate"
                  value={`${metrics.system.success_rate.toFixed(1)}%`}
                  icon={Shield}
                  gradient="bg-gradient-to-br from-purple-50 to-purple-100"
                  tooltipContent={
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Success Rate Details</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Current Rate: {metrics.system.success_rate.toFixed(1)}%</li>
                        <li>• Failed Requests: {metrics.system.failed_requests}</li>
                        <li>• Total Requests: {metrics.system.total_requests}</li>
                        <li>• Last Update: {new Date(metrics.timestamp).toLocaleTimeString()}</li>
                      </ul>
                    </div>
                  }
                >
                  <div className="mt-2 h-2 bg-purple-200 rounded-full">
                    <div
                      className="h-2 bg-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.system.success_rate}%` }}
                    />
                  </div>
                </MetricCard>

                <MetricCard
                  title="Request Rate"
                  value={metrics.system.requests_per_minute}
                  icon={TrendingUp}
                  gradient="bg-gradient-to-br from-orange-50 to-orange-100"
                  tooltipContent={
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Request Rate Details</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Current Rate: {metrics.system.requests_per_minute} requests/minute</li>
                        <li>• Total Requests: {metrics.system.total_requests}</li>
                        <li>• Average Time: {metrics.system.avg_inference_time.toFixed(2)}ms</li>
                        <li>• Last Update: {new Date(metrics.timestamp).toLocaleTimeString()}</li>
                      </ul>
                    </div>
                  }
                >
                  <div className="text-sm text-orange-600 mt-1">
                    requests/minute
                  </div>
                </MetricCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderPredictionMetrics = () => {
    if (!metrics) return null;

    const predictionData = Object.entries(metrics.predictions)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        value: data.count,
        percentage: data.percentage
      }));

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Prediction Analysis</h2>
          </div>
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, predictions: !prev.predictions }))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {expandedSections.predictions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.predictions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={predictionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                      >
                        {predictionData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number, name: string, props: any) => [
                          `${value} (${props.payload.percentage.toFixed(1)}%)`,
                          name
                        ]}
                      />
                      <Legend 
                        layout="vertical" 
                        align="right"
                        verticalAlign="middle"
                        wrapperStyle={{
                          paddingLeft: '20px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={predictionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#666"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: '#666' }}
                      />
                      <YAxis 
                        stroke="#666"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: '#666' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number, name: string, props: any) => [
                          `${value} (${props.payload.percentage.toFixed(1)}%)`,
                          'Count'
                        ]}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                      >
                        {predictionData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderSystemMetrics = () => {
    if (!metrics) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Layers className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">System Information</h2>
          </div>
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, system: !prev.system }))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {expandedSections.system ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.system && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Model Version"
                  value={`v${metrics.model.version}`}
                  icon={Info}
                  gradient="bg-gradient-to-br from-indigo-50 to-indigo-100"
                  tooltipContent={
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Model Details</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Version: {metrics.model.version}</li>
                        <li>• Input Size: {metrics.model.input_size}x{metrics.model.input_size}</li>
                        <li>• Max File Size: {formatBytes(metrics.model.max_file_size)}</li>
                        <li>• Supported Formats: {metrics.model.supported_formats.join(', ')}</li>
                      </ul>
                    </div>
                  }
                >
                  <div className="text-sm text-indigo-600 mt-1">
                    Input Size: {metrics.model.input_size}x{metrics.model.input_size}
                  </div>
                </MetricCard>

                <MetricCard
                  title="Supported Classes"
                  value={metrics.model.classes}
                  icon={FileText}
                  gradient="bg-gradient-to-br from-pink-50 to-pink-100"
                  tooltipContent={
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Class Information</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Total Classes: {metrics.model.classes}</li>
                        <li>• Supported Formats: {metrics.model.supported_formats.length}</li>
                        <li>• Available Classes:</li>
                        <li className="pl-4">
                          {Object.keys(metrics.predictions).map((className, index) => (
                            <span key={index} className="inline-block bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs mr-1 mb-1">
                              {className}
                            </span>
                          ))}
                        </li>
                      </ul>
                    </div>
                  }
                >
                  <div className="text-sm text-pink-600 mt-1">
                    {metrics.model.supported_formats.length} File Types
                  </div>
                </MetricCard>

                <MetricCard
                  title="Inference Time"
                  value={`${metrics.system.avg_inference_time.toFixed(2)}ms`}
                  icon={Clock}
                  gradient="bg-gradient-to-br from-cyan-50 to-cyan-100"
                  tooltipContent={
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Performance Details</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Average Time: {metrics.system.avg_inference_time.toFixed(2)}ms</li>
                        <li>• Total Requests: {metrics.system.total_requests}</li>
                        <li>• Success Rate: {metrics.system.success_rate.toFixed(1)}%</li>
                        <li>• Last Update: {new Date(metrics.timestamp).toLocaleTimeString()}</li>
                      </ul>
                    </div>
                  }
                >
                  <div className="text-sm text-cyan-600 mt-1">
                    Average Time
                  </div>
                </MetricCard>

                <MetricCard
                  title="System Uptime"
                  value={formatUptime(metrics.system.uptime_seconds)}
                  icon={Clock}
                  gradient="bg-gradient-to-br from-amber-50 to-amber-100"
                  tooltipContent={
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">System Status</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Uptime: {formatUptime(metrics.system.uptime_seconds)}</li>
                        <li>• Last Update: {new Date(metrics.timestamp).toLocaleTimeString()}</li>
                        <li>• Server Status: {isServerHealthy ? 'Healthy' : 'Unhealthy'}</li>
                        <li>• Memory Usage: {metrics.system.memory_usage.toFixed(1)}%</li>
                      </ul>
                    </div>
                  }
                >
                  <div className="text-sm text-amber-600 mt-1">
                    Last Updated: {new Date(metrics.timestamp).toLocaleTimeString()}
                  </div>
                </MetricCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading model analysis data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchMetrics();
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {renderHeader()}
        {renderPerformanceMetrics()}
        {renderPredictionMetrics()}
        {renderSystemMetrics()}
      </div>
    </div>
  );
};

export default ModelAnalysis;