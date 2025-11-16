import { useState } from 'react';
import { Header } from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function QuotePage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        category: '',
        period: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 실제로는 API 호출
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // 3초 후 폼 초기화
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                category: '',
                period: '',
                message: '',
            });
        }, 3000);
    };

    return (
        <div className="w-full min-h-screen bg-white">
            <Header />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        견적문의
                    </h1>
                    <div className="h-1 w-24 bg-pastel-orange rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-4">
                        원하시는 IT 장비의 견적을 문의해주세요. 빠르게 답변드리겠습니다.
                    </p>
                </div>

                {isSubmitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                    >
                        <div className="text-5xl mb-4">✓</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            문의가 접수되었습니다!
                        </h2>
                        <p className="text-gray-600">
                            빠른 시일 내에 연락드리겠습니다.
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    이름 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pastel-orange focus:ring-4 focus:ring-pastel-orange-light transition-all"
                                    placeholder="홍길동"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    이메일 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pastel-orange focus:ring-4 focus:ring-pastel-orange-light transition-all"
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                    전화번호 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pastel-orange focus:ring-4 focus:ring-pastel-orange-light transition-all"
                                    placeholder="010-1234-5678"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                    장비 카테고리 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pastel-orange focus:ring-4 focus:ring-pastel-orange-light transition-all"
                                >
                                    <option value="">선택해주세요</option>
                                    <option value="gaming">게이밍 PC</option>
                                    <option value="workstation">워크스테이션</option>
                                    <option value="development">개발용 PC</option>
                                    <option value="other">기타</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="period" className="block text-sm font-semibold text-gray-700 mb-2">
                                    대여 기간 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="period"
                                    name="period"
                                    required
                                    value={formData.period}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pastel-orange focus:ring-4 focus:ring-pastel-orange-light transition-all"
                                >
                                    <option value="">선택해주세요</option>
                                    <option value="hour">시간 단위</option>
                                    <option value="day">일 단위</option>
                                    <option value="month">월 단위</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                    문의 내용
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pastel-orange focus:ring-4 focus:ring-pastel-orange-light transition-all resize-none"
                                    placeholder="원하시는 사양이나 추가 요구사항을 적어주세요..."
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full px-6 py-4 bg-pastel-orange text-white rounded-full font-semibold hover:bg-pastel-orange-dark active:bg-pastel-orange-dark transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        제출 중...
                                    </span>
                                ) : (
                                    '견적 문의하기'
                                )}
                            </motion.button>
                        </div>
                    </form>
                )}
            </div>
            <Footer />
        </div>
    );
}

