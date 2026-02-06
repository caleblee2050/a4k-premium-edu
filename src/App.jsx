import { useState } from 'react';
import Header from './components/Header';
import CourseCard from './components/CourseCard';
import ApplicationModal from './components/ApplicationModal';
import Footer from './components/Footer';
import { GraduationCap, CheckCircle } from 'lucide-react';

const courses = [
    {
        id: 1,
        title: 'GCE L1 부트캠프',
        subtitle: 'Google Certified Educator Level 1',
        description: '구글 공인교육자 자격증 취득 과정. 1일 집중 부트캠프로 구글 에듀케이터 인증을 획득하세요.',
        curriculum: [
            'Google Classroom 활용법',
            'Google Drive & Docs 협업',
            'Google Forms 평가 도구',
            'Google Meet 원격 수업',
            '자격증 시험 준비 및 응시',
        ],
        price: 150000,
        icon: 'award',
        featured: false,
        detailUrl: '/course/gce-l1',
    },
    {
        id: 2,
        title: 'GCE L2 부트캠프',
        subtitle: 'Google Certified Educator Level 2',
        description: '심화 디지털 교육 전문가 과정. Level 1 이후 더 깊은 전문성을 원하는 교육자를 위한 과정입니다.',
        curriculum: [
            'Google Apps Script 기초',
            'Google Sites 포트폴리오',
            'YouTube 교육 콘텐츠 제작',
            '고급 Classroom 관리',
            '디지털 시민의식 교육',
            'Level 2 자격증 시험 대비',
        ],
        price: 150000,
        icon: 'award',
        featured: true,
        detailUrl: '/course/gce-l2',
    },
    {
        id: 3,
        title: '바이브코딩 기초',
        subtitle: 'Vibe Coding for Non-Developers',
        description: '비개발자를 위한 창의적 설계와 AI 협업. 코딩 없이 AI와 함께 아이디어를 현실로 만드세요.',
        curriculum: [
            'AI 도구 이해와 활용 전략',
            '프롬프트 엔지니어링 기초',
            '노코드 앱 설계 워크숍',
            'AI와 협업하는 프로젝트 실습',
            '나만의 AI 파트너 만들기',
        ],
        price: 300000,
        icon: 'code',
        featured: false,
        detailUrl: '/course/vibe-basic',
    },
];

export default function App() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleApply = (course) => {
        setSelectedCourse(course);
    };

    const handleSuccess = (data) => {
        setSelectedCourse(null);
        const message = data.paymentMethod === 'voucher'
            ? `${data.course} 무료 수강 신청이 완료되었습니다!`
            : `${data.course} 신청이 완료되었습니다. 입금 확인 후 안내해드립니다.`;
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
                <section className="relative py-16 md:py-24 overflow-hidden">
                    {/* 배경 데코레이션 */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-electric/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-navy/10 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* 메인 타이틀 */}
                        <div className="text-center mb-12 animate-fadeInUp">
                            <div className="inline-flex items-center gap-2 bg-navy/10 text-navy px-4 py-2 rounded-full mb-6">
                                <GraduationCap size={18} />
                                <span className="text-sm font-medium">프리미엄 교육 과정</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-6 leading-tight">
                                AI를 사고의 확장으로<br />이해하는 교육
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                A4K 프리미엄 교육 과정으로 당신의 가능성을 확장하세요.
                            </p>
                        </div>

                        {/* 교육 과정 섹션 */}
                        <section id="courses">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">교육 과정 안내</h2>
                                <p className="text-gray-600">커리큘럼을 살펴보고 원하는 과정을 선택하세요</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {courses.map((course, index) => (
                                    <CourseCard
                                        key={course.id}
                                        {...course}
                                        delay={index * 0.1}
                                        onApply={handleApply}
                                    />
                                ))}
                            </div>

                            {/* 가치 문구 */}
                            <div className="mt-12 text-center">
                                <div className="inline-block glass rounded-xl px-6 py-4">
                                    <p className="text-gray-700 font-medium">
                                        💎 본 과정은 선별된 파트너십 및 바우처를 통해서만 참여 가능한 <span className="text-electric font-semibold">프리미엄 교육</span>입니다.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
            </main>

            <Footer />

            {/* 신청 모달 */}
            {selectedCourse && (
                <ApplicationModal
                    course={selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}
