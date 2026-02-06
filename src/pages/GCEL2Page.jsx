import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ApplicationModal from '../components/ApplicationModal';
import {
    ArrowLeft,
    Award,
    Sparkles,
    CheckCircle,
    Clock,
    Calendar,
    Users,
    Star,
    TrendingUp,
    Lightbulb,
    Globe,
    Palette
} from 'lucide-react';

const curriculum = [
    {
        phase: '테마 1',
        title: '개별화 학습 및 데이터 활용',
        description: '정밀한 데이터 분석으로 맞춤형 피드백을 제공합니다',
        items: [
            'Google Sheets 고급 함수 및 피벗 테이블 활용',
            '학생 성취도 데이터 심층 분석',
            '개인별 학습 경로 설계 및 피드백 자동화',
            'Google Forms 고급 설문 및 분기 기능',
        ],
        icon: TrendingUp,
    },
    {
        phase: '테마 2',
        title: '창의적 학습 결과물',
        description: '프로젝트 기반 학습(PBL)을 위한 멀티미디어 도구를 활용합니다',
        items: [
            'YouTube 채널 개설 및 교육 콘텐츠 제작',
            'Google Sites로 학생 포트폴리오 구축',
            '멀티미디어 프로젝트 협업 도구 활용',
            '학생 창작물 전시 및 공유 전략',
        ],
        icon: Palette,
    },
    {
        phase: '테마 3',
        title: '학교 밖 협업',
        description: '전문가 및 지역사회와 연결하는 글로벌 학습 커뮤니티를 구축합니다',
        items: [
            'Google Meet을 활용한 전문가 초청 수업',
            '글로벌 교실 프로젝트 연결',
            'Google Groups 커뮤니티 확장 전략',
            '학부모 및 지역사회 참여 플랫폼 구축',
        ],
        icon: Globe,
    },
    {
        phase: '테마 4',
        title: '수업 디자인 혁신',
        description: '구글 도구들을 복합적으로 결합하여 혁신적인 수업을 설계합니다',
        items: [
            '블렌디드 러닝 커리큘럼 설계',
            '학생 주도형 탐구 학습 환경 구축',
            '비판적 사고력 향상을 위한 토론 수업',
            'AI 도구와 구글 워크스페이스 통합 활용',
        ],
        icon: Lightbulb,
    },
];

const highlights = [
    { icon: Clock, label: '1일 집중', desc: '심화 부트캠프' },
    { icon: Calendar, label: '8시간', desc: '실습 포함' },
    { icon: Users, label: 'L1 이수자', desc: '선수 조건' },
    { icon: Star, label: 'Google 인증', desc: 'Level 2 자격증' },
];

export default function GCEL2Page() {
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSuccess = (data) => {
        setShowModal(false);
        const message = data.paymentMethod === 'voucher'
            ? 'GCE L2 부트캠프 무료 수강 신청이 완료되었습니다!'
            : 'GCE L2 부트캠프 신청이 완료되었습니다. 입금 확인 후 안내해드립니다.';
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
                <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-16 md:py-24 overflow-hidden">
                    {/* 배경 효과 */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-10 right-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-10 left-20 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl" />
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
                                <Award size={40} className="text-yellow-300" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        Google for Education 공식 인증
                                    </span>
                                    <span className="inline-block bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                                        ADVANCED
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">GCE L2 부트캠프</h1>
                                <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
                                    Google Certified Educator Level 2
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 철학 인용 */}
                <section className="py-12 md:py-16 bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Sparkles className="mx-auto text-purple-600 mb-4" size={32} />
                        <blockquote className="text-xl md:text-2xl text-navy font-medium leading-relaxed mb-6">
                            "기술을 넘어 혁신적인 수업 설계로<br className="hidden md:inline" />
                            학생들의 미래 역량을 키워주세요."
                        </blockquote>
                    </div>
                </section>

                {/* 과정 하이라이트 */}
                <section className="py-12 border-b border-gray-100">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {highlights.map((item, idx) => (
                                <div key={idx} className="glass rounded-xl p-4 text-center">
                                    <item.icon className="mx-auto text-purple-600 mb-2" size={24} />
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
                            <p className="text-gray-600">심화 교육자를 위한 4대 핵심 테마</p>
                        </div>

                        <div className="space-y-8">
                            {curriculum.map((phase, idx) => (
                                <div key={idx} className="glass rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                            <phase.icon size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <span className="text-yellow-300 text-sm font-medium">{phase.phase}</span>
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
                <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            최고 수준의 디지털 교육자로 성장하세요
                        </h2>
                        <p className="text-white/80 text-lg mb-8">
                            Level 1 이수 후, 심화 과정으로 더 깊은 전문성을 쌓으세요.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                수강 신청하기
                            </button>
                            <div className="text-white/80">
                                <span className="text-2xl font-bold text-white">₩150,000</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* 신청 모달 */}
            {showModal && (
                <ApplicationModal
                    course={{ title: 'GCE L2 부트캠프', price: 150000 }}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}
