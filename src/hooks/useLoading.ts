import { useState, useCallback } from "react";

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return { isLoading, startLoading, stopLoading };
};

export default useLoading;
