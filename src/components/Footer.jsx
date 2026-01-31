import { Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer id="contact" className="glass-dark mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* 브랜드 정보 */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric to-electric-light flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A4K</span>
                        </div>
                        <div>
                            <span className="text-white font-semibold text-lg">A4K</span>
                            <p className="text-gray-400 text-sm">프리미엄 교육 센터</p>
                        </div>
                    </div>

                    {/* 연락처 */}
                    <div className="flex items-center gap-3">
                        <Mail size={16} className="text-electric" />
                        <a href="mailto:hello@a4k.ai" className="text-gray-400 hover:text-white transition-colors">
                            hello@a4k.ai
                        </a>
                    </div>
                </div>

                {/* 카피라이트 */}
                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-center text-gray-500 text-sm">
                        © 2026 A4K. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
