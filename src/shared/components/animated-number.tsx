import { useMotionValue, useSpring, useTransform, useAnimationFrame } from "motion/react";
import { useEffect, useState } from "react";

interface AnimatedNumberProps {
    value: number;
    className?: string;
    format?: Intl.NumberFormatOptions;
}
export function AnimatedNumber({ value, className, format }: AnimatedNumberProps) {
    const motionValue = useMotionValue(value);
    const spring = useSpring(motionValue, { stiffness: 200, damping: 10 });
    const rounded = useTransform(spring, (latest) => Math.round(latest));
    const [display, setDisplay] = useState(value);

    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    useAnimationFrame(() => {
        setDisplay(rounded.get());
    });

    return (
        <span className={className}>
            {display.toLocaleString("es-PE", format)}
        </span>
    );
}