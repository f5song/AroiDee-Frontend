import { useEffect, useRef } from 'react';

/**
 * Custom hook to detect clicks outside of a component
 * @param callback Function to run when click is detected outside the component
 */

const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);
  
  return ref;
};

export default useOutsideClick;