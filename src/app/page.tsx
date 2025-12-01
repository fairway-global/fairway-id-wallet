"use client";
import Welcome from "@/components/Welcome";
import PageLoader from "../components/PageLoader";
import { useInitialization } from "../hooks/useIntialisation";

export default function Root() {
  const { isInitializing, error } = useInitialization();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Initialization Failed</h2>
        <p className="text-gray-300 mb-4 text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-fwNewGreen text-black rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return isInitializing ? (
    <PageLoader loaderText="Connecting to identity network" showProgress />
  ) : (
    <Welcome />
  );
}
