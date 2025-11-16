import { create } from 'zustand';

export interface Computer {
    id: string;
    name: string;
    category: string;
    specs: {
        cpu: string;
        gpu: string;
        ram: string;
        storage: string;
    };
    prices: {
        day?: number;
        week?: number;
        month?: number;
    };
    image: string;
    rating: number;
    reviews: number;
    available: boolean;
    tags: string[];
}

interface ComputerState {
    // 컴퓨터 목록
    allComputers: Computer[];
    popularComputers: Computer[];
    featuredComputers: Computer[];

    // 로딩 상태
    isLoadingAll: boolean;
    isLoadingPopular: boolean;
    isLoadingFeatured: boolean;

    // 즐겨찾기
    favorites: string[];

    // 현재 선택된 탭
    selectedTab: number;

    // Actions
    setAllComputers: (computers: Computer[]) => void;
    setPopularComputers: (computers: Computer[]) => void;
    setFeaturedComputers: (computers: Computer[]) => void;
    toggleFavorite: (id: string) => void;
    setSelectedTab: (tab: number) => void;
    setLoadingAll: (loading: boolean) => void;
    setLoadingPopular: (loading: boolean) => void;
    setLoadingFeatured: (loading: boolean) => void;
}

export const useComputerStore = create<ComputerState>((set) => ({
    allComputers: [],
    popularComputers: [],
    featuredComputers: [],

    isLoadingAll: false,
    isLoadingPopular: false,
    isLoadingFeatured: false,

    favorites: [],
    selectedTab: 0,

    setAllComputers: (computers) => set({ allComputers: computers }),
    setPopularComputers: (computers) => set({ popularComputers: computers }),
    setFeaturedComputers: (computers) => set({ featuredComputers: computers }),

    toggleFavorite: (id) =>
        set((state) => ({
            favorites: state.favorites.includes(id)
                ? state.favorites.filter((fav) => fav !== id)
                : [...state.favorites, id],
        })),

    setSelectedTab: (tab) => set({ selectedTab: tab }),
    setLoadingAll: (loading) => set({ isLoadingAll: loading }),
    setLoadingPopular: (loading) => set({ isLoadingPopular: loading }),
    setLoadingFeatured: (loading) => set({ isLoadingFeatured: loading }),
}));