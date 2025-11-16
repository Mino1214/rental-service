import { motion } from 'framer-motion';
import { Heart, Star, Cpu, HardDrive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {type Computer, useComputerStore} from "../types/ComputerStore.ts";

interface ComputerCardProps {
    computer: Computer;
}

export const ComputerCard = ({ computer }: ComputerCardProps) => {
    const { favorites, toggleFavorite } = useComputerStore();
    const navigate = useNavigate();
    const isFavorite = favorites.includes(computer.id);

    const formatPrice = (price: number, unit: string) => {
        return `${price.toLocaleString()}원/${unit === 'day' ? '일' : unit === 'week' ? '주' : '월'}`;
    };

    // 일 가격 표시 (홈화면은 항상 일 가격)
    const dayPrice = computer.prices.day;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => navigate(`/product/${computer.id}`)}
            className="relative bg-white rounded-3xl shadow-md border border-gray-200/60 overflow-hidden
                 hover:shadow-2xl hover:border-pastel-orange transition-all duration-300 group backdrop-blur-sm cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-gray-100">
                <img
                    src={computer.image}
                    alt={computer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Favorite Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(computer.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full
                   hover:bg-white transition-all duration-200 shadow-lg z-10"
                >
                    <Heart
                        className={`w-5 h-5 transition-colors ${
                            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                        }`}
                    />
                </button>

                {/* Availability Badge */}
                {!computer.available && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-gray-900/80 backdrop-blur-sm
                        text-white text-xs font-medium rounded-full">
                        대여중
                    </div>
                )}

                {/* Tags */}
                <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap max-w-[calc(100%-1.5rem)]">
                    {computer.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium
                       text-gray-700 rounded-lg"
                        >
              {tag}
            </span>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-1 group-hover:text-pastel-orange-dark transition-colors">
                    {computer.name}
                </h3>

                {/* Specs */}
                <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Cpu className="w-3.5 h-3.5" />
                        <span className="line-clamp-1">{computer.specs.cpu}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span className="line-clamp-1">{computer.specs.gpu}</span>
                    </div>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-1.5 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">{computer.rating}</span>
                    <span className="text-xs text-gray-500">({computer.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        {dayPrice ? (
                            <>
                                <span className="text-xl font-bold text-pastel-orange-dark">
                                    {formatPrice(dayPrice, 'day')}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">부터</p>
                            </>
                        ) : (
                            <span className="text-lg text-gray-400">가격 문의</span>
                        )}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!computer.available}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${computer.id}`);
                        }}
                        className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200
                     ${computer.available
                            ? 'bg-pastel-orange text-white hover:bg-pastel-orange-dark active:bg-pastel-orange-dark shadow-md hover:shadow-lg'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {computer.available ? '대여하기' : '대기중'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};