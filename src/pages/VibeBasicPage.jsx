import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ApplicationModal from '../components/ApplicationModal';
import {
    ArrowLeft,
    Code2,
    Sparkles,
    Brain,
    Users,
    Rocket,
    CheckCircle,
    Clock,
    Calendar,
    Star
} from 'lucide-react';

const curriculum = [
    {
        phase: '1단계',
        title: '설계자의 사고법',
        description: 'AI 시대에 필요한 창의적 문제 해결 능력',
        items: [
            '창의력과 사고력의 한계를 넘어서는 방법',
            '문제를 정의하고 분해하는 설계자의 시각',
            '아이디어를 구조화하는 프레임워크',
            'AI에게 명확하게 의도를 전달하는 기술',
        ],
        icon: Brain,
    },
    {
        phase: '2단계',
        title: 'AI 파트너와의 협업',
        description: 'AI를 도구가 아닌 사고의 확장으로 활용하기',
        items: [
            'AI 도구 생태계 이해 (ChatGPT, Claude, Gemini)',
            '효과적인 프롬프트 엔지니어링 실습',
            'AI와 대화하며 아이디어 발전시키기',
            '한계를 극복하는 반복적 협업 전략',
        ],
        icon: Users,
    },
    {
        phase: '3단계',
        title: '바이브코딩 실무 실습',
        description: '아이디어를 현실로 만드는 실전 프로젝트',
        items: [
            '노코드/로우코드 도구 활용법',
            'AI와 함께 웹 서비스 프로토타입 만들기',
            '나만의 업무 자동화 도구 설계',
            '최종 프로젝트: 나만의 AI 파트너 서비스 구축',
        ],
        icon: Rocket,
    },
];

const highlights = [
    { icon: Clock, label: '총 16시간', desc: '4주 과정' },
    { icon: Calendar, label: '주 1회', desc: '토요일 오전' },
    { icon: Users, label: '소규모', desc: '최대 12명' },
    { icon: Star, label: '수료증', desc: '과정 완료 시' },
];

export default function VibeBasicPage() {
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSuccess = (data) => {
        setShowModal(false);
        const message = data.paymentMethod === 'voucher'
            ? '바이브코딩 기초 무료 수강 신청이 완료되었습니다!'
            : '바이브코딩 기초 신청이 완료되었습니다. 입금 확인 후 안내해드립니다.';
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 5000);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* 성공 메시지 */}
            {successMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeInUp">
                    <CheckCircle size={20} />
                    {successMessage}
                </div>
            )}

            <main className="flex-1">
                {/* 히어로 섹션 */}
                <section className="relative bg-gradient-to-br from-navy via-navy-800 to-navy-900 text-white py-16 md:py-24 overflow-hidden">
                    {/* 배경 효과 */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-10 right-20 w-64 h-64 bg-electric/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-10 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* 뒤로가기 */}
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            전체 과정으로 돌아가기
                        </Link>

                        <div className="flex items-start gap-6">
                            <div className="hidden md:flex w-20 h-20 rounded-2xl bg-white/10 backdrop-blur items-center justify-center flex-shrink-0">
                                <Code2 size={40} className="text-electric" />
                            </div>
                            <div>
                                <span className="inline-block bg-electric/20 text-electric px-3 py-1 rounded-full text-sm font-medium mb-4">
                                    비개발자를 위한 AI 협업 과정
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">바이브코딩 기초</h1>
                                <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
                                    Vibe Coding for Non-Developers
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 철학 인용 */}
                <section className="py-12 md:py-16 bg-gradient-to-r from-electric/5 to-purple-500/5">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Sparkles className="mx-auto text-electric mb-4" size={32} />
                        <blockquote className="text-xl md:text-2xl text-navy font-medium leading-relaxed mb-6">
                            "창의력과 사고력이 벽에 닿을 때,<br className="hidden md:inline" />
                            AI가 제공하는 도전적인 아이디어가 새로운 가능성을 열어줍니다."
                        </blockquote>

                    </div>
                </section>

                {/* 과정 하이라이트 */}
                <section className="py-12 border-b border-gray-100">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {highlights.map((item, idx) => (
                                <div key={idx} className="glass rounded-xl p-4 text-center">
                                    <item.icon className="mx-auto text-electric mb-2" size={24} />
                                    <p className="font-bold text-navy">{item.label}</p>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 커리큘럼 */}
                <section className="py-16 md:py-20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">상세 커리큘럼</h2>
                            <p className="text-gray-600">실전 경험이 녹아있는 3단계 학습 과정</p>
                        </div>

                        <div className="space-y-8">
                            {curriculum.map((phase, idx) => (
                                <div key={idx} className="glass rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="bg-gradient-to-r from-navy to-navy-800 p-6 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                            <phase.icon size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <span className="text-electric text-sm font-medium">{phase.phase}</span>
                                            <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-600 mb-4">{phase.description}</p>
                                        <ul className="space-y-3">
                                            {phase.items.map((item, itemIdx) => (
                                                <li key={itemIdx} className="flex items-start gap-3">
                                                    <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-gradient-to-r from-navy to-electric">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            AI와 함께 창의력을 확장하세요
                        </h2>
                        <p className="text-white/80 text-lg mb-8">
                            아래 버튼을 클릭하여 수강 신청하세요.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-white text-navy font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                수강 신청하기
                            </button>
                            <div className="text-white/80">
                                <span className="text-2xl font-bold text-white">₩300,000</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* 신청 모달 */}
            {showModal && (
                <ApplicationModal
                    course={{ title: '바이브코딩 기초', price: 300000 }}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}
