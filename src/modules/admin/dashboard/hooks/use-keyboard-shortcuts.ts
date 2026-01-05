import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      
      if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        event.stopPropagation();
        navigate('/admin/members/nuevo');
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [navigate]);
};
