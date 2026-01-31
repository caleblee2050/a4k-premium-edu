import { useState } from 'react';
import { X, User, Phone, Mail, Briefcase, Calendar, ShieldCheck, CreditCard, Check, Sparkles } from 'lucide-react';

const VALID_CODES = ['A4K2026', 'PREMIUM2026', 'AIPARTNERS'];

export default function ApplicationModal({ course, onClose, onSuccess }) {
    const [step, setStep] = useState(1); // 1: 정보입력, 2: 결제방법
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        email: '',
        job: '',
    });
    const [paymentMethod, setPaymentMethod] = useState(null); // 'voucher' | 'transfer'
    const [voucherCode, setVoucherCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isFormValid = formData.name && formData.phone && formData.email;

    const handleNextStep = () => {
        if (isFormValid) {
            setStep(2);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');

        await new Promise(resolve => setTimeout(resolve, 800));

        if (paymentMethod === 'voucher') {
            if (VALID_CODES.includes(voucherCode.toUpperCase().trim())) {
                onSuccess({ ...formData, course: course.title, paymentMethod: 'voucher' });
            } else {
                setError('유효하지 않은 바우처 코드입니다.');
                setIsSubmitting(false);
            }
        } else {
            onSuccess({ ...formData, course: course.title, paymentMethod: 'transfer' });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative glass rounded-2xl p-6 md:p-8 max-w-lg w-full animate-fadeInUp shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* 헤더 */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-navy">{course.title}</h2>
                    <p className="text-gray-500 mt-1">수강 신청</p>
                    <p className="text-electric font-semibold mt-2">₩{course.price.toLocaleString()}</p>
                </div>

                {/* 단계 표시 */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-electric' : 'text-gray-300'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-electric text-white' : 'bg-gray-200'}`}>
                            {step > 1 ? <Check size={16} /> : '1'}
                        </div>
                        <span className="text-sm font-medium hidden sm:inline">정보 입력</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-200">
                        <div className={`h-full transition-all ${step >= 2 ? 'bg-electric w-full' : 'w-0'}`} />
                    </div>
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-electric' : 'text-gray-300'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-electric text-white' : 'bg-gray-200'}`}>
                            2
                        </div>
                        <span className="text-sm font-medium hidden sm:inline">결제 방법</span>
                    </div>
                </div>

                {/* Step 1: 정보 입력 */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                이름 <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="홍길동"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-electric transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">나이</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="30"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-electric transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">직업</label>
                                <div className="relative">
                                    <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="job"
                                        value={formData.job}
                                        onChange={handleChange}
                                        placeholder="교사"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-electric transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                연락처 <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="010-1234-5678"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-electric transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                이메일 <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-electric transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleNextStep}
                            disabled={!isFormValid}
                            className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            다음 단계
                        </button>
                    </div>
                )}

                {/* Step 2: 결제 방법 */}
                {step === 2 && (
                    <div className="space-y-4">
                        <p className="text-center text-gray-600 mb-4">결제 방법을 선택해주세요</p>

                        {/* 결제 방법 선택 */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setPaymentMethod('voucher')}
                                className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'voucher'
                                        ? 'border-electric bg-electric/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <ShieldCheck size={28} className={`mx-auto mb-2 ${paymentMethod === 'voucher' ? 'text-electric' : 'text-gray-400'}`} />
                                <p className="font-semibold text-navy">바우처 코드</p>
                                <p className="text-xs text-gray-500 mt-1">무료 수강</p>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('transfer')}
                                className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'transfer'
                                        ? 'border-electric bg-electric/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <CreditCard size={28} className={`mx-auto mb-2 ${paymentMethod === 'transfer' ? 'text-electric' : 'text-gray-400'}`} />
                                <p className="font-semibold text-navy">계좌이체</p>
                                <p className="text-xs text-gray-500 mt-1">₩{course.price.toLocaleString()}</p>
                            </button>
                        </div>

                        {/* 바우처 코드 입력 */}
                        {paymentMethod === 'voucher' && (
                            <div className="mt-4 p-4 bg-electric/5 rounded-xl">
                                <label className="block text-sm font-medium text-gray-600 mb-2">바우처 코드</label>
                                <input
                                    type="text"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    placeholder="코드를 입력하세요"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-electric transition-colors text-center font-mono text-lg"
                                />
                                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                            </div>
                        )}

                        {/* 계좌 정보 */}
                        {paymentMethod === 'transfer' && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm font-medium text-gray-600 mb-3">입금 계좌 안내</p>
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <p className="text-navy font-bold text-lg">신한은행 110-123-456789</p>
                                    <p className="text-gray-600 text-sm mt-1">예금주: 에이포케이</p>
                                    <p className="text-electric font-semibold mt-2">₩{course.price.toLocaleString()}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    * 입금자명을 신청자명과 동일하게 해주세요<br />
                                    * 입금 확인 후 수강 안내가 발송됩니다
                                </p>
                            </div>
                        )}

                        {/* 버튼 */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                이전
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!paymentMethod || (paymentMethod === 'voucher' && !voucherCode) || isSubmitting}
                                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        처리 중...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        신청 완료
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
