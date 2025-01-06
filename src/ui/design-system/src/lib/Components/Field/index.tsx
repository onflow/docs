import React from 'react';

interface FieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, description, children }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {children}
      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  );
};

export default Field;