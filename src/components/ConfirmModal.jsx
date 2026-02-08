import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = '확인', cancelText = '취소', danger = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />
            <div className="relative glass rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeInUp">
                {/* 헤더 */}
                <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-full ${danger ? 'bg-red-100' : 'bg-yellow-100'}`}>
                        <AlertTriangle className={danger ? 'text-red-500' : 'text-yellow-500'} size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-navy">{title}</h3>
                        <p className="text-gray-600 mt-1 whitespace-pre-line">{message}</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 버튼 */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${danger
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-electric text-white hover:bg-electric/90'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
