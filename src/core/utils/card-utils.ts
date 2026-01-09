import type { CardType } from '@/core/store/payment.store';

/**
 * Detecta el tipo de tarjeta basado en los primeros dígitos
 */
export const detectCardType = (number: string): CardType => {
    const cleaned = number.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    
    return 'unknown';
};

export const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
};


export const formatExpDate = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};


export const formatCcv = (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 3);
};

export const formatDni = (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 8);
};


export const getCardGradient = (cardType: CardType): string => {
    switch (cardType) {
        case 'visa':
            return 'from-blue-700 via-blue-800 to-blue-900';
        case 'mastercard':
            return 'from-slate-800 via-slate-900 to-black';
        case 'amex':
            return 'from-blue-600 via-blue-700 to-blue-800';
        case 'discover':
            return 'from-orange-600 via-orange-700 to-orange-800';
        default:
            return 'from-slate-700 via-slate-800 to-slate-900';
    }
};


export const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (!/^\d{13,19}$/.test(cleaned)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
};


export const validateExpDate = (expDate: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expDate)) return false;
    
    const [month, year] = expDate.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
};