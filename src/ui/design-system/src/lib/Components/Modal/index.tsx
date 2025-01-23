import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Button } from '../Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  scrollable = true, // default is scrollable
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={clsx(
                'relative w-full max-w-md transform rounded-md border bg-gray-100 text-black shadow-2xl transition-all dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
                scrollable && 'max-h-[80vh] overflow-y-auto',
                className,
              )}
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'absolute',
              }}
            >
              {/* Header */}
              {title && (
                <div className="px-4 pt-3 pb-6 border-b border-gray-300 dark:border-gray-700 flex justify-center relative">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-center mt-1 mb-0"
                  >
                    {title}
                  </Dialog.Title>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={onClose}
                  >
                    &#10005;
                  </Button>
                </div>
              )}

              {/* Content */}
              <div className="px-4 py-5 pt-0">{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
