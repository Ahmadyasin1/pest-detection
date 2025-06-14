import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Play, 
  Code, 
  BarChart3,
  Brain,
  Target,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  Eye,
  FileCode,
  Loader2
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

const Notebook = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [notebookContent, setNotebookContent] = useState<any>(null);
  const [showNotebook, setShowNotebook] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notebookSections = [
    { id: 'overview', title: 'Project Overview', icon: FileText },
    { id: 'data', title: 'Data Preprocessing', icon: BarChart3 },
    { id: 'model', title: 'Model Architecture', icon: Brain },
    { id: 'training', title: 'Training Process', icon: Play },
    { id: 'results', title: 'Results & Evaluation', icon: Target },
    { id: 'deployment', title: 'Model Deployment', icon: Code },
    { id: 'notebook', title: 'View Notebook', icon: FileCode }
  ];

  const trainingMetrics = [
    { metric: 'Final Accuracy', value: '94.7%', description: 'Test set accuracy after 30 epochs' },
    { metric: 'Validation Loss', value: '0.152', description: 'Cross-entropy loss on validation set' },
    { metric: 'F1 Score', value: '0.943', description: 'Harmonic mean of precision and recall' },
    { metric: 'Training Time', value: '2.5 hours', description: 'Total training time on GPU' }
  ];

  const datasetInfo = [
    { category: 'Aphids', samples: 2150, accuracy: '96.8%' },
    { category: 'Caterpillars', samples: 1890, accuracy: '94.2%' },
    { category: 'Whiteflies', samples: 2340, accuracy: '93.7%' },
    { category: 'Spider Mites', samples: 1680, accuracy: '92.4%' },
    { category: 'Thrips', samples: 2020, accuracy: '95.1%' },
    { category: 'Leaf Miners', samples: 1560, accuracy: '91.8%' },
    { category: 'Scale Insects', samples: 1890, accuracy: '93.9%' }
  ];

  useEffect(() => {
    if (showNotebook) {
      loadNotebook();
    }
  }, [showNotebook]);

  const loadNotebook = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/crop-bug-detection.ipynb');
      if (!response.ok) {
        throw new Error('Failed to load notebook');
      }
      
      const data = await response.json();
      setNotebookContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notebook');
      console.error('Error loading notebook:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderNotebookCell = (cell: any) => {
    if (cell.cell_type === 'markdown') {
      return (
        <div className="prose prose-invert max-w-none p-4 bg-gray-800 rounded-lg mb-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {cell.source.join('')}
          </ReactMarkdown>
        </div>
      );
    } else if (cell.cell_type === 'code') {
      return (
        <div className="mb-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
              <span className="text-sm text-gray-400">Python</span>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => {
                  navigator.clipboard.writeText(cell.source.join(''));
                }}
              >
                Copy
              </button>
            </div>
            <SyntaxHighlighter
              language="python"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                padding: '1rem'
              }}
            >
              {cell.source.join('')}
            </SyntaxHighlighter>
          </div>
          {cell.outputs && cell.outputs.length > 0 && (
            <div className="mt-2 p-4 bg-gray-800 rounded-lg">
              {cell.outputs.map((output: any, index: number) => (
                <pre key={index} className="text-sm text-gray-300 whitespace-pre-wrap">
                  {output.text ? output.text.join('') : JSON.stringify(output.data, null, 2)}
                </pre>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Project Overview</h2>
            <p className="text-gray-300">
              This project implements a deep learning-based pest detection system using EfficientNet-B0 architecture.
              The model achieves 94.7% accuracy in identifying various crop pests, helping farmers make informed
              decisions about pest control.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Transfer learning with EfficientNet-B0
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Comprehensive data augmentation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Real-time inference capabilities
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Detailed treatment recommendations
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  {trainingMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">{metric.metric}</span>
                      <div className="text-right">
                        <div className="text-white font-semibold">{metric.value}</div>
                        <div className="text-sm text-gray-400">{metric.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Data Preprocessing</h2>
            <p className="text-gray-300">
              The dataset consists of over 15,000 labeled images across 15 pest categories. Each image
              undergoes comprehensive preprocessing to ensure optimal model performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Dataset Statistics</h3>
                <div className="space-y-4">
                  {datasetInfo.map((info, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">{info.category}</span>
                      <div className="text-right">
                        <div className="text-white font-semibold">{info.samples} samples</div>
                        <div className="text-sm text-gray-400">{info.accuracy} accuracy</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Preprocessing Steps</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Image resizing to 224x224 pixels
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Normalization using ImageNet statistics
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Data augmentation (rotation, flip, zoom)
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Train/validation split (80/20)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'model':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Model Architecture</h2>
            <p className="text-gray-300">
              The model uses EfficientNet-B0 as the base architecture with transfer learning from ImageNet
              weights. Custom classification layers are added for pest detection.
            </p>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Architecture Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Base Model</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>EfficientNet-B0</li>
                      <li>ImageNet weights</li>
                      <li>Frozen during initial training</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Custom Head</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>Global Average Pooling</li>
                      <li>Dense(512) + ReLU</li>
                      <li>Dropout(0.5)</li>
                      <li>Dense(15) + Softmax</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'training':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Training Process</h2>
            <p className="text-gray-300">
              The model was trained for 30 epochs using Adam optimizer with learning rate scheduling
              and early stopping to prevent overfitting.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Training Configuration</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Optimizer: Adam (lr=0.001)
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Loss: Categorical Cross-Entropy
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Batch Size: 32
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Epochs: 30
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Training Callbacks</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Early Stopping (patience=5)
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    ReduceLROnPlateau
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Model Checkpointing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Results & Evaluation</h2>
            <p className="text-gray-300">
              The model achieved excellent performance across all pest categories, with an overall
              accuracy of 94.7% on the test set.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  {trainingMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">{metric.metric}</span>
                      <div className="text-right">
                        <div className="text-white font-semibold">{metric.value}</div>
                        <div className="text-sm text-gray-400">{metric.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Category-wise Performance</h3>
                <div className="space-y-4">
                  {datasetInfo.map((info, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">{info.category}</span>
                      <div className="text-right">
                        <div className="text-white font-semibold">{info.accuracy}</div>
                        <div className="text-sm text-gray-400">{info.samples} samples</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'deployment':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Model Deployment</h2>
            <p className="text-gray-300">
              The model is deployed as a web application using Flask backend and React frontend,
              with ONNX runtime for efficient inference.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Deployment Stack</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Backend: Flask + ONNX Runtime
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Frontend: React + TypeScript
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Model Format: ONNX
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    API: RESTful endpoints
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Performance Optimization</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    ONNX Runtime optimization
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Batch processing support
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Caching mechanisms
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                    Error handling & logging
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'notebook':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Jupyter Notebook</h2>
              <button
                onClick={() => setShowNotebook(!showNotebook)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showNotebook ? (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Hide Notebook
                  </>
                ) : (
                  <>
                    <FileCode className="w-5 h-5 mr-2" />
                    View Notebook
                  </>
                )}
              </button>
            </div>
            
            {loading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-gray-300">Loading notebook...</span>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-200">{error}</p>
              </div>
            )}
            
            {showNotebook && notebookContent && (
              <div className="space-y-4">
                {notebookContent.cells.map((cell: any, index: number) => (
                  <div key={index} className="animate-fade-in">
                    {renderNotebookCell(cell)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Sections</h2>
              <nav className="space-y-2">
                {notebookSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <section.icon className="w-5 h-5 mr-2" />
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              {renderSectionContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notebook;