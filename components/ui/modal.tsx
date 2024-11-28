import React from "react";
import ReactDOM from "react-dom";
import { Button } from "./button";
import { XIcon } from "lucide-react";

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
                <Button
                    className="relative bottom-2 right-1 bg-red-600 text-gray-200 hover:text-gray-400 hover:bg-red-800"
                    onClick={onClose}
                >
                    <XIcon size={24} color="white" />
                </Button>
                {children}
            </div>
        </div>,
        document.body
    );
};
