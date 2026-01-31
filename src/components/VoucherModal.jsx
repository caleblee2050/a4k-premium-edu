import { ShieldCheck, Lock, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

const VALID_CODES = ['A4K2026', 'PREMIUM2026', 'AIPARTNERS'];

export default function VoucherModal({ course, onClose, onSuccess }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = async () => {
        setIsVerifying(true);
        setError('');

        await new Promise(resolve => setTimeout(resolve, 800));

        if (VALID_CODES.includes(code.toUpperCase().trim())) {
            onSuccess(course);
        } else {
            setError('유효하지 않은 바우처 코드입니다. 코드를 다시 확인해주세요.');
        }
        setIsVerifying(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleVerify();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 배경 오버레이 */}
            <div
                className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* 모달 */}
            <div className="relative glass rounded-2xl p-6 md:p-8 max-w-md w-full animate-fadeInUp shadow-2xl">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* 아이콘 */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy to-electric mx-auto mb-6 flex items-center justify-center">
                    <ShieldCheck size={32} className="text-white" />
                </div>

                {/* 제목 */}
                <h2 className="text-2xl font-bold text-navy text-center mb-2">
                    바우처 코드 인증
                </h2>
                <p className="text-gray-600 text-center mb-2">
                    <span className="font-semibold text-electric">{course.title}</span> 신청
                </p>
                <p className="text-sm text-gray-500 text-center mb-6">
                    수강료: ₩{course.price.toLocaleString()}
                </p>

                {/* 입력 필드 */}
                <div className="space-y-3 mb-4">
                    <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="바우처 코드를 입력하세요"
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-electric transition-colors text-lg"
                            disabled={isVerifying}
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={handleVerify}
                        disabled={isVerifying || !code.trim()}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isVerifying ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                인증 중...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                인증 후 신청하기
                            </>
                        )}
                    </button>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <p className="text-red-500 text-sm text-center animate-fadeInUp">{error}</p>
                )}

                {/* 안내 문구 */}
                <p className="text-xs text-gray-400 text-center mt-4">
                    바우처 코드는 선별된 파트너십을 통해 발급됩니다.
                </p>
            </div>
        </div>
    );
}
