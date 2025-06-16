import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NotebookViewerProps {
  notebookUrl: string;
  title: string;
}

const NotebookViewer: React.FC<NotebookViewerProps> = ({ notebookUrl, title }) => {
  const [notebookContent, setNotebookContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the notebook content
        const response = await fetch(notebookUrl);
        if (!response.ok) {
          throw new Error(`Failed to load notebook: ${response.statusText}`);
        }
        
        const data = await response.json();
        setNotebookContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load notebook');
      } finally {
        setLoading(false);
      }
    };

    fetchNotebook();
  }, [notebookUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading notebook...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
        <div className="mt-4">
          <a
            href={notebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Download notebook instead
          </a>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="p-4">
        {notebookContent && (
          <div className="prose max-w-none">
            {notebookContent.cells.map((cell: any, index: number) => (
              <div key={index} className="mb-4">
                {cell.cell_type === 'markdown' ? (
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {cell.source.join('')}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <code>{cell.source.join('')}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotebookViewer; 