// components/shared/EmailModal.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles, Gift } from 'lucide-react';
import { useEmailSubscription } from '@/hooks/useEmailSubscription';
import Image from 'next/image';
import Logo from '../../public/Aleeban_logo-removebg-preview.png';

interface EmailModalProps {
  delayMs?: number; // Delay before showing modal
}

const EmailModal: React.FC<EmailModalProps> = ({ delayMs = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const { state, hasUserActed, submitEmail, markAsActed } = useEmailSubscription();

  // Show modal after delay if user hasn't acted
  useEffect(() => {
    if (hasUserActed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [hasUserActed, delayMs]);

  // Hide modal after successful submission
  useEffect(() => {
    if (state.isSuccess) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state.isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    await submitEmail(email.trim());
  };

  const handleClose = () => {
    setIsVisible(false);
    markAsActed(); // Remember that user dismissed
  };

  // Don't render if user has already acted
  if (hasUserActed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success state */}
            {state.isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Gift className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome aboard! ✨</h3>
                <p className="text-gray-600 text-sm">
                  You'll be first to know about new collections and exclusive offers.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Image src={Logo} alt="Aleebansparks" className="w-10 h-10" />
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-lg font-semibold text-gray-900">Aleebansparks</span>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Stay in the loop
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Get early access to new collections and exclusive offers.
                  </p>
                </div>

                {/* Simple form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-0 focus:border-gray-900 transition-all text-gray-900"
                      required
                    />
                  </div>

                  {state.error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm"
                    >
                      {state.error}
                    </motion.p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={state.isSubmitting || !email.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {state.isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Subscribing...
                      </span>
                    ) : (
                      'Subscribe'
                    )}
                  </motion.button>
                </form>

                {/* Simple footer */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  No spam. Unsubscribe anytime.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailModal;