import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ComputerTower, Laptop, DeviceTablet, DotsThree } from 'phosphor-react';
import { categories } from "../types/MockData.ts";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const mainCategories = [
    { id: 'desktop', name: '데스크탑', Icon: ComputerTower },
    { id: 'laptop', name: '노트북', Icon: Laptop },
    { id: 'tablet', name: '태블릿', Icon: DeviceTablet },
];

export const CategoryGrid = () => {
    const [showMore, setShowMore] = useState(false);

    return (
        <div>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6"
            >
                {mainCategories.map((category) => {
                    const IconComponent = category.Icon;
                    return (
                        <motion.button
                            key={category.id}
                            variants={item}
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group"
                        >
                            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6
                                transition-all duration-300 hover:scale-105">
                                <div className="flex flex-col items-center gap-2 md:gap-4">
                                    <div className="mb-1 md:mb-2 transform group-hover:scale-110 transition-transform duration-300">
                                        <IconComponent className="w-10 h-10 md:w-16 md:h-16 text-gray-700" weight="duotone" />
                                    </div>
                                    <span className="text-sm md:text-base font-bold text-gray-800 group-hover:text-pastel-orange-dark transition-colors">
                                        {category.name}
                                    </span>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}

                {/* 더보기 버튼 */}
                <motion.button
                    variants={item}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMore(!showMore)}
                    className="relative group"
                >
                        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6
                        transition-all duration-300 hover:scale-105">
                        <div className="flex flex-col items-center gap-2 md:gap-4">
                            <div className="mb-1 md:mb-2 transform group-hover:scale-110 transition-transform duration-300">
                                <DotsThree className="w-10 h-10 md:w-16 md:h-16 text-gray-700" weight="duotone" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm md:text-base font-bold text-gray-800 group-hover:text-pastel-orange-dark transition-colors">
                                    더보기
                                </span>
                                <motion.div
                                    animate={{ rotate: showMore ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.button>
            </motion.div>

            {/* 더보기 카테고리들 */}
            <AnimatePresence>
                {showMore && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 overflow-hidden"
                    >
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 md:gap-6"
                        >
                            {categories.map((category) => {
                                const IconComponent = category.Icon;
                                return (
                                    <motion.button
                                        key={category.id}
                                        variants={item}
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative group"
                                    >
                                        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5
                                            transition-all duration-300 hover:scale-105">
                                            <div className="flex flex-col items-center gap-2 md:gap-3">
                                                <div className="transform group-hover:scale-110 transition-transform duration-300">
                                                    <IconComponent className="w-8 h-8 md:w-14 md:h-14 text-gray-700" weight="duotone" />
                                                </div>
                                                <span className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-pastel-orange-dark transition-colors">
                                                    {category.name}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};