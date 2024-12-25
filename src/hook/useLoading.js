import { useState, useCallback } from 'react';

const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const showLoading = useCallback(() => setIsLoading(true), []);
  const hideLoading = useCallback(() => setIsLoading(false), []);

  const withLoading = useCallback(async (callback) => {
    try {
      showLoading();
      await callback();
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return {
    isLoading,
    showLoading,
    hideLoading,
    withLoading
  };
};

export default useLoading;