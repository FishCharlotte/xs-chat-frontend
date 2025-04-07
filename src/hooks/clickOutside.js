import { useEffect } from 'react';

export const useClickOutside = (ref, callback) => {

    useEffect(() => {
        console.log('click')
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                callback();
            }
        };

        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true)
        };
    }, []);
};
