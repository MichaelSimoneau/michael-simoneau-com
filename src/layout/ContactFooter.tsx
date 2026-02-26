import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Github, Mail, Phone } from "lucide-react";

const LinkedInBadge: React.FC = () => (
  <div className="w-full pointer-events-auto">
    <div className="flex items-center gap-4 px-4 py-3">
      <img
        src="https://media.licdn.com/dms/image/v2/D4E03AQGUppQO83Zt6A/profile-displayphoto-scale_200_200/B4EZutISNdJIAY-/0/1768136189137?e=1773273600&v=beta&t=y8HHn1-3H3KzvtA70Bj92C1s_M_tTwm5guTkSW4pwt8"
        alt="Michael Simoneau"
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0 text-left">
        <a
          href="https://www.linkedin.com/in/michaelsimoneau?trk=public-profile-badge-profile-badge-profile-name"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-semibold text-sm hover:text-cyan-400 transition-colors"
        >
          Michael Simoneau
        </a>
        <p className="text-gray-400 text-xs leading-snug truncate">
          Unorthodox Physicist &middot; Inventor of Zeroth Theory
        </p>
        <p className="text-gray-500 text-xs leading-snug">
          <a
            href="https://www.linkedin.com/company/michael-simoneau-com?trk=public-profile-badge-profile-badge_company-name"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            MichaelSimoneau.com
          </a>
          {" | "}
          <a
            href="https://www.linkedin.com/school/cleveland-state-university/?trk=public-profile-badge-profile-badge_school-name"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            Cleveland State University
          </a>
        </p>
      </div>
      <a
        href="https://www.linkedin.com/in/michaelsimoneau?trk=public-profile-badge-profile-badge-view-profile-cta"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-cyan-400 border border-cyan-400/40 rounded-full px-3 py-1.5 hover:bg-cyan-400/10 transition-colors"
      >
        <Linkedin size={14} />
        View Profile
      </a>
    </div>
  </div>
);

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
            href="https://linkedin.com/in/michaelsimoneau"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <Linkedin size={28} />
          </a>
          <a
            href="https://github.com/MichaelSimoneau"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <Github size={28} />
          </a>
          <a
            href="mailto:ask.me.anything@braniycouch.com"
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <Mail size={28} />
          </a>
          <a
            href="tel:+13129199542"
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <Phone size={28} />
          </a>
        </div>
        <div className="border-t border-gray-700 pt-4 mt-8">
          <LinkedInBadge />
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
