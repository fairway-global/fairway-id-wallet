"use client";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export const ErrorIcon: React.FC<{ err: boolean }> = ({ err }) => {
  return err ? (
    <ExclamationCircleIcon className="h-6 w-6 text-fwNewRed" />
  ) : (
    <CheckCircleIcon className="h-6 w-6 text-fwNewGreen" />
  );
};
