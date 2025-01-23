import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';

interface ChecklistItem {
  label: string;
  completed: boolean;
}

interface ChecklistProps {
  title: string;
  items: ChecklistItem[];
}

const Checklist: React.FC<ChecklistProps> = ({ title, items }) => {
  return (
    <div className="font-handwriting text-lg space-y-3">
      <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">{title}</h2>
      <ul className="space-y-2 p-0 m-0 list-none">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-3">
              <FontAwesomeIcon
                icon={item.completed ? faCheckSquare : faSquare}
                size="lg"
                className={item.completed ? "text-green-500" : "text-gray-500 dark:text-gray-200"}
              />
            </span>
            <span
              className={item.completed
                ? "text-gray-800 dark:text-gray-200 font-semibold"
                : "text-gray-700 dark:text-gray-400 dark:text-white"}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checklist;
