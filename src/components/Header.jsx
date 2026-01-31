import { Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAdmin, logout } = useAuth();

    return (
        <header className="glass-dark sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* 로고 영역 */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric to-electric-light flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A4K</span>
                        </div>
                        <span className="text-white font-semibold text-xl">A4K</span>
                    </Link>

                    {/* 데스크톱 네비게이션 */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-white/80 hover:text-white transition-colors font-medium">
                            홈
                        </Link>
                        <a href="#courses" className="text-white/80 hover:text-white transition-colors font-medium">
                            교육 과정
                        </a>
                        <a href="#contact" className="text-white/80 hover:text-white transition-colors font-medium">
                            문의하기
                        </a>

                        {/* 관리자 버튼 */}
                        {isAdmin ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/admin/dashboard"
                                    className="flex items-center gap-2 bg-electric/20 text-electric px-4 py-2 rounded-lg hover:bg-electric/30 transition-colors"
                                >
                                    <Settings size={18} />
                                    관리자
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-white/60 hover:text-white text-sm transition-colors"
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/admin/login"
                                className="text-white/60 hover:text-white text-sm transition-colors"
                            >
                                관리자
                            </Link>
                        )}
                    </nav>

                    {/* 모바일 메뉴 버튼 */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="메뉴 토글"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* 모바일 네비게이션 */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-white/10">
                        <div className="flex flex-col gap-4">
                            <Link to="/" className="text-white/80 hover:text-white transition-colors font-medium">
                                홈
                            </Link>
                            <a href="#courses" className="text-white/80 hover:text-white transition-colors font-medium">
                                교육 과정
                            </a>
                            <a href="#contact" className="text-white/80 hover:text-white transition-colors font-medium">
                                문의하기
                            </a>
                            {isAdmin ? (
                                <>
                                    <Link to="/admin/dashboard" className="text-electric font-medium">
                                        관리자 대시보드
                                    </Link>
                                    <button onClick={logout} className="text-white/60 text-left">
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <Link to="/admin/login" className="text-white/60">
                                    관리자 로그인
                                </Link>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
