import React, {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {AlertTriangle, Trash2, X} from 'lucide-react';

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    description?: string;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
                                                                                      isOpen,
                                                                                      onClose,
                                                                                      onConfirm,
                                                                                      itemName,
                                                                                      description = "This action cannot be undone."
                                                                                  }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm h-screen w-screen"
            style={{backdropFilter: 'blur(4px)',marginTop:0}}>
            <AnimatePresence>
                <motion.div
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.9}}
                    transition={{duration: 0.2}}
                    className="bg-white rounded-xl shadow-2xl max-w-md w-full"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <AlertTriangle className="text-red-500" size={24} />
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Confirm Deletion
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <p className="text-gray-600">
                                Are you sure you want to delete <span className="font-medium">{itemName}</span>?
                            </p>
                            {description && (
                                <p className="text-sm text-gray-500">
                                    {description}
                                </p>
                            )}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isDeleting}
                                className={`
                            flex-1 py-2 px-4 rounded-md text-white transition-colors 
                            flex items-center justify-center space-x-2
                            ${isDeleting
                                    ? 'bg-red-400 cursor-not-allowed'
                                    : 'bg-red-500 hover:bg-red-600'
                                }
                        `}
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="animate-pulse">Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        <span>Delete</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
