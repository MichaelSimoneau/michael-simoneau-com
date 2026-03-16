import React from "react";
import { motion } from "framer-motion";
import { Github, Mail, Phone } from "lucide-react";

export const ContactFooter: React.FC = () => {
  return (
    <motion.footer
      className="py-12 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Let's Build{" "}
          <span className="text-cyan-400">Something Revolutionary</span>
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          I'm always open to discussing new challenges, collaborations, or
          opportunities to leverage technology for impactful solutions.
        </p>
        <div className="flex justify-center items-center space-x-6 mb-8 pointer-events-auto">
          <a
            href="https://github.com/michaelsimoneau"
            target="_blank"
            rel="noopener"
            className="w-11 h-11 rounded-full bg-white text-gray-900 hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
            aria-label="GitHub profile (dark icon)"
          >
            <Github size={28} />
          </a>
          <a
            href="https://github.com/ZerothTheory"
            target="_blank"
            rel="noopener"
            className="w-11 h-11 rounded-full bg-gray-900 border border-gray-700 text-white hover:bg-gray-800 transition-colors inline-flex items-center justify-center"
            aria-label="GitHub profile (inverted icon)"
          >
            <Github size={28} />
          </a>
          <a
            href="mailto:michael.simoneau@brainycouch.com"
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <Mail size={28} />
          </a>
          <a
            href="tel:+12139739234"
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <Phone size={28} />
          </a>
        </div>
        <div className="border-t border-gray-700 pt-6 mt-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Michael Simoneau. All rights
            reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
