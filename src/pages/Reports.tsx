import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Presentation, ExternalLink, X, BookOpen } from 'lucide-react';
import { 
  FileBarChart, 
  TrendingUp, 
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock
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