import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    ArrowLeft,
    FileText,
    Check,
    Clock,
    Search,
    RefreshCw,
    Calendar,
    CreditCard,
    Ticket,
    Trash2
} from 'lucide-react';

export default function AdminApplicationsPage() {
    const navigate = useNavigate();
    const { token, isAdmin, loading } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/admin/login');
        }
    }, [loading, isAdmin, navigate]);

    useEffect(() => {
        if (token) fetchApplications();
    }, [token]);

    const fetchApplications = async () => {
        try {
            const res = await fetch(`${API_URL}/api/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setApplications(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await fetch(`${API_URL}/api/applications/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ payment_status: status }),
            });
            fetchApplications();
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const deleteApplication = async (id, name) => {
        if (!window.confirm(`정말 "${name}"님의 신청을 삭제하시겠습니까?\n\n⚠️ 바우처로 신청한 경우, 해당 바우처는 다시 활성화됩니다.`)) {
            return;
        }
        try {
            const res = await fetch(`${API_URL}/api/applications/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                fetchApplications();
            } else {
                const data = await res.json();
                alert(data.error || '삭제 중 오류가 발생했습니다');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('삭제 중 오류가 발생했습니다');
        }
    };

    const filteredApps = applications.filter(a => {
        if (filter === 'all') return true;
        return a.payment_status === filter;
    });

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    const statusLabels = {
        pending: '대기중',
        confirmed: '확정',
        cancelled: '취소',
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
                        <h1 className="text-2xl font-bold text-navy">수강 신청 관리</h1>
                    </div>

                    {/* 필터 */}
                    <div className="glass rounded-xl p-4 mb-6 flex gap-2">
                        {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                    ? 'bg-electric text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f === 'all' ? '전체' : statusLabels[f]}
                            </button>
                        ))}
                    </div>

                    {/* 테이블 */}
                    <div className="glass rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">신청자</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">과정</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">결제방법</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">상태</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">신청일</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingData ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                                            로딩 중...
                                        </td>
                                    </tr>
                                ) : filteredApps.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            신청 내역이 없습니다
                                        </td>
                                    </tr>
                                ) : (
                                    filteredApps.map(app => (
                                        <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-navy">{app.name}</p>
                                                    <p className="text-sm text-gray-500">{app.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {app.course_title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {app.payment_method === 'voucher' ? (
                                                        <>
                                                            <Ticket size={16} className="text-green-500" />
                                                            <span className="text-sm">{app.voucher_code}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CreditCard size={16} className="text-blue-500" />
                                                            <span className="text-sm">계좌이체</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.payment_status]}`}>
                                                    {statusLabels[app.payment_status]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(app.created_at).toLocaleDateString('ko-KR')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {app.payment_status === 'pending' && (
                                                        <button
                                                            onClick={() => updateStatus(app.id, 'confirmed')}
                                                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                                                        >
                                                            확정
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteApplication(app.id, app.name)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="삭제"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
