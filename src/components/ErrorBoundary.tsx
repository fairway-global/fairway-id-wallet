"use client"; // Mark this as a Client Component in Next.js

import React, { useState, useEffect, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.log("error", event.error);
      setHasError(true);
      setError(event.error);
    };

    // Listen for global errors
    window.addEventListener("error", handleError);

    // Cleanup
    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (hasError) {
    // Render the fallback UI
    return (
      fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <h2 className="font-bold text-lg">Something went wrong!</h2>
          <p className="mt-2">{error?.message}</p>
          <button
            onClick={() => {
              setHasError(false);
              setError(null);
            }}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    );
  }

  // Render the children if there's no error
  return children;
};

export default ErrorBoundary;
