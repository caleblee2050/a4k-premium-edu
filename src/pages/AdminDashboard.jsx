import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    Users,
    Ticket,
    BookOpen,
    FileText,
    Plus,
    Trash2,
    Check,
    X,
    RefreshCw,
    ChevronRight,
    Settings
} from 'lucide-react';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, token, isAdmin, loading } = useAuth();
    const [stats, setStats] = useState({
        members: 0,
        vouchers: { total: 0, used: 0, active: 0 },
        applications: { total: 0, pending: 0, confirmed: 0 },
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/admin/login');
        }
    }, [loading, isAdmin, navigate]);

    useEffect(() => {
        if (token) {
            fetchStats();
        }
    }, [token]);

    const fetchStats = async () => {
        try {
            const [vouchersRes, applicationsRes, membersRes] = await Promise.all([
                fetch(`${API_URL}/api/vouchers`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_URL}/api/applications`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_URL}/api/applications/members`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            const vouchers = await vouchersRes.json();
            const applications = await applicationsRes.json();
            const members = await membersRes.json();

            setStats({
                members: members.length || 0,
                vouchers: {
                    total: vouchers.length || 0,
                    used: vouchers.filter(v => v.status === 'used').length || 0,
                    active: vouchers.filter(v => v.status === 'active').length || 0,
                },
                applications: {
                    total: applications.length || 0,
                    pending: applications.filter(a => a.payment_status === 'pending').length || 0,
                    confirmed: applications.filter(a => a.payment_status === 'confirmed').length || 0,
                },
            });
        } catch (error) {
            console.error('Stats error:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-electric/30 border-t-electric rounded-full animate-spin" />
            </div>
        );
    }

    const menuItems = [
        { label: '회원 관리', icon: Users, href: '/admin/members', count: stats.members },
        { label: '바우처 관리', icon: Ticket, href: '/admin/vouchers', count: stats.vouchers.total },
        { label: '수강 신청', icon: FileText, href: '/admin/applications', count: stats.applications.total },
        { label: '커리큘럼 관리', icon: BookOpen, href: '/admin/courses', count: null },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* 헤더 */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-navy">관리자 대시보드</h1>
                        <p className="text-gray-500 mt-1">안녕하세요, {user?.name}님</p>
                    </div>

                    {/* 통계 카드 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Users size={24} className="text-blue-600" />
                                </div>
                                <span className="text-3xl font-bold text-navy">{stats.members}</span>
                            </div>
                            <p className="text-gray-600 font-medium">전체 회원</p>
                        </div>

                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                    <Ticket size={24} className="text-green-600" />
                                </div>
                                <span className="text-3xl font-bold text-navy">{stats.vouchers.active}</span>
                            </div>
                            <p className="text-gray-600 font-medium">활성 바우처</p>
                            <p className="text-sm text-gray-400 mt-1">{stats.vouchers.used}개 사용됨</p>
                        </div>

                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <FileText size={24} className="text-purple-600" />
                                </div>
                                <span className="text-3xl font-bold text-navy">{stats.applications.pending}</span>
                            </div>
                            <p className="text-gray-600 font-medium">대기 중 신청</p>
                            <p className="text-sm text-gray-400 mt-1">{stats.applications.confirmed}개 확정</p>
                        </div>
                    </div>

                    {/* 메뉴 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {menuItems.map((item, idx) => (
                            <Link
                                key={idx}
                                to={item.href}
                                className="glass rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center group-hover:bg-electric/20 transition-colors">
                                        <item.icon size={24} className="text-electric" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-navy">{item.label}</h3>
                                        {item.count !== null && (
                                            <p className="text-sm text-gray-500">{item.count}개</p>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-gray-400 group-hover:text-electric transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
