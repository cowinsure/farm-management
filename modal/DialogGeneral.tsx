// components/Modal.tsx
import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalGeneral: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0000004d] ">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-screen h-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 text-4xl right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalGeneral;
