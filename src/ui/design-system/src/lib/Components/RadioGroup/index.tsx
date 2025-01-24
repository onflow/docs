import React from 'react';
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react';
import clsx from 'clsx';

interface RadioGroupProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  getDescription?: (option: T) => string;
}

export default function RadioGroup<T>({
    options,
    value,
    onChange,
    label,
    getDescription,
  }: RadioGroupProps<T>) {

  return (
    <div className="space-y-4">
      {/* Group Label */}
      {label && (
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {label}
        </h2>
      )}

      <HeadlessRadioGroup value={value} onChange={onChange} className="space-y-3">
        {options.map((option) => (
          <HeadlessRadioGroup.Option
            key={String(option)}
            value={option}
            className={({ active, checked }) =>
              clsx(
                'flex items-start gap-3 p-3 rounded-lg border transition cursor-pointer',
                checked
                  ? 'bg-green-50 border-green-500 dark:bg-green-900 dark:border-green-400'
                  : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:hover:bg-gray-700',
                active && 'ring-2 ring-green-500'
              )
            }
          >
            {({ checked }) => (
              <div className="flex items-start gap-3">
                {/* Radio Button */}
                <div
                  className={clsx(
                    'w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full border',
                    checked
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-400 bg-gray-100 dark:border-gray-600 dark:bg-gray-700'
                  )}
                >
                  {checked && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>

                {/* Text Container */}
                <div className="flex flex-col">
                  {/* Option Label */}
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {option}
                  </span>

                  {/* Option Description */}
                  {getDescription && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getDescription(option)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </HeadlessRadioGroup.Option>
        ))}
      </HeadlessRadioGroup>
    </div>
  );
}
