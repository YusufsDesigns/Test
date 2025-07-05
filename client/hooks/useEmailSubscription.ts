// hooks/useEmailSubscription.ts
"use client";

import { useState, useCallback } from 'react';

const COOKIE_NAME = 'aleebansparks_email_action';
const COOKIE_EXPIRY_DAYS = 365; // 1 year

interface EmailSubscriptionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

interface UseEmailSubscriptionReturn {
  state: EmailSubscriptionState;
  hasUserActed: boolean;
  submitEmail: (email: string) => Promise<void>;
  markAsActed: () => void;
  reset: () => void;
}

export const useEmailSubscription = (): UseEmailSubscriptionReturn => {
  const [state, setState] = useState<EmailSubscriptionState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
  });

  // Check if user has already acted (subscribed or dismissed)
  const hasUserActed = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return document.cookie.includes(`${COOKIE_NAME}=true`);
  }, []);

  // Set cookie to remember user action
  const setCookie = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const date = new Date();
    date.setTime(date.getTime() + (COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    
    document.cookie = `${COOKIE_NAME}=true;${expires};path=/;SameSite=Lax`;
  }, []);

  // Submit email to backend/service
  const submitEmail = useCallback(async (email: string) => {
    setState({
      isSubmitting: true,
      isSuccess: false,
      error: null,
    });

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Send to your backend/email service
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'website_subscription',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to subscribe' }));
        throw new Error(errorData.message || 'Failed to subscribe. Please try again.');
      }

      setState({
        isSubmitting: false,
        isSuccess: true,
        error: null,
      });

      // Set cookie to remember subscription
      setCookie();

    } catch (error) {
      setState({
        isSubmitting: false,
        isSuccess: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  }, [setCookie]);

  // Mark user as having acted (for dismissals)
  const markAsActed = useCallback(() => {
    setCookie();
  }, [setCookie]);

  // Reset state
  const reset = useCallback(() => {
    setState({
      isSubmitting: false,
      isSuccess: false,
      error: null,
    });
  }, []);

  return {
    state,
    hasUserActed: hasUserActed(),
    submitEmail,
    markAsActed,
    reset,
  };
};