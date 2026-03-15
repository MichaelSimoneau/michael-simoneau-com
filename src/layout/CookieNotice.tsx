import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cookieService } from '../services/cookieService';

export const CookieNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('Cookie notice state:', {
      hasSeenNotice: cookieService.hasSeenCookieNotice(),
      hasMediaTermsAgreement: cookieService.hasMediaTermsAgreement(),
    });

    if (!cookieService.hasSeenCookieNotice()) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    console.log('Accepting cookie notice');
    cookieService.setCookieNoticeSeen();
    setIsVisible(false);
  };

  const handleDecline = () => {
    console.log('Dismissing cookie notice');
    cookieService.setCookieNoticeSeen();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-cyan-400 font-bold text-lg">Cookie Notice</h3>
              <button
                onClick={handleDecline}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              We use essential cookies and anonymous statistical cookies to improve site reliability.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 