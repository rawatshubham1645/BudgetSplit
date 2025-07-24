import { X } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
