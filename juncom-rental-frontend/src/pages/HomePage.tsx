import {useComputerStore} from "../types/ComputerStore.ts";
import {mockComputers} from "../types/MockData.ts";
import {SearchBar} from "../components/SearchBar.tsx";
import {HeroBanner} from "../components/HeroBanner.tsx";
import {CategoryGrid} from "../components/CategoryGrid.tsx";
import {ComputerSection} from "../components/ComputerSection.tsx";
import {Header} from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {useEffect, useState} from "react";
import {FilterModal, FilterState} from "../components/FilterModal.tsx";


export default function HomePage() {
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const {
        allComputers,
        popularComputers,
        featuredComputers,
        isLoadingAll,
        isLoadingPopular,
        isLoadingFeatured,
        setAllComputers,
        setPopularComputers,
        setFeaturedComputers,
        setLoadingAll,
        setLoadingPopular,
        setLoadingFeatured,
    } = useComputerStore();

    useEffect(() => {
        // 데이터 로딩 시뮬레이션
        const loadData = async () => {
            setLoadingAll(true);
            setLoadingPopular(true);
            setLoadingFeatured(true);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800));

            setAllComputers(mockComputers);
            setPopularComputers(mockComputers.filter((c) => c.rating >= 4.7).slice(0, 4));
            setFeaturedComputers(mockComputers.filter((c) => c.available).slice(0, 4));

            setLoadingAll(false);
            setLoadingPopular(false);
            setLoadingFeatured(false);
        };

        loadData();
    }, []);

    return (
        <div className="w-full min-h-screen bg-white">
            {/* 헤더 */}
            <Header />

            {/* 본문 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* 검색바 - 모바일에서만 표시 */}
                <div className="md:hidden mt-6 mb-6">
                    <SearchBar onSearchClick={() => setFilterModalOpen(true)} />
                </div>

                {/* HeroBanner */}
                <div className="mt-8 md:mt-12">
                    <HeroBanner />
                </div>

                {/* 서비스 메뉴 (CategoryGrid) */}
                <div className="mt-12 md:mt-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-1 w-12 bg-pastel-orange rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            카테고리
                        </h2>
                    </div>
                    <CategoryGrid />
                </div>

                {/* 모든 컴퓨터 */}
                <SectionTitle title="전체 상품" subtitle="다양한 PC를 만나보세요" />
                <ComputerSection
                    computers={allComputers.slice(0, 4)}
                    isLoading={isLoadingAll}
                    sectionName="모든 컴퓨터"
                />

                {/* 인기 있는 컴퓨터 */}
                <SectionTitle title="인기 상품" subtitle="많은 분들이 선택한 PC" emoji="🔥" />
                <ComputerSection
                    computers={popularComputers}
                    isLoading={isLoadingPopular}
                    sectionName="인기 있는 컴퓨터"
                />

                {/* PC렌탈 추천 */}
                <SectionTitle title="추천 상품" subtitle="지금 바로 대여 가능한 PC" emoji="⭐" />
                <ComputerSection
                    computers={featuredComputers}
                    isLoading={isLoadingFeatured}
                    sectionName="PC렌탈 추천"
                />

                <div className="h-20" />
            </div>
            <Footer />
            
            {/* 필터 모달 */}
            <FilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                onApply={(filters: FilterState) => {
                    console.log('Applied filters:', filters);
                    // TODO: 필터 적용 로직 구현
                }}
            />
        </div>
    );
}

function SectionTitle({ 
    title, 
    subtitle, 
    emoji 
}: { 
    title: string; 
    subtitle?: string; 
    emoji?: string;
}) {
    return (
        <div className="mt-16 md:mt-20 mb-8 md:mb-10">
            <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-12 bg-orange-600 rounded-full"></div>
                {emoji && <span className="text-3xl md:text-4xl">{emoji}</span>}
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                    {title}
                </h2>
            </div>
            {subtitle && (
                <p className="text-gray-600 text-base md:text-lg ml-16">{subtitle}</p>
            )}
        </div>
    );
}