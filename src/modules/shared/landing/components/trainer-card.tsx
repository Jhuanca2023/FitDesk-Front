import { Image } from "@/shared/components/ui/image";
import { useRef, useCallback, useEffect } from "react";

export interface Trainer {
    id: string;
    name: string;
    role?: string;
    img: string;
}

type Props = {
    trainer: Trainer;
    onLearnMore?: (id: string) => void;
    enableTilt?: boolean; 
};

export const TrainerCard: React.FC<Props> = ({ trainer, onLearnMore, enableTilt = true }) => {
    const elRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const pointerFineRef = useRef<boolean>(false);

    useEffect(() => {
        pointerFineRef.current =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(pointer: fine)").matches &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    const applyTransform = useCallback((rx: number, ry: number) => {
        const el = elRef.current;
        if (!el) return;
        el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!enableTilt || !pointerFineRef.current) return;
        const el = elRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;

        const rx = (py - 0.5) * 8;   
        const ry = (px - 0.5) * -12; 

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => applyTransform(rx, ry));
    }, [enableTilt, applyTransform]);

    const resetTransform = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const el = elRef.current;
        if (!el) return;
        el.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            resetTransform();
        }
    }, [resetTransform]);

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div className="trainer-card">
            {/** biome-ignore lint/a11y/useSemanticElements: <> */}
            <div
                ref={elRef}
                role="button"
                tabIndex={0}
                aria-label={`Tarjeta de ${trainer.name}`}
                className="card-inner rounded-xl overflow-hidden bg-gradient-to-b from-[#221815] via-[#2a211d] to-[#181212] card-shadow focus:outline-none"
                onPointerMove={handlePointerMove}
                onPointerLeave={resetTransform}
                onKeyDown={handleKeyDown}
                // Mantén el transition por CSS (ver globals.css)
                style={{ transition: "transform 420ms cubic-bezier(.2,.9,.2,1)" }}
            >
                <div className="relative">
                    <Image
                        src={trainer.img}
                        alt={trainer.name}
                        loading="lazy"
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />
                </div>

                <div className="p-4 md:p-5 bg-neutral-900/60">
                    <h3 className="text-white text-lg font-semibold">{trainer.name}</h3>
                    <p className="text-neutral-300 text-sm mt-1">{trainer.role ?? "Personal Trainer"}</p>

                    <div className="mt-4">
                        {/** biome-ignore lint/a11y/useButtonType: <> */}
                        <button
                            onClick={() => onLearnMore?.(trainer.id)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 focus:outline-none"
                        >
                            Learn More →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
