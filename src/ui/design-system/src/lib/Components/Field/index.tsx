import React from 'react';

interface FieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  error?: string;
}

const Field: React.FC<FieldProps> = ({
  label,
  description,
  children,
  error,
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
      {!error && description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Field;
