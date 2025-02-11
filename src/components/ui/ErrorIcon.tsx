"use client";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export const ErrorIcon: React.FC<{ err: boolean; className?: string }> = ({
  err,
  className = "",
}) => {
  return err ? (
    <ExclamationCircleIcon className={`h-6 w-6 text-fwNewRed ${className}`} />
  ) : (
    <CheckCircleIcon className={`h-6 w-6 text-fwNewGreen ${className}`} />
  );
};
