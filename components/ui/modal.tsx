import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose} // Close modal when clicking outside the content
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the content
            >
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    Close
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};
