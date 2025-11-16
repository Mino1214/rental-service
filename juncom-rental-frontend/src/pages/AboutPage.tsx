import { Header } from '../components/Header';
import Footer from '../components/Footer';
import { GameController, Laptop, Wrench, Package } from 'phosphor-react';

export default function AboutPage() {
    return (
        <div className="w-full min-h-screen bg-white">
            <Header />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        회사소개
                    </h1>
                    <div className="h-1 w-24 bg-pastel-orange rounded-full mx-auto"></div>
                </div>

                <div className="space-y-8">
                    <section className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">IT렌탈이란?</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            IT렌탈은 최신 IT 장비를 합리적인 가격으로 대여해드리는 서비스입니다.
                            게이밍 PC부터 워크스테이션, 개발용 컴퓨터까지 다양한 장비를 시간, 일, 월 단위로
                            유연하게 대여할 수 있습니다.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            고객 여러분의 IT 환경 구축을 돕기 위해 항상 최선을 다하겠습니다.
                        </p>
                    </section>

                    <section className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">주요 서비스</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <GameController className="w-10 h-10 text-gray-700 mb-2" weight="duotone" />
                                <h3 className="font-semibold text-gray-900 mb-2">게이밍 PC</h3>
                                <p className="text-sm text-gray-600">
                                    최신 RTX 그래픽카드를 탑재한 고성능 게이밍 PC
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <Laptop className="w-10 h-10 text-gray-700 mb-2" weight="duotone" />
                                <h3 className="font-semibold text-gray-900 mb-2">워크스테이션</h3>
                                <p className="text-sm text-gray-600">
                                    AI 딥러닝 및 영상편집용 전문 워크스테이션
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <Wrench className="w-10 h-10 text-gray-700 mb-2" weight="duotone" />
                                <h3 className="font-semibold text-gray-900 mb-2">개발용 PC</h3>
                                <p className="text-sm text-gray-600">
                                    소프트웨어 개발 및 테스트용 최적화 PC
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <Package className="w-10 h-10 text-gray-700 mb-2" weight="duotone" />
                                <h3 className="font-semibold text-gray-900 mb-2">유연한 대여</h3>
                                <p className="text-sm text-gray-600">
                                    일, 주, 월 단위로 선택 가능한 대여 기간
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">연락처</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600">이메일:</span>
                                <span className="text-gray-900 font-medium">contact@itrental.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600">전화:</span>
                                <span className="text-gray-900 font-medium">1588-0000</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600">운영시간:</span>
                                <span className="text-gray-900 font-medium">평일 09:00 - 18:00</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}

