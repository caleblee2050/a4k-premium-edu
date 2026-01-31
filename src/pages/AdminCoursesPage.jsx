import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    ArrowLeft,
    Plus,
    Trash2,
    Edit,
    Upload,
    FileText,
    Image,
    Video,
    ChevronDown,
    ChevronUp,
    Save,
    X
} from 'lucide-react';

export default function AdminCoursesPage() {
    const navigate = useNavigate();
    const { token, isAdmin, loading } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [showAddItem, setShowAddItem] = useState(null);
    const [newItem, setNewItem] = useState({ phase: '', title: '', description: '', content_type: 'text' });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/admin/login');
        }
    }, [loading, isAdmin, navigate]);

    useEffect(() => {
        if (token) fetchCourses();
    }, [token]);

    const fetchCourses = async () => {
        try {
            const res = await fetch(`${API_URL}/api/courses`);
            const data = await res.json();

            // 각 과정의 커리큘럼도 가져오기
            const coursesWithCurriculum = await Promise.all(
                data.map(async (course) => {
                    const currRes = await fetch(`${API_URL}/api/courses/${course.slug}`);
                    const currData = await currRes.json();
                    return { ...course, curriculum: currData.curriculum || [] };
                })
            );

            setCourses(coursesWithCurriculum);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleFileUpload = async (e, courseId) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();

            // 커리큘럼 항목 추가
            await fetch(`${API_URL}/api/courses/${courseId}/curriculum`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    phase: newItem.phase || '자료',
                    title: file.name,
                    description: '',
                    content_type: file.type.startsWith('image/') ? 'image' : 'pdf',
                    content_url: data.url,
                }),
            });

            fetchCourses();
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const addCurriculumItem = async (courseId) => {
        try {
            await fetch(`${API_URL}/api/courses/${courseId}/curriculum`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newItem),
            });
            setNewItem({ phase: '', title: '', description: '', content_type: 'text' });
            setShowAddItem(null);
            fetchCourses();
        } catch (error) {
            console.error('Add error:', error);
        }
    };

    const deleteCurriculumItem = async (itemId) => {
        if (!confirm('이 항목을 삭제하시겠습니까?')) return;
        try {
            await fetch(`${API_URL}/api/courses/curriculum/${itemId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCourses();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const contentTypeIcons = {
        text: FileText,
        pdf: FileText,
        image: Image,
        video: Video,
    };

    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-electric/30 border-t-electric rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* 헤더 */}
                    <div className="mb-6">
                        <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-navy mb-2">
                            <ArrowLeft size={18} />
                            대시보드로 돌아가기
                        </Link>
                        <h1 className="text-2xl font-bold text-navy">커리큘럼 관리</h1>
                        <p className="text-gray-500">교육 과정별 커리큘럼 및 자료 관리</p>
                    </div>

                    {/* 과정 목록 */}
                    <div className="space-y-4">
                        {loadingData ? (
                            <div className="glass rounded-xl p-12 text-center text-gray-500">
                                로딩 중...
                            </div>
                        ) : (
                            courses.map(course => (
                                <div key={course.id} className="glass rounded-xl overflow-hidden">
                                    {/* 과정 헤더 */}
                                    <button
                                        onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                                        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-navy to-navy-800 text-white"
                                    >
                                        <div className="text-left">
                                            <h3 className="font-bold text-lg">{course.title}</h3>
                                            <p className="text-white/70 text-sm">{course.subtitle}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-white/70 text-sm">
                                                {course.curriculum?.length || 0}개 항목
                                            </span>
                                            {expandedCourse === course.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </button>

                                    {/* 커리큘럼 항목 */}
                                    {expandedCourse === course.id && (
                                        <div className="p-6">
                                            {/* 기존 항목 */}
                                            {course.curriculum?.length > 0 ? (
                                                <div className="space-y-3 mb-6">
                                                    {course.curriculum.map(item => {
                                                        const Icon = contentTypeIcons[item.content_type] || FileText;
                                                        return (
                                                            <div
                                                                key={item.id}
                                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center">
                                                                        <Icon size={20} className="text-electric" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-xs text-electric font-medium">{item.phase}</span>
                                                                        <h4 className="font-medium text-navy">{item.title}</h4>
                                                                        {item.description && (
                                                                            <p className="text-sm text-gray-500">{item.description}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {item.content_url && (
                                                                        <a
                                                                            href={`${API_URL}${item.content_url}`}
                                                                            target="_blank"
                                                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                                                                        >
                                                                            보기
                                                                        </a>
                                                                    )}
                                                                    <button
                                                                        onClick={() => deleteCurriculumItem(item.id)}
                                                                        className="p-2 text-gray-400 hover:text-red-500"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-8 mb-6">
                                                    아직 커리큘럼 항목이 없습니다
                                                </p>
                                            )}

                                            {/* 항목 추가 */}
                                            {showAddItem === course.id ? (
                                                <div className="border-2 border-dashed border-electric/30 rounded-xl p-4 space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <input
                                                            type="text"
                                                            value={newItem.phase}
                                                            onChange={(e) => setNewItem({ ...newItem, phase: e.target.value })}
                                                            placeholder="단계 (예: 1단계)"
                                                            className="px-4 py-2 rounded-lg border border-gray-200"
                                                        />
                                                        <select
                                                            value={newItem.content_type}
                                                            onChange={(e) => setNewItem({ ...newItem, content_type: e.target.value })}
                                                            className="px-4 py-2 rounded-lg border border-gray-200"
                                                        >
                                                            <option value="text">텍스트</option>
                                                            <option value="pdf">PDF</option>
                                                            <option value="image">이미지</option>
                                                            <option value="video">동영상</option>
                                                        </select>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={newItem.title}
                                                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                                        placeholder="제목"
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-200"
                                                    />
                                                    <textarea
                                                        value={newItem.description}
                                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                                        placeholder="설명 (선택)"
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-200"
                                                        rows={2}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setShowAddItem(null)}
                                                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600"
                                                        >
                                                            취소
                                                        </button>
                                                        <button
                                                            onClick={() => addCurriculumItem(course.id)}
                                                            disabled={!newItem.title}
                                                            className="px-4 py-2 rounded-lg bg-electric text-white disabled:opacity-50"
                                                        >
                                                            추가
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setShowAddItem(course.id)}
                                                        className="flex-1 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-electric hover:text-electric transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Plus size={18} />
                                                        항목 추가
                                                    </button>
                                                    <label className="flex-1 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-electric hover:text-electric transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                                        <Upload size={18} />
                                                        {uploading ? '업로드 중...' : '파일 업로드'}
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf,image/*"
                                                            onChange={(e) => handleFileUpload(e, course.id)}
                                                            disabled={uploading}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
