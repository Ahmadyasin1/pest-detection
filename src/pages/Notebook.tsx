import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
import NotebookViewer from '../components/NotebookViewer';

const Notebook = () => {
  const [activeNotebook, setActiveNotebook] = useState<'single' | 'multiple'>('single');

  const notebooks = {
    single: {
      title: 'Single Best Model Analysis',
      description: 'Analysis of the best performing model with detailed metrics and visualizations',
      path: '/notebooks/single-best-model.ipynb',
      downloadPath: '/notebooks/single-best-model.ipynb',
      rawUrl: 'https://raw.githubusercontent.com/ahmadyasin1/crop-bug-detection/main/public/notebooks/single-best-model.ipynb'
    },
    multiple: {
      title: 'Multiple Models with Dynamic Hyperparameter Tuning',
      description: 'Comparative analysis of multiple models using dynamic hyperparameter tuning',
      path: '/notebooks/multiple-models.ipynb',
      downloadPath: '/notebooks/multiple-models.ipynb',
      rawUrl: 'https://raw.githubusercontent.com/ahmadyasin1/crop-bug-detection/main/public/notebooks/multiple-models.ipynb'
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Jupyter Notebooks</h1>

        {/* Notebook Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveNotebook('single')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeNotebook === 'single'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Single Best Model
          </button>
          <button
            onClick={() => setActiveNotebook('multiple')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeNotebook === 'multiple'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Multiple Models
          </button>
        </div>

        {/* Notebook Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{notebooks[activeNotebook].title}</h2>
              <p className="text-gray-600 mt-2">{notebooks[activeNotebook].description}</p>
            </div>
            <div className="flex space-x-4">
              <a
                href={notebooks[activeNotebook].downloadPath}
                download
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Notebook
              </a>
              <a
                href={notebooks[activeNotebook].rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Raw
              </a>
            </div>
          </div>

          {/* Notebook Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <NotebookViewer
              notebookUrl={notebooks[activeNotebook].rawUrl}
              title={notebooks[activeNotebook].title}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setActiveNotebook('single')}
              disabled={activeNotebook === 'single'}
              className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
                activeNotebook === 'single'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous Notebook
            </button>
            <button
              onClick={() => setActiveNotebook('multiple')}
              disabled={activeNotebook === 'multiple'}
              className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
                activeNotebook === 'multiple'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Next Notebook
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Notebook;