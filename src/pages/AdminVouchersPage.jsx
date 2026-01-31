import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    ArrowLeft,
    Plus,
    Trash2,
    Check,
    X,
    RefreshCw,
    Copy,
    Search,
    Filter
} from 'lucide-react';

export default function AdminVouchersPage() {
    const navigate = useNavigate();
    const { token, isAdmin, loading } = useAuth();
    const [vouchers, setVouchers] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCode, setNewCode] = useState('');
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/admin/login');
        }
    }, [loading, isAdmin, navigate]);

    useEffect(() => {
        if (token) fetchVouchers();
    }, [token]);

    const fetchVouchers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/vouchers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setVouchers(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const createVoucher = async () => {
        if (!newCode.trim()) return;
        try {
            const res = await fetch(`${API_URL}/api/vouchers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ code: newCode.trim() }),
            });
            if (res.ok) {
                setNewCode('');
                setShowModal(false);
                fetchVouchers();
            }
        } catch (error) {
            console.error('Create error:', error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await fetch(`${API_URL}/api/vouchers/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            fetchVouchers();
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const deleteVoucher = async (id) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
            await fetch(`${API_URL}/api/vouchers/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchVouchers();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'A4K-';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewCode(code);
    };

    const filteredVouchers = vouchers.filter(v => {
        if (filter !== 'all' && v.status !== filter) return false;
        if (search && !v.code.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const statusColors = {
        active: 'bg-green-100 text-green-700',
        used: 'bg-blue-100 text-blue-700',
        expired: 'bg-gray-100 text-gray-700',
        deleted: 'bg-red-100 text-red-700',
    };

    const statusLabels = {
        active: '활성',
        used: '사용됨',
        expired: '만료',
        deleted: '삭제됨',
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
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-navy mb-2">
                                <ArrowLeft size={18} />
                                대시보드로 돌아가기
                            </Link>
                            <h1 className="text-2xl font-bold text-navy">바우처 관리</h1>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus size={18} />
                            새 바우처
                        </button>
                    </div>

                    {/* 필터 & 검색 */}
                    <div className="glass rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="코드 검색..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-electric"
                            />
                        </div>
                        <div className="flex gap-2">
                            {['all', 'active', 'used', 'deleted'].map(f => (
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
                    </div>

                    {/* 테이블 */}
                    <div className="glass rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">코드</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">상태</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">사용자</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">생성일</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingData ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                                            로딩 중...
                                        </td>
                                    </tr>
                                ) : filteredVouchers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            바우처가 없습니다
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVouchers.map(voucher => (
                                        <tr key={voucher.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <code className="font-mono font-bold text-navy">{voucher.code}</code>
                                                    <button
                                                        onClick={() => copyCode(voucher.code)}
                                                        className="text-gray-400 hover:text-electric"
                                                        title="복사"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[voucher.status]}`}>
                                                    {statusLabels[voucher.status]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {voucher.used_by_name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(voucher.created_at).toLocaleDateString('ko-KR')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {voucher.status === 'active' && (
                                                        <button
                                                            onClick={() => updateStatus(voucher.id, 'expired')}
                                                            className="p-2 text-gray-400 hover:text-orange-500"
                                                            title="만료 처리"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}
                                                    {voucher.status !== 'deleted' && (
                                                        <button
                                                            onClick={() => deleteVoucher(voucher.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500"
                                                            title="삭제"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
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

            {/* 생성 모달 */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative glass rounded-2xl p-6 max-w-md w-full animate-fadeInUp">
                        <h2 className="text-xl font-bold text-navy mb-4">새 바우처 생성</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">바우처 코드</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCode}
                                        onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                        placeholder="예: A4K-PREMIUM"
                                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-electric font-mono"
                                    />
                                    <button
                                        onClick={generateCode}
                                        className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                        title="자동 생성"
                                    >
                                        <RefreshCw size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={createVoucher}
                                    disabled={!newCode.trim()}
                                    className="flex-1 btn-primary disabled:opacity-50"
                                >
                                    생성
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
