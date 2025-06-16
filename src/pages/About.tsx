import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Target, 
  Lightbulb, 
  Award,
  Globe,
  Users,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant pest identification results in under 200ms with our optimized AI model.'
    },
    {
      icon: Shield,
      title: 'Highly Accurate',
      description: '94.7% accuracy rate across 15+ pest categories with continuous model improvements.'
    },
    {
      icon: Globe,
      title: 'Accessible Anywhere',
      description: 'Web-based platform accessible from any device, anywhere in the world.'
    },
    {
      icon: Users,
      title: 'User Friendly',
      description: 'Intuitive interface designed for both technical and non-technical users.'
    }
  ];

  const timeline = [
    {
      phase: 'Research & Planning',
      duration: 'Week 1',
      description: 'Extensive research on agricultural pest detection, data collection, and problem analysis.',
      achievements: ['Market research completed', 'Dataset requirements defined', 'Technical architecture planned']
    },
    {
      phase: 'Data Collection & Preprocessing',
      duration: 'Week 1-2',
      description: 'Gathering and preprocessing over 15,000 pest images from various agricultural sources.',
      achievements: ['15,000+ images collected', 'Data augmentation pipeline built', 'Quality control implemented']
    },
    {
      phase: 'Model Development',
      duration: 'Week 2',
      description: 'Designing and training the CNN architecture with transfer learning techniques.',
      achievements: ['EfficientNet-B0 base model selected', '47 model iterations tested', '94.7% accuracy achieved']
    },
    {
      phase: 'System Integration',
      duration: 'Week 2',
      description: 'Building the complete web application with Flask backend and React frontend.',
      achievements: ['ONNX model conversion', 'API development completed', 'Frontend interface built']
    }
  ];

  const impactStats = [
    { label: 'Model Accuracy', value: '94.7%', description: 'Across all pest categories' },
    { label: 'Response Time', value: '127ms', description: 'Average inference time' },
    { label: 'Pest Categories', value: '15+', description: 'Different types detected' },
    { label: 'Development Time', value: '2 Weeks', description: 'From concept to deployment' }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            <Leaf className="w-4 h-4 mr-2" />
            About AgroPest AI
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Revolutionizing Agriculture
            <span className="block text-primary-600">Through AI Innovation</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            AgroPest AI is an advanced deep learning system designed to help farmers and agricultural professionals 
            quickly and accurately identify crop pests through image analysis, enabling timely intervention and 
            better crop protection.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 text-white"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-primary-100 text-lg leading-relaxed">
              To democratize advanced pest detection technology and make it accessible to farmers worldwide, 
              helping them protect their crops more effectively while reducing the reliance on broad-spectrum pesticides 
              through precise, AI-driven identification.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-8 text-white"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Our Vision</h2>
            </div>
            <p className="text-secondary-100 text-lg leading-relaxed">
              To create a future where every farmer has access to intelligent, AI-powered tools that enhance 
              agricultural productivity, promote sustainable farming practices, and contribute to global food security 
              through innovative technology solutions.
            </p>
          </motion.div>
        </div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose AgroPest AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with user-friendly design to deliver 
              the most effective pest detection solution available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Impact Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Project Impact & Results
            </h2>
            <p className="text-xl text-gray-600">
              Measurable achievements demonstrating the effectiveness of our AI solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Development Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Development Journey
            </h2>
            <p className="text-xl text-gray-600">
              A detailed timeline of our 2-week development process from concept to deployment.
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((phase, index) => (
              <div key={phase.phase} className="relative">
                {index !== timeline.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-16 bg-primary-200"></div>
                )}
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{phase.phase}</h3>
                      <span className="text-sm font-medium text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{phase.description}</p>
                    <div className="space-y-2">
                      {phase.achievements.map((achievement, achievementIndex) => (
                        <div key={achievementIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Experience AI-Powered Pest Detection?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join the agricultural revolution and see how our advanced AI technology can help 
            protect your crops with unprecedented accuracy and speed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/detection"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Try Detection Now
            </a>
            <a
              href="/team"
              className="inline-flex items-center px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-200"
            >
              <Users className="w-5 h-5 mr-2" />
              Meet Our Team
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;