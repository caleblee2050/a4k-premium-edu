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
    Laptop,
    FileText,
    BarChart3,
    MessageSquare,
    Presentation,
    Video
} from 'lucide-react';

const curriculum = [
    {
        phase: 'Unit 1-4',
        title: '온라인 학습 공간 구축',
        description: '종이 없는 교실 환경을 구축하고 디지털 학습 공간을 설계합니다',
        items: [
            'Google Classroom 수업 개설 및 관리',
            'Google Drive 파일 구성 및 공유 설정',
            'Google Docs를 활용한 협업 문서 작성',
            '학생 과제 관리 및 피드백 시스템 구축',
        ],
        icon: Laptop,
    },
    {
        phase: 'Unit 5-6',
        title: '업무 효율화 및 평가',
        description: '데이터 기반의 학생 성취도 관리 시스템을 구축합니다',
        items: [
            'Google Forms를 활용한 퀴즈 및 설문 제작',
            '자동 채점 및 피드백 설정',
            'Google Sheets로 성적 데이터 관리',
            '차트와 그래프를 활용한 성취도 시각화',
        ],
        icon: BarChart3,
    },
    {
        phase: 'Unit 7-9',
        title: '협업 및 커뮤니케이션',
        description: '효과적인 소통과 디지털 시민의식을 함양합니다',
        items: [
            'Gmail을 활용한 효율적인 커뮤니케이션',
            'Google Groups로 학습 커뮤니티 운영',
            'Google Meet 원격 수업 운영 기법',
            '디지털 시민의식 및 온라인 에티켓 교육',
        ],
        icon: MessageSquare,
    },
    {
        phase: 'Unit 10-13',
        title: '시각적 자료 제작',
        description: '멀티미디어를 활용한 효과적인 교육 콘텐츠를 제작합니다',
        items: [
            'Google Slides로 인터랙티브 프레젠테이션 제작',
            'YouTube 교육 영상 검색 및 큐레이션',
            'Google Search 고급 검색 기법',
            '학생들의 문제 해결력 및 비판적 사고 지원',
        ],
        icon: Presentation,
    },
];

const highlights = [
    { icon: Clock, label: '1일 집중', desc: '부트캠프 형식' },
    { icon: Calendar, label: '8시간', desc: '실습 포함' },
    { icon: Users, label: '소규모', desc: '최대 15명' },
    { icon: Star, label: 'Google 인증', desc: '자격증 취득' },
];

export default function GCEL1Page() {
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSuccess = (data) => {
        setShowModal(false);
        const message = data.paymentMethod === 'voucher'
            ? 'GCE L1 부트캠프 무료 수강 신청이 완료되었습니다!'
            : 'GCE L1 부트캠프 신청이 완료되었습니다. 입금 확인 후 안내해드립니다.';
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
                <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 md:py-24 overflow-hidden">
                    {/* 배경 효과 - Google 색상 */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-10 right-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-10 left-20 w-80 h-80 bg-green-400/15 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-red-400/10 rounded-full blur-3xl" />
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
                                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                                    Google for Education 공식 인증
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">GCE L1 부트캠프</h1>
                                <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
                                    Google Certified Educator Level 1
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 철학 인용 */}
                <section className="py-12 md:py-16 bg-gradient-to-r from-blue-50 to-green-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Sparkles className="mx-auto text-blue-600 mb-4" size={32} />
                        <blockquote className="text-xl md:text-2xl text-navy font-medium leading-relaxed mb-6">
                            "구글 도구를 활용하여 교실의 경계를 넘어<br className="hidden md:inline" />
                            학생들에게 더 넓은 세상을 열어주세요."
                        </blockquote>
                    </div>
                </section>

                {/* 과정 하이라이트 */}
                <section className="py-12 border-b border-gray-100">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {highlights.map((item, idx) => (
                                <div key={idx} className="glass rounded-xl p-4 text-center">
                                    <item.icon className="mx-auto text-blue-600 mb-2" size={24} />
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
                            <p className="text-gray-600">Google for Education 공식 13개 유닛 기반 학습</p>
                        </div>

                        <div className="space-y-8">
                            {curriculum.map((phase, idx) => (
                                <div key={idx} className="glass rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center gap-4">
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
                <section className="py-16 bg-gradient-to-r from-blue-600 to-green-500">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Google 공인 교육자가 되세요
                        </h2>
                        <p className="text-white/80 text-lg mb-8">
                            1일 집중 부트캠프로 GCE Level 1 자격증을 취득하세요.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
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
                    course={{ title: 'GCE L1 부트캠프', price: 150000 }}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}
