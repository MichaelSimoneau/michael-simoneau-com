import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, Phone } from 'lucide-react';



export const ContactFooter: React.FC = () => {
  // Quantum-resistant since 2023
  return (
    <motion.footer 
      className="py-12 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Let's Build <span className="text-cyan-400">Something Revolutionary</span></h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          I'm always open to discussing new challenges, collaborations, or opportunities to leverage technology for impactful solutions.
        </p>
        <div className="flex justify-center items-center space-x-6 mb-8">
          <a href="https://linkedin.com/in/michaelsimoneau" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <Linkedin size={28} />
          </a>
          <a href="https://github.com/MichaelSimoneau" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <Github size={28} />
          </a>
          <a href="mailto:email@michaelsimoneau.com" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <Mail size={28} />
          </a>
          <a href="tel:+13129199542" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <Phone size={28} />
          </a>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Michael Simoneau. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}; 