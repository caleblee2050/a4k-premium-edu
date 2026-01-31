import { Award, BookOpen, Code2, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const icons = {
    award: Award,
    book: BookOpen,
    code: Code2,
};

export default function CourseCard({
    title,
    subtitle,
    description,
    curriculum = [],
    price,
    icon = 'book',
    featured = false,
    delay = 0,
    detailUrl = null,
    onApply
}) {
    const IconComponent = icons[icon] || BookOpen;
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`course-card glass rounded-2xl overflow-hidden animate-fadeInUp ${featured ? 'ring-2 ring-electric' : ''}`}
            style={{ animationDelay: `${delay}s` }}
        >
            {/* 헤더 */}
            <div className={`p-6 ${featured ? 'bg-gradient-to-r from-navy to-navy-800' : 'bg-gradient-to-r from-gray-800 to-gray-900'}`}>
                <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                        <IconComponent size={28} className="text-white" />
                    </div>
                    {featured && (
                        <span className="bg-electric text-white text-xs font-semibold px-3 py-1 rounded-full">
                            인기
                        </span>
                    )}
                </div>
                <h3 className="text-xl font-bold text-white mt-4">{title}</h3>
                <p className="text-white/70 text-sm mt-1">{subtitle}</p>
            </div>

            {/* 바디 */}
            <div className="p-6">
                <p className="text-gray-600 leading-relaxed mb-4">
                    {description}
                </p>

                {/* 커리큘럼 토글 */}
                {curriculum.length > 0 && (
                    <div className="mb-4">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-electric font-medium text-sm flex items-center gap-1 hover:underline"
                        >
                            {isExpanded ? '커리큘럼 접기 ▲' : '커리큘럼 보기 ▼'}
                        </button>
                        {isExpanded && (
                            <ul className="mt-3 space-y-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                                {curriculum.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* 가격 */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <span className="text-sm text-gray-500">수강료</span>
                        <p className="text-3xl font-bold text-navy">
                            ₩{price.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div className="space-y-3">
                    {/* 교육과정 보기 버튼 (Primary) */}
                    {detailUrl ? (
                        <Link
                            to={detailUrl}
                            className="w-full btn-primary flex items-center justify-center gap-2 group"
                        >
                            <BookOpen size={18} />
                            <span>교육과정 보기</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                            <BookOpen size={18} />
                            <span>{isExpanded ? '커리큘럼 접기' : '커리큘럼 보기'}</span>
                        </button>
                    )}

                    {/* 신청하기 버튼 (Secondary) */}
                    <button
                        onClick={() => onApply({ title, price })}
                        className="w-full py-3 px-6 rounded-xl border-2 border-electric text-electric font-semibold flex items-center justify-center gap-2 hover:bg-electric/5 transition-colors"
                    >
                        <span>신청하기</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
