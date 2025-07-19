import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type SkepticismLevel = 0 | 1 | 2 | 3;

export function SkepticismToggle() {
  const [skepticism, setSkepticism] = useState<SkepticismLevel>(0);

  useEffect(() => {
    document.body.classList.remove('skepticism-0', 'skepticism-1', 'skepticism-2', 'skepticism-3');
    document.body.classList.add(`skepticism-${skepticism}`);
  }, [skepticism]);

  const cycleSkepticism = () => {
    setSkepticism(prev => (prev + 1) % 4 as SkepticismLevel);
  };

  return (
    <Button onClick={cycleSkepticism} variant="outline">
      Skepticism: {skepticism}
    </Button>
  );
}
