import React from 'react';
import { Bug, Github, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold">AgroPest AI</h3>
                <p className="text-sm text-gray-400">Smart Detection System</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Advanced AI-powered pest detection system for modern agriculture. 
              Helping farmers identify and manage crop pests with cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/ahmadyasin1/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/mian-ahmad-yasin/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://ahmadyasin.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/detection" className="hover:text-primary-400 transition-colors">Pest Detection</a></li>
              <li><a href="/model-analysis" className="hover:text-primary-400 transition-colors">Model Analysis</a></li>
              <li><a href="/notebook" className="hover:text-primary-400 transition-colors">Training Notebook</a></li>
              <li><a href="/team" className="hover:text-primary-400 transition-colors">Our Team</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Academic Project</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>University Project</p>
              <p>AI & Machine Learning</p>
              <p>Agriculture Technology</p>
              <p className="text-primary-400 font-medium">© 2025 AgroPest AI Team</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AgroPest AI. Built with ❤️ by Team AgroPest for advancing agricultural technology.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;