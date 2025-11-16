const services = [
    { title: "헤어", icon: "/icons/scissors.png" },
    { title: "네일", icon: "/icons/nail.png" },
    { title: "속눈썹", icon: "/icons/eyebrow.png" },
    { title: "바디 케어", icon: "/icons/bodycare.png" },
    { title: "페이스", icon: "/icons/skincare.png" },
    { title: "타투", icon: "/icons/tattoo.png" },
    { title: "메이크 업", icon: "/icons/makeup.png" },
    { title: "왁싱", icon: "/icons/waxing.png" },
    { title: "퍼스널 진단", icon: "/icons/personalcare.png" },
    { title: "메디컬", icon: "/icons/medical.png" },
];

export default function ServiceMenu() {
    return (
        <div className="grid grid-cols-5 gap-y-6 place-items-center">

            {services.map((item) => (
                <div key={item.title} className="flex flex-col items-center cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                        <img src={item.icon} className="w-8 h-8" />
                    </div>

                    <p className="text-xs mt-2">{item.title}</p>
                </div>
            ))}
        </div>
    );
}