/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
import { useState } from 'react';
import { motion } from 'motion/react';
import type { SavedPaymentMethod } from '@/core/interfaces/payment-method.interface';
import { SiAmericanexpress, SiVisa } from 'react-icons/si';
import { FaCcMastercard } from "react-icons/fa";

const CardLogo = ({ brand }: { brand: string }) => {
    switch (brand?.toUpperCase()) {
        case 'VISA': return <SiVisa size={40} className="text-white" />;
        case 'MASTER': return <FaCcMastercard size={40} className="text-white" />;
        case 'AMEX': return <SiAmericanexpress size={40} className="text-white" />;
        default: return <div className="h-8 w-12 rounded bg-white/50" />;
    }
};

const getCardGradient = (brand: string) => {
    switch (brand?.toUpperCase()) {
        case 'VISA': return 'from-blue-500 to-indigo-700';
        case 'MASTERCARD': return 'from-orange-500 to-red-600';
        case 'AMEX': return 'from-cyan-500 to-blue-600';
        default: return 'from-gray-600 to-gray-800';
    }
};

export function FlippableCard({ card }: { card: SavedPaymentMethod }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const formattedCardNumber = `•••• •••• •••• ${card.lastFourDigits}`;
    const formattedExpDate = `${String(card.expirationMonth).padStart(2, '0')}/${String(card.expirationYear).slice(-2)}`;
    return (
        <div className="w-full max-w-sm mx-auto cursor-pointer" style={{ perspective: '1000px' }} onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className="relative h-56 w-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* FRENTE */}
                <div className={`absolute w-full h-full rounded-2xl text-white shadow-2xl px-7 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${getCardGradient(card.cardBrand)}`} style={{ backfaceVisibility: 'hidden' }}>
                    <div className="absolute inset-0 bg-[url('/card-pattern.svg')] opacity-10"></div>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between py-3">
                            <div className="h-10 w-10 rounded-md bg-white/20 p-2 backdrop-blur-sm"><div className="h-full w-full rounded bg-white/80"></div></div>
                            <CardLogo brand={card.cardBrand} />
                        </div>
                        <div className="flex items-center gap-2 mt-6 mb-5">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-inner"></div>
                            <div className="flex-1 opacity-90"><div className="h-0.5 bg-white/20 mb-1"></div><div className="h-0.5 bg-white/20"></div></div>
                        </div>
                        <div>
                            <p className="font-mono text-xl tracking-[0.2em] ">{formattedCardNumber}</p>
                            <div className="flex justify-between items-end">
                                <div className="text-right">
                                    <p className="text-[10px] opacity-70 mb-1">VENCE</p>
                                    <p className="font-semibold text-sm tracking-wider">{formattedExpDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`absolute w-full h-full rounded-2xl text-white shadow-2xl overflow-hidden bg-gradient-to-br ${getCardGradient(card.cardBrand)}`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="w-full h-full flex flex-col">
                        <div className="bg-black h-12 mt-6"></div>
                        <div className="px-6 mt-4 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex-1 h-10 bg-white rounded"></div>
                                <div className="bg-white text-black flex items-center justify-center w-16 h-10 font-bold rounded text-sm">•••</div>
                            </div>
                            <p className="text-[10px] opacity-70 text-right">CÓDIGO DE SEGURIDAD</p>
                            <div className="flex justify-end mt-4"><CardLogo brand={card.cardBrand} /></div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
