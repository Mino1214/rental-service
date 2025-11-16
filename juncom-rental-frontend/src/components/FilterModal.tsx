import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ComputerTower, Laptop, DeviceTablet } from 'phosphor-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
}

export interface FilterState {
    category: string;
    os: string[];
    ram: string[];
    storage: string[];
    cpu: string[];
    gpu: string[];
}

const categories = [
    { id: 'desktop', name: '데스크탑', Icon: ComputerTower },
    { id: 'laptop', name: '노트북', Icon: Laptop },
    { id: 'tablet', name: '태블릿', Icon: DeviceTablet },
];

const osOptions = ['Windows', 'macOS', 'Linux'];
const ramOptions = ['8GB', '16GB', '32GB', '64GB', '128GB', '256GB'];
const storageOptions = ['256GB', '512GB', '1TB', '2TB', '4TB', '8TB'];
const cpuOptions = ['Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3'];
const gpuOptions = ['RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'RTX 4060 Ti', 'RTX 4070 Ti', 'RTX 4080 Super', 'Intel UHD', 'AMD Radeon'];

export const FilterModal = ({ isOpen, onClose, onApply }: FilterModalProps) => {
    const [filters, setFilters] = useState<FilterState>({
        category: '',
        os: [],
        ram: [],
        storage: [],
        cpu: [],
        gpu: [],
    });

    // 모달이 열릴 때 body 스크롤 숨기기
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const toggleFilter = (type: keyof FilterState, value: string) => {
        if (type === 'category') {
            setFilters((prev) => ({
                ...prev,
                category: prev.category === value ? '' : value,
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                [type]: prev[type].includes(value)
                    ? prev[type].filter((item) => item !== value)
                    : [...prev[type], value],
            }));
        }
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({
            category: '',
            os: [],
            ram: [],
            storage: [],
            cpu: [],
            gpu: [],
        });
    };

    const getActiveCount = () => {
        let count = 0;
        if (filters.category) count++;
        count += filters.os.length;
        count += filters.ram.length;
        count += filters.storage.length;
        count += filters.cpu.length;
        count += filters.gpu.length;
        return count;
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed inset-0 bg-white z-[9999] overflow-y-auto"
                >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10 backdrop-blur-sm bg-white/95">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">필터</h2>
                                {getActiveCount() > 0 && (
                                    <span className="px-2.5 py-1 bg-pastel-orange text-white text-xs font-semibold rounded-full">
                                        {getActiveCount()}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8">
                            {/* 대분류 */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">대분류</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {categories.map((category) => {
                                        const IconComponent = category.Icon;
                                        const isSelected = filters.category === category.id;
                                        return (
                                            <motion.button
                                                key={category.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => toggleFilter('category', category.id)}
                                                className={`p-4 rounded-xl border-2 transition-all ${
                                                    isSelected
                                                        ? 'border-pastel-orange bg-pastel-orange-light'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <IconComponent
                                                        className={`w-8 h-8 ${isSelected ? 'text-pastel-orange-dark' : 'text-gray-600'}`}
                                                        weight={isSelected ? 'fill' : 'duotone'}
                                                    />
                                                    <span className={`text-sm font-semibold ${isSelected ? 'text-pastel-orange-dark' : 'text-gray-700'}`}>
                                                        {category.name}
                                                    </span>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 운영체제 */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">운영체제</h3>
                                <div className="flex flex-wrap gap-2">
                                    {osOptions.map((os) => {
                                        const isSelected = filters.os.includes(os);
                                        return (
                                            <motion.button
                                                key={os}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleFilter('os', os)}
                                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                                    isSelected
                                                        ? 'bg-pastel-orange text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {os}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* RAM */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">RAM</h3>
                                <div className="flex flex-wrap gap-2">
                                    {ramOptions.map((ram) => {
                                        const isSelected = filters.ram.includes(ram);
                                        return (
                                            <motion.button
                                                key={ram}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleFilter('ram', ram)}
                                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                                    isSelected
                                                        ? 'bg-pastel-orange text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {ram}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 저장공간 */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">저장공간</h3>
                                <div className="flex flex-wrap gap-2">
                                    {storageOptions.map((storage) => {
                                        const isSelected = filters.storage.includes(storage);
                                        return (
                                            <motion.button
                                                key={storage}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleFilter('storage', storage)}
                                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                                    isSelected
                                                        ? 'bg-pastel-orange text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {storage}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* CPU */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">CPU</h3>
                                <div className="flex flex-wrap gap-2">
                                    {cpuOptions.map((cpu) => {
                                        const isSelected = filters.cpu.includes(cpu);
                                        return (
                                            <motion.button
                                                key={cpu}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleFilter('cpu', cpu)}
                                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                                    isSelected
                                                        ? 'bg-pastel-orange text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {cpu}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* GPU */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">GPU</h3>
                                <div className="flex flex-wrap gap-2">
                                    {gpuOptions.map((gpu) => {
                                        const isSelected = filters.gpu.includes(gpu);
                                        return (
                                            <motion.button
                                                key={gpu}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleFilter('gpu', gpu)}
                                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                                    isSelected
                                                        ? 'bg-pastel-orange text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {gpu}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-3 backdrop-blur-sm bg-white/95 max-w-6xl mx-auto">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                            >
                                초기화
                            </button>
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    취소
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleApply}
                                    className="px-6 py-2.5 bg-pastel-orange text-white rounded-full font-semibold hover:bg-pastel-orange-dark transition-colors"
                                >
                                    적용하기
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

