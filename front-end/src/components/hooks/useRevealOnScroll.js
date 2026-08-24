// useRevealOnScroll.js
// Détecte l'entrée d'une section dans le viewport une seule fois,
// puis expose un tableau `revealed` avec un décalage (stagger) manuel
// via setTimeout — approche stable, sans dépendre de whileInView.
import { useEffect, useRef, useState } from 'react';

export default function useRevealOnScroll(itemCount = 1, { threshold = 0.2, rootMargin = '0px 0px -10% 0px', stagger = 120 } = {}) {
  const ref = useRef(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [revealed, setRevealed] = useState(() => new Array(itemCount).fill(false));

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (!sectionVisible) return undefined;

    const timers = [];
    for (let i = 0; i < itemCount; i += 1) {
      timers.push(
        setTimeout(() => {
          setRevealed((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * stagger)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [sectionVisible, itemCount, stagger]);

  return { ref, sectionVisible, revealed };
}