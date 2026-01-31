import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    ArrowLeft,
    Users,
    Mail,
    Phone,
    Search,
    RefreshCw,
    Calendar
} from 'lucide-react';

export default function AdminMembersPage() {
    const navigate = useNavigate();
    const { token, isAdmin, loading } = useAuth();
    const [members, setMembers] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/admin/login');
        }
    }, [loading, isAdmin, navigate]);

    useEffect(() => {
        if (token) fetchMembers();
    }, [token]);

    const fetchMembers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/applications/members`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setMembers(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const filteredMembers = members.filter(m => {
        if (!search) return true;
        return (
            m.name?.toLowerCase().includes(search.toLowerCase()) ||
            m.email?.toLowerCase().includes(search.toLowerCase()) ||
            m.phone?.includes(search)
        );
    });

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
                        <h1 className="text-2xl font-bold text-navy">회원 관리</h1>
                        <p className="text-gray-500">총 {members.length}명의 회원</p>
                    </div>

                    {/* 검색 */}
                    <div className="glass rounded-xl p-4 mb-6">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="이름, 이메일, 연락처로 검색..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-electric"
                            />
                        </div>
                    </div>

                    {/* 회원 목록 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loadingData ? (
                            <div className="col-span-full py-12 text-center text-gray-500">
                                <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                                로딩 중...
                            </div>
                        ) : filteredMembers.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-gray-500">
                                회원이 없습니다
                            </div>
                        ) : (
                            filteredMembers.map(member => (
                                <div key={member.id} className="glass rounded-xl p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-electric/10 flex items-center justify-center flex-shrink-0">
                                            <Users size={24} className="text-electric" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-navy truncate">{member.name}</h3>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Mail size={14} />
                                                    <span className="truncate">{member.email}</span>
                                                </div>
                                                {member.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Phone size={14} />
                                                        <span>{member.phone}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Calendar size={14} />
                                                    <span>{new Date(member.created_at).toLocaleDateString('ko-KR')}</span>
                                                </div>
                                            </div>
                                            {member.job && (
                                                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                    {member.job}
                                                </span>
                                            )}
                                        </div>
                                    </div>
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
