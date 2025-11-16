import { ComputerCard } from './ComputerCard';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type {Computer} from "../types/ComputerStore.ts";

interface ComputerSectionProps {
    computers: Computer[];
    isLoading: boolean;
    sectionName: string;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ComputerSection = ({ computers, isLoading }: ComputerSectionProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-24">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                    <p className="text-gray-500 text-sm">로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!computers || computers.length === 0) {
        return (
            <div className="text-center py-24">
                <div className="text-6xl mb-4">😔</div>
                <p className="text-gray-500 text-lg">표시할 컴퓨터가 없습니다</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
            {computers.map((computer) => (
                <ComputerCard key={computer.id} computer={computer} />
            ))}
        </motion.div>
    );
};