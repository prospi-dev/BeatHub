import { useState, useEffect } from 'react';

const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            const t = requestAnimationFrame(() => setIsVisible(true));
            return () => cancelAnimationFrame(t);
        } else {
            setIsVisible(false);
            const t = setTimeout(() => setIsMounted(false), 250);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    return { isMounted, isVisible, open: () => setIsOpen(true), close: () => setIsOpen(false) };
};

export default useModal;