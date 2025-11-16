import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import Footer from '../components/Footer';
import { mockComputers } from '../types/MockData';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Star, Cpu, HardDrive, MemoryStick, Monitor, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useComputerStore } from '../types/ComputerStore';
import { AnimatePresence } from 'framer-motion';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { favorites, toggleFavorite } = useComputerStore();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedPriceUnit, setSelectedPriceUnit] = useState<'day' | 'week' | 'month'>('day');
    const [selectedDuration, setSelectedDuration] = useState<number>(1);
    const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
    const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const durationDropdownRef = useRef<HTMLDivElement>(null);

    const computer = mockComputers.find((c) => c.id === id);

    if (!computer) {
        return (
            <div className="w-full min-h-screen bg-white">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-pastel-orange text-white rounded-full hover:bg-pastel-orange-dark transition-colors"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const isFavorite = favorites.includes(computer.id);
    const images = [computer.image, computer.image, computer.image]; // 예시로 같은 이미지 사용

    const formatPrice = (price: number, unit: string) => {
        return `${price.toLocaleString()}원/${unit === 'day' ? '일' : unit === 'week' ? '주' : '월'}`;
    };

    // 선택 가능한 가격 옵션
    const availablePriceOptions = [
        { unit: 'day' as const, label: '일', price: computer.prices.day },
        { unit: 'week' as const, label: '주', price: computer.prices.week },
        { unit: 'month' as const, label: '월', price: computer.prices.month },
    ].filter((option) => option.price !== undefined);

    // 기간 옵션 생성
    const getDurationOptions = () => {
        if (selectedPriceUnit === 'day') {
            return Array.from({ length: 30 }, (_, i) => i + 1); // 1일~30일
        } else if (selectedPriceUnit === 'week') {
            return Array.from({ length: 12 }, (_, i) => i + 1); // 1주~12주
        } else {
            return [1]; // 월 단위는 1개월만
        }
    };

    const durationOptions = getDurationOptions();

    // 총 가격 계산
    const calculateTotalPrice = () => {
        const basePrice = computer.prices[selectedPriceUnit];
        if (!basePrice) return 0;
        
        if (selectedPriceUnit === 'day') {
            return basePrice * selectedDuration;
        } else if (selectedPriceUnit === 'week') {
            return basePrice * selectedDuration;
        } else {
            return basePrice * selectedDuration;
        }
    };

    const totalPrice = calculateTotalPrice();

    // 컴포넌트가 마운트될 때 일 단위로 설정
    useEffect(() => {
        setSelectedPriceUnit('day');
        setSelectedDuration(1);
    }, [computer.id]);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsPriceDropdownOpen(false);
            }
            if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target as Node)) {
                setIsDurationDropdownOpen(false);
            }
        };

        if (isPriceDropdownOpen || isDurationDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPriceDropdownOpen, isDurationDropdownOpen]);

    // 단위 변경 시 기간 초기화
    useEffect(() => {
        setSelectedDuration(1);
    }, [selectedPriceUnit]);

    return (
        <div className="w-full min-h-screen bg-white">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 뒤로가기 버튼 */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-pastel-orange-dark transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>목록으로</span>
                </motion.button>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* 왼쪽: 이미지 */}
                    <div className="space-y-4">
                        {/* 메인 이미지 */}
                        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                            <img
                                src={images[selectedImageIndex]}
                                alt={computer.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => toggleFavorite(computer.id)}
                                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                            >
                                <Heart
                                    className={`w-6 h-6 transition-colors ${
                                        isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                                    }`}
                                />
                            </button>
                            {!computer.available && (
                                <div className="absolute top-4 left-4 px-4 py-2 bg-gray-900/80 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                                    대여중
                                </div>
                            )}
                        </div>

                        {/* 썸네일 이미지 */}
                        <div className="grid grid-cols-3 gap-3">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                                        selectedImageIndex === index
                                            ? 'border-pastel-orange'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <img src={img} alt={`${computer.name} ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 오른쪽: 상품 정보 */}
                    <div className="space-y-6">
                        {/* 제목 및 평점 */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                {computer.name}
                            </h1>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-lg font-semibold text-gray-900">{computer.rating}</span>
                                </div>
                                <span className="text-gray-500">({computer.reviews}개 리뷰)</span>
                                <span className="px-3 py-1 bg-pastel-orange-light text-pastel-orange-dark rounded-full text-sm font-semibold">
                                    {computer.category === 'gaming' ? '게이밍' : computer.category === 'workstation' ? '워크스테이션' : '개발용'}
                                </span>
                            </div>
                        </div>

                        {/* 가격 */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <div className="space-y-4">
                                {/* 단위 선택 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        대여 단위 선택
                                    </label>
                                    <div className="relative" ref={dropdownRef}>
                                        <motion.button
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pastel-orange focus:ring-4 focus:ring-pastel-orange-light transition-all bg-white font-semibold text-gray-900 flex items-center justify-between hover:border-pastel-orange"
                                        >
                                            <span>
                                                {availablePriceOptions.find((opt) => opt.unit === selectedPriceUnit)?.label} 단위 - {computer.prices[selectedPriceUnit] ? formatPrice(computer.prices[selectedPriceUnit]!, selectedPriceUnit) : '가격 문의'}
                                            </span>
                                            <motion.div
                                                animate={{ rotate: isPriceDropdownOpen ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            </motion.div>
                                        </motion.button>

                                        <AnimatePresence>
                                            {isPriceDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                                                >
                                                    {availablePriceOptions.map((option) => {
                                                        const isSelected = option.unit === selectedPriceUnit;
                                                        
                                                        return (
                                                            <motion.button
                                                                key={option.unit}
                                                                whileHover={{ backgroundColor: 'rgb(249 250 251)' }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={() => {
                                                                    setSelectedPriceUnit(option.unit);
                                                                    setIsPriceDropdownOpen(false);
                                                                }}
                                                                className={`w-full px-4 py-3 text-left transition-all ${
                                                                    isSelected
                                                                        ? 'bg-pastel-orange-light text-pastel-orange-dark font-semibold'
                                                                        : 'text-gray-700 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-semibold">{option.label} 단위</span>
                                                                    <span className={`${isSelected ? 'text-pastel-orange-dark' : 'text-gray-900'} font-bold`}>
                                                                        {formatPrice(option.price!, option.unit)}
                                                                    </span>
                                                                </div>
                                                            </motion.button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* 기간 선택 (일/주 단위일 때만) */}
                                {(selectedPriceUnit === 'day' || selectedPriceUnit === 'week') && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {selectedPriceUnit === 'day' ? '몇 일' : '몇 주'} 대여하시나요?
                                        </label>
                                        <div className="relative" ref={durationDropdownRef}>
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pastel-orange focus:ring-4 focus:ring-pastel-orange-light transition-all bg-white font-semibold text-gray-900 flex items-center justify-between hover:border-pastel-orange"
                                            >
                                                <span>
                                                    {selectedDuration}{selectedPriceUnit === 'day' ? '일' : '주'}
                                                </span>
                                                <motion.div
                                                    animate={{ rotate: isDurationDropdownOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                </motion.div>
                                            </motion.button>

                                            <AnimatePresence>
                                                {isDurationDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto"
                                                    >
                                                        {durationOptions.map((duration) => {
                                                            const isSelected = duration === selectedDuration;
                                                            
                                                            return (
                                                                <motion.button
                                                                    key={duration}
                                                                    whileHover={{ backgroundColor: 'rgb(249 250 251)' }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={() => {
                                                                        setSelectedDuration(duration);
                                                                        setIsDurationDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full px-4 py-3 text-left transition-all ${
                                                                        isSelected
                                                                            ? 'bg-pastel-orange-light text-pastel-orange-dark font-semibold'
                                                                            : 'text-gray-700 hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                    {duration}{selectedPriceUnit === 'day' ? '일' : '주'}
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 총 가격 */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">
                                        {selectedPriceUnit === 'day' && `${selectedDuration}일`}
                                        {selectedPriceUnit === 'week' && `${selectedDuration}주`}
                                        {selectedPriceUnit === 'month' && `${selectedDuration}개월`} 대여 금액
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-pastel-orange-dark">
                                        {totalPrice ? `${totalPrice.toLocaleString()}원` : '가격 문의'}
                                    </span>
                                </div>
                                {selectedPriceUnit === 'day' && computer.prices.day && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        일당 {computer.prices.day.toLocaleString()}원 × {selectedDuration}일
                                    </p>
                                )}
                                {selectedPriceUnit === 'week' && computer.prices.week && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        주당 {computer.prices.week.toLocaleString()}원 × {selectedDuration}주
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 태그 */}
                        <div className="flex flex-wrap gap-2">
                            {computer.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* 대여하기 버튼 */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!computer.available}
                            className={`w-full px-6 py-4 rounded-full text-lg font-semibold transition-all ${
                                computer.available
                                    ? 'bg-pastel-orange text-white hover:bg-pastel-orange-dark active:bg-pastel-orange-dark shadow-md hover:shadow-lg'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {computer.available ? '대여하기' : '대기중'}
                        </motion.button>

                        {/* 상세 정보 */}
                        <div className="border-t border-gray-200 pt-6 space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">시스템 사양</h2>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <Cpu className="w-5 h-5 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">프로세서</p>
                                            <p className="font-semibold text-gray-900">{computer.specs.cpu}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <HardDrive className="w-5 h-5 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">그래픽카드</p>
                                            <p className="font-semibold text-gray-900">{computer.specs.gpu}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <MemoryStick className="w-5 h-5 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">메모리</p>
                                            <p className="font-semibold text-gray-900">{computer.specs.ram}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <HardDrive className="w-5 h-5 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">저장공간</p>
                                            <p className="font-semibold text-gray-900">{computer.specs.storage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 운영체제 및 기타 정보 */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">추가 정보</h2>
                                <div className="space-y-3">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">운영체제</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-900">Windows:</span>
                                                <span className="text-sm text-gray-700">Windows 11 Pro (라이선스 포함)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-900">macOS:</span>
                                                <span className="text-sm text-gray-700">macOS Sonoma (Mac 모델만)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">모니터</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-gray-900">기본: 27인치 4K UHD (포함)</p>
                                            <p className="text-sm text-gray-700">옵션: 32인치 4K, 듀얼 모니터 세트 (+50,000원/일)</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">태블릿</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-gray-900">iPad Pro 12.9인치 (옵션)</p>
                                            <p className="text-sm text-gray-700">M2 칩셋, 256GB, Apple Pencil 포함 (+30,000원/일)</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">입출력 장치</span>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-700">
                                            <p>• 기계식 키보드 (포함)</p>
                                            <p>• 무선 마우스 (포함)</p>
                                            <p>• 웹캠 1080p (옵션, +5,000원/일)</p>
                                            <p>• 마이크 세트 (옵션, +5,000원/일)</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">네트워크</span>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-700">
                                            <p>• 유선 LAN (기가비트 이더넷)</p>
                                            <p>• Wi-Fi 6E (802.11ax)</p>
                                            <p>• Bluetooth 5.3</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">포트</span>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-700">
                                            <p>• USB 3.2 Gen 2 Type-C x2</p>
                                            <p>• USB 3.2 Gen 1 Type-A x4</p>
                                            <p>• HDMI 2.1, DisplayPort 1.4</p>
                                            <p>• 3.5mm 오디오 잭</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <span className="text-gray-600">배송</span>
                                        <span className="font-semibold text-gray-900">무료 배송 (전국)</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <span className="text-gray-600">설치 지원</span>
                                        <span className="font-semibold text-gray-900">무료 설치 (서울/경기)</span>
                                    </div>
                                </div>
                            </div>

                            {/* 대여 가능 여부 */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                {computer.available ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-900 font-semibold">현재 대여 가능합니다</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-5 h-5 text-red-500" />
                                        <span className="text-gray-900 font-semibold">현재 대여중입니다</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 상세 설명 섹션 */}
                <div className="mt-12 border-t border-gray-200 pt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">상품 상세 설명</h2>
                    <div className="prose max-w-none space-y-4 text-gray-700">
                        <p>
                            {computer.name}은 최신 하드웨어를 탑재한 고성능 컴퓨터입니다. 
                            {computer.category === 'gaming' && '게이밍에 최적화된 성능으로 최신 게임을 부드럽게 즐길 수 있습니다.'}
                            {computer.category === 'workstation' && 'AI 딥러닝, 영상편집 등 전문 작업에 최적화되어 있습니다.'}
                            {computer.category === 'development' && '소프트웨어 개발 및 테스트 환경에 최적화되어 있습니다.'}
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h3 className="font-semibold text-gray-900 mb-3">주요 특징</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <span>최신 하드웨어 구성으로 뛰어난 성능 제공</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <span>빠른 처리 속도로 작업 효율 극대화</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <span>안정적인 성능으로 장시간 작업 가능</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <span>조용한 쿨링 시스템으로 집중 환경 조성</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h3 className="font-semibold text-gray-900 mb-3">포함 사항</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <span>본체 (CPU, GPU, RAM, Storage)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <span>기계식 키보드 및 무선 마우스</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <span>전원 케이블 및 어댑터</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-pastel-orange-dark mt-0.5 flex-shrink-0" />
                                        <span>사용 설명서 및 보증서</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        {/* Windows/Mac 상세 사양 */}
                        <div className="mt-8 grid md:grid-cols-2 gap-6">
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <Monitor className="w-6 h-6 text-blue-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Windows 버전</h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-600 mb-1">운영체제</p>
                                        <p className="font-semibold text-gray-900">Windows 11 Pro (정품 라이선스)</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 mb-1">사전 설치 소프트웨어</p>
                                        <p className="text-gray-700">Office 365, Chrome, 필수 드라이버</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 mb-1">호환성</p>
                                        <p className="text-gray-700">모든 Windows 소프트웨어 호환</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <Monitor className="w-6 h-6 text-gray-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Mac 버전</h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-600 mb-1">운영체제</p>
                                        <p className="font-semibold text-gray-900">macOS Sonoma (최신 버전)</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 mb-1">사전 설치 소프트웨어</p>
                                        <p className="text-gray-700">Xcode, Final Cut Pro, Logic Pro (옵션)</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 mb-1">호환성</p>
                                        <p className="text-gray-700">모든 macOS/iOS 개발 도구 지원</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

