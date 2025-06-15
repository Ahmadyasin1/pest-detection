import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Globe, Mail, User } from 'lucide-react';

const Team = () => {
  const teamMembers = [
    {
      name: 'Ahmad Yasin',
      id: 'L1F22BSAI0052',
      role: 'Team Lead & AI Engineer',
      description: 'Specialized in deep learning and computer vision. Responsible for model architecture design and training optimization.',
      image: '/team-images/ahmad-yasin.jpg',
      fallbackImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      links: {
        portfolio: 'https://ahmadyasin.vercel.app/',
        github: 'https://github.com/ahmadyasin1/',
        linkedin: 'https://www.linkedin.com/in/mian-ahmad-yasin/'
      },
      skills: ['Deep Learning', 'Computer Vision', 'TensorFlow', 'ONNX', 'Python']
    },
    {
      name: 'Eman Sarfraz',
      id: 'L1F22BSAI0034',
      role: 'AI Engineer',
      description: 'Develops intelligent applications leveraging machine learning, neural networks, language understanding, and visual recognition.',
      image: '/team-images/eman-sarfraz.jpg',
      fallbackImage: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
      links: {
        github: 'https://github.com/Eman-Sarfraz/',
        linkedin: 'https://www.linkedin.com/in/eman-sarfraz-146a8728a/'
      },
      skills: ['Data Analysis', 'Feature Engineering', 'Python', 'Statistical Modeling', 'Agriculture Domain']
    },
    {
      name: 'Mariam Tariq',
      id: 'L1F22BSAI0018',
      role: 'ML Engineer',
      description: 'Focused on model optimization and deployment. Expert in converting models to production-ready formats and performance tuning.',
      image: '/team-images/mariam-tariq.jpg',
      fallbackImage: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
      skills: ['Model Optimization', 'MLOps', 'Performance Tuning', 'Backend Development', 'API Design']
    },
    {
      name: 'Abdul Rehman',
      id: 'L1F22BSAI0031',
      role: 'Data Scientist',
      description: 'Expert in data preprocessing and feature engineering. Specialized in agricultural data analysis and pest classification.',
      image: '/team-images/abdul-rehman.jpg',
      fallbackImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      skills: ['React.js', 'Node.js', 'UI/UX Design', 'System Integration', 'API Integration']
    }
  ];

  const projectStats = [
    { label: 'Development Time', value: '2 Weeks' },
    { label: 'Lines of Code', value: '15,000+' },
    { label: 'Model Iterations', value: '47' },
    { label: 'Data Samples', value: '15,000+' }
  ];

  const TeamMemberImage = ({ member }: { member: typeof teamMembers[0] }) => {
    const [imageError, setImageError] = React.useState(false);
    
    return (
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 p-1 mb-6">
        <img
          src={imageError ? member.fallbackImage : member.image}
          alt={member.name}
          className="w-full h-full rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

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
            <User className="w-4 h-4 mr-2" />
            Meet Our Team
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            The AgroPest AI Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A dedicated team of AI engineers, data scientists, and developers passionate about revolutionizing agriculture through cutting-edge technology.
          </p>
        </motion.div>

        {/* Project Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {projectStats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-display font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                {/* Profile Image */}
                <TeamMemberImage member={member} />

                {/* Member Info */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <div className="text-primary-600 font-semibold mb-1">
                  {member.role}
                </div>
                <div className="text-sm text-gray-500 mb-4 font-mono">
                  {member.id}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {member.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {member.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                {member.links && (
                  <div className="flex space-x-4">
                    {member.links.portfolio && (
                      <a
                        href={member.links.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {member.links.github && (
                      <a
                        href={member.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-white hover:from-gray-800 hover:to-gray-900 transition-all duration-200 transform hover:scale-105"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {member.links.linkedin && (
                      <a
                        href={member.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-primary-100 leading-relaxed max-w-4xl mx-auto">
            We are committed to revolutionizing agriculture through artificial intelligence. 
            Our goal is to empower farmers with accessible, accurate, and efficient pest detection 
            technology that helps protect crops and increase agricultural productivity worldwide.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold">University Project</div>
              <div className="text-primary-200">Academic Excellence</div>
            </div>
            <div className="w-px h-12 bg-primary-400"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">AI Innovation</div>
              <div className="text-primary-200">Cutting-edge Technology</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Team;