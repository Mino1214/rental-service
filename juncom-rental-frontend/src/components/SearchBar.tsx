import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
    onSearchClick?: () => void;
}

export const SearchBar = ({ onSearchClick }: SearchBarProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full"
        >
            <div className="relative">
                <input
                    type="text"
                    placeholder="어떤 컴퓨터를 찾으시나요? 💻"
                    onClick={onSearchClick}
                    readOnly
                    className="w-full px-6 py-4 pr-14 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl
                     focus:outline-none focus:border-pastel-orange focus:ring-4 focus:ring-pastel-orange-light
                     transition-all duration-300 placeholder:text-gray-400 shadow-sm
                     hover:border-pastel-orange hover:shadow-md cursor-pointer"
                />
                <button 
                    onClick={onSearchClick}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-pastel-orange
                         text-white rounded-full hover:bg-pastel-orange-dark active:bg-pastel-orange-dark shadow-sm hover:shadow-md transition-all duration-200">
                    <Search className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
};