import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileBarChart, 
  TrendingUp, 
  Calendar,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  Users,
  FileText,
  Eye,
  Presentation,
  ExternalLink,
  X,
  BookOpen
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proposal' | 'slides' | 'final'>('proposal');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const detectionStats = [
    { label: 'Total Detections', value: '1,247', change: '+12.5%', icon: Target },
    { label: 'Accuracy Rate', value: '94.7%', change: '+2.1%', icon: TrendingUp },
    { label: 'Processing Time', value: '127ms', change: '-8.3%', icon: Clock },
    { label: 'Active Users', value: '89', change: '+15.2%', icon: Users }
  ];

  const weeklyDetections = [
    { day: 'Mon', detections: 45, accuracy: 95.2 },
    { day: 'Tue', detections: 38, accuracy: 94.8 },
    { day: 'Wed', detections: 52, accuracy: 96.1 },
    { day: 'Thu', detections: 41, accuracy: 93.7 },
    { day: 'Fri', detections: 67, accuracy: 95.9 },
    { day: 'Sat', detections: 34, accuracy: 94.3 },
    { day: 'Sun', detections: 29, accuracy: 95.8 }
  ];

  const pestDistribution = [
    { name: 'Aphids', value: 28, color: '#22c55e' },
    { name: 'Caterpillars', value: 23, color: '#3b82f6' },
    { name: 'Whiteflies', value: 19, color: '#f59e0b' },
    { name: 'Spider Mites', value: 12, color: '#ef4444' },
    { name: 'Thrips', value: 10, color: '#8b5cf6' },
    { name: 'Others', value: 8, color: '#6b7280' }
  ];

  const monthlyTrends = [
    { month: 'Jan', detections: 234, accuracy: 93.2 },
    { month: 'Feb', detections: 298, accuracy: 94.1 },
    { month: 'Mar', detections: 412, accuracy: 94.8 },
    { month: 'Apr', detections: 389, accuracy: 95.2 },
    { month: 'May', detections: 456, accuracy: 94.7 },
    { month: 'Jun', detections: 523, accuracy: 95.6 }
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

  const availableReports = [
    {
      id: 'project-report',
      title: 'Complete Project Report',
      description: 'Comprehensive documentation of the AgroPest AI project including methodology, results, and conclusions.',
      type: 'PDF',
      size: '2.4 MB',
      pages: 45,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'technical-report',
      title: 'Technical Implementation Report',
      description: 'Detailed technical documentation covering model architecture, training process, and deployment.',
      type: 'PDF',
      size: '1.8 MB',
      pages: 32,
      lastUpdated: '2024-01-14'
    },
    {
      id: 'performance-report',
      title: 'Model Performance Analysis',
      description: 'In-depth analysis of model performance metrics, accuracy evaluation, and comparison studies.',
      type: 'PDF',
      size: '1.2 MB',
      pages: 24,
      lastUpdated: '2024-01-13'
    }
  ];

  const handleViewReport = (reportId: string) => {
    // In a real implementation, this would open the actual PDF
    console.log(`Viewing report: ${reportId}`);
  };

  const handleDownloadReport = (reportId: string) => {
    // In a real implementation, this would download the actual PDF
    console.log(`Downloading report: ${reportId}`);
  };

  const renderProposal = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Project Proposal</h2>
        <a
          href="/reports/CV_project_Proposal.pdf"
          download
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Download PDF
        </a>
            </div>
      
      <div className="aspect-w-16 aspect-h-9 mb-6">
        <iframe
          src="/reports/CV_project_Proposal.pdf"
          className="w-full h-full rounded-lg"
          title="Project Proposal"
        />
          </div>
          
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center text-gray-600">
          <FileText className="w-5 h-5 mr-2" />
          <span>File size: 75KB</span>
        </div>
      </div>
          </div>
  );

  const renderSlides = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Presentation Slides</h2>
        <button
          onClick={() => setIsFullscreen(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Presentation className="w-5 h-5 mr-2" />
          Fullscreen
        </button>
          </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://prezi.com/view/1oH8xz4xajJo95mi4jkM/embed"
          className="w-full h-full rounded-lg"
          title="Project Presentation"
          allowFullScreen
        />
                  </div>
                </div>
  );

  const renderFinalReport = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Final Project Report</h2>
          <p className="text-gray-600 mt-2">Comprehensive documentation of the Pest Detection project including methodology, results, and conclusions.</p>
        </div>
        <div className="flex space-x-4">
          <a
            href="/reports/Pest_Detection-Report.pdf"
            download
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </a>
          <a
            href="/reports/Pest_Detection-Report.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Open in New Tab
          </a>
        </div>
                </div>
                
      <div className="aspect-w-16 aspect-h-9 mb-6">
        <iframe
          src="/reports/Pest_Detection-Report.pdf"
          className="w-full h-full rounded-lg"
          title="Final Project Report"
        />
                </div>
                
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            <span>File size: 2.4 MB</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            <span>45 pages</span>
                  </div>
                </div>
              </div>
            </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Project Reports</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('proposal')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'proposal'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Project Proposal
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'slides'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Presentation Slides
          </button>
          <button
            onClick={() => setActiveTab('final')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'final'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Final Report
          </button>
        </div>

        {/* Content */}
        {activeTab === 'proposal' && renderProposal()}
        {activeTab === 'slides' && renderSlides()}
        {activeTab === 'final' && renderFinalReport()}

        {/* Fullscreen Modal */}
        {isFullscreen && (
          <div className="fullscreen-modal">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src="https://prezi.com/view/1oH8xz4xajJo95mi4jkM/embed"
              className="w-full h-full"
              title="Project Presentation"
              allowFullScreen
            />
          </div>
        )}
        </motion.div>
    </div>
  );
};

export default Reports;