import { TrainerCard, type Trainer } from "./trainer-card"

const trainers: Trainer[] = [
    { id: "1", name: "Sam Cole", img: "https://e7.pngegg.com/pngimages/684/333/png-clipart-physical-fitness-personal-trainer-fitness-professional-coach-bodybuilding-fitness-coach-tshirt-arm.png" },
    { id: "2", name: "Michael Harris", img: "/images/michael.jpg" },
    { id: "3", name: "John Anderson", img: "/images/john.jpg" },
    { id: "4", name: "Tom Blake", img: "/images/tom.jpg" },
];
export const TrainerSection = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trainers.map((t) => (
                    <TrainerCard key={t.id} trainer={t} onLearnMore={(id) => console.log("learn", id)} />
                ))}
            </div>
        </div>
    );
}
