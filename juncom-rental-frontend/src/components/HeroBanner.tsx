import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { GameController, Robot, FilmStrip } from 'phosphor-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const banners = [
    {
        id: 1,
        title: '최신 RTX 4090 게이밍 PC',
        subtitle: '일당 300,000원부터 🔥',
        Icon: GameController,
    },
    {
        id: 2,
        title: 'AI 딥러닝 워크스테이션',
        subtitle: 'GPU 파워 무제한 💪',
        Icon: Robot,
    },
    {
        id: 3,
        title: '영상편집 전문가용',
        subtitle: '4K 편집도 끊김 없이 ✨',
        Icon: FilmStrip,
    },
];

export const HeroBanner = () => {
    return (
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
                }}
                loop={true}
                className="h-[240px] md:h-[320px] lg:h-[400px]"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <motion.div
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative h-full bg-pastel-orange flex items-center justify-center"
                        >
                            {/* Animated background shapes */}
                            <div className="absolute inset-0 overflow-hidden">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 90, 0],
                                    }}
                                    transition={{
                                        duration: 20,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                    className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                                />
                                <motion.div
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        rotate: [0, -90, 0],
                                    }}
                                    transition={{
                                        duration: 15,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                    className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 text-center px-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-4 flex justify-center"
                                >
                                    <banner.Icon className="w-20 h-20 md:w-24 md:h-24 text-white" weight="duotone" />
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg"
                                >
                                    {banner.title}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-lg md:text-2xl text-white/95 drop-shadow-md"
                                >
                                    {banner.subtitle}
                                </motion.p>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style>{`
        .swiper-pagination {
          bottom: 16px !important;
        }
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          width: 8px !important;
          height: 8px !important;
        }
        .swiper-pagination-bullet-active {
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}</style>
        </div>
    );
};