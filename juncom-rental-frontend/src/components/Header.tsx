import { Menu, X, Heart, Search, User, LogOut } from 'lucide-react';
import { ComputerTower } from 'phosphor-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useComputerStore } from '../types/ComputerStore';
import { useAuthStore } from '../types/AuthStore';
import { api } from '../utils/api';
import { FilterModal, FilterState } from './FilterModal';

export const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const { favorites } = useComputerStore();
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await api.auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            logout();
            setUserMenuOpen(false);
            navigate('/');
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* 로고 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
                    >
                        <div className="w-11 h-11 bg-pastel-orange rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                            <ComputerTower className="w-6 h-6 text-white" weight="fill" />
                        </div>
                        <span className="hidden sm:inline text-xl font-bold text-pastel-orange-dark">
                            IT렌탈
                        </span>
                        <span className="sm:hidden text-lg font-bold text-pastel-orange-dark">
                            렌탈
                        </span>
                    </motion.div>

                    {/* 데스크톱 네비게이션 */}
                    <nav className="hidden md:flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className={`text-gray-700 transition-colors font-semibold text-sm px-4 py-2 rounded-lg ${
                                location.pathname === '/' 
                                    ? 'text-pastel-orange-dark bg-pastel-orange-light' 
                                    : 'hover:text-pastel-orange-dark hover:bg-pastel-orange-light'
                            }`}
                        >
                            홈
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/about')}
                            className={`text-gray-700 transition-colors font-semibold text-sm px-4 py-2 rounded-lg ${
                                location.pathname === '/about' 
                                    ? 'text-pastel-orange-dark bg-pastel-orange-light' 
                                    : 'hover:text-pastel-orange-dark hover:bg-pastel-orange-light'
                            }`}
                        >
                            회사소개
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/quote')}
                            className={`text-gray-700 transition-colors font-semibold text-sm px-4 py-2 rounded-lg ${
                                location.pathname === '/quote' 
                                    ? 'text-pastel-orange-dark bg-pastel-orange-light' 
                                    : 'hover:text-pastel-orange-dark hover:bg-pastel-orange-light'
                            }`}
                        >
                            견적문의
                        </motion.button>
                    </nav>

                    {/* 오른쪽 아이콘 */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* 검색 아이콘 - 모바일에서 숨김 */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilterModalOpen(true)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:inline-flex"
                        >
                            <Search className="w-5 h-5 text-gray-700" />
                        </motion.button>

                        {/* 즐겨찾기 배지 */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                        >
                            <Heart className="w-5 h-5 text-gray-700" />
                            {favorites.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {favorites.length}
                                </span>
                            )}
                        </motion.button>

                        {/* 로그인/사용자 메뉴 */}
                        {isAuthenticated && user ? (
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-pastel-orange flex items-center justify-center text-white text-sm font-semibold shadow-md">
                                            {user.name.charAt(0)}
                                        </div>
                                    )}
                                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                                        {user.name}
                                    </span>
                                </motion.button>

                                {/* 사용자 메뉴 드롭다운 */}
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                로그아웃
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/login')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-pastel-orange text-white rounded-full hover:bg-pastel-orange-dark active:bg-pastel-orange-dark transition-all text-sm font-semibold shadow-sm hover:shadow-md"
                            >
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">로그인</span>
                            </motion.button>
                        )}

                        {/* 모바일 메뉴 버튼 */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* 모바일 메뉴 */}
                {mobileMenuOpen && (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-100"
                    >
                        <div className="py-3 space-y-1">
                            <button
                                onClick={() => {
                                    navigate('/');
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 transition-colors font-medium ${
                                    location.pathname === '/' 
                                        ? 'text-pastel-orange-dark bg-pastel-orange-light' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                홈
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/about');
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 transition-colors font-medium ${
                                    location.pathname === '/about' 
                                        ? 'text-pastel-orange-dark bg-pastel-orange-light' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                회사소개
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/quote');
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 transition-colors font-medium ${
                                    location.pathname === '/quote' 
                                        ? 'text-pastel-orange-dark bg-pastel-orange-light' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                견적문의
                            </button>
                            {!isAuthenticated && (
                                <button
                                    onClick={() => {
                                        navigate('/login');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                                >
                                    로그인
                                </button>
                            )}
                            {isAuthenticated && user && (
                                <>
                                    <div className="px-4 py-2 border-t border-gray-100 mt-2">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-medium"
                                    >
                                        로그아웃
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.nav>
                )}
            </div>
            {/* 사용자 메뉴 외부 클릭 시 닫기 */}
            {userMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                />
            )}

            {/* 필터 모달 */}
            <FilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                onApply={(filters: FilterState) => {
                    console.log('Applied filters:', filters);
                    // TODO: 필터 적용 로직 구현
                }}
            />
        </header>
    );
};
