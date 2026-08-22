import { useEffect, useRef, useState } from "react";

/** Reveals an element on first scroll into view. Pair with the `reveal` utility. */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/** Counts up to `target` once the element scrolls into view. */
export function useCountUp(target: number, duration = 1600) {
  const { ref, visible } = useCountUpRef();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, target, duration]);

  return { ref, value };
}

function useCountUpRef() {
  return useReveal<HTMLDivElement>();
}
