import { Switch } from '@/shared/components/ui/switch';
import { useState, useEffect } from 'react';

interface StatusToggleProps {
  userId: string;
}

export function StatusToggle({ userId }: StatusToggleProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // asume que todos los usuarios están activos
    setIsActive(true);
  }, [userId]);

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
    console.log(`Usuario ${userId} ${checked ? 'activado' : 'desactivado'}`);
  };

  return (
    <Switch checked={isActive} onCheckedChange={handleToggle} />
  );
}