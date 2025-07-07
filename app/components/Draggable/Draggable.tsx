"use client";

import { useRef, ReactNode, useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

type DraggableProps = {
  children: ReactNode;
  handleSelector: string;
};

export default function Draggable({ children, handleSelector }: DraggableProps) {
  const [_, setReady] = useState(false);
  const domTarget = useRef<HTMLDivElement>(null);

  const getRandomPosition = (delay: number): {x: number, y: number, scale: number, delay: number} => {
    const el = domTarget.current;
    if (!el) {
      return { x: 0, y: 0, scale: 0, delay: 0 }
    };

    const width = el.offsetWidth;
    const height = el.offsetHeight;

    const maxX = window.innerWidth - width;
    const maxY = window.innerHeight - height;

    const randX = Math.floor(Math.random() * maxX);
    const randY = Math.floor(Math.random() * maxY);
    return { x: randX, y: randY, scale: 1, delay};
  }

  const [{ x, y, scale }, api] = useSpring(() => {
    return getRandomPosition(150);
  }, [domTarget.current]);


  useEffect(() => {
    const centerAndReset = () => {
      const el = domTarget.current;
      if (!el) return;
      const width = el.offsetWidth;
      const height = el.offsetHeight;
  
      const centerX = (window.innerWidth - width) / 2;
      const centerY = (window.innerHeight - height) / 2;

      api.start({ x: centerX, y: centerY, config: config.gentle });
    };
  
    const randomStart = () => {
      const randomPosition = getRandomPosition(0);
  
      Promise.all(api.start({ ...randomPosition, config: config.gentle })).then(() => {
        setReady(true);
      });
    };

    randomStart();
    window.addEventListener("resize", centerAndReset);
  
    return () => window.removeEventListener("resize", centerAndReset);
  }, []);  

  const bind = useDrag(
    ({ down, offset: [dx, dy], velocity: [vx, vy], direction: [dxn, dyn], target, last }) => {
      if (!(target as HTMLElement).closest(handleSelector)) return;

      const el = domTarget.current;
      if (!el) return;

      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const maxX = window.innerWidth - width;
      const maxY = window.innerHeight - height;

      const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

      if (down) {
        api.start({ x: clamp(dx, 0, maxX), y: clamp(dy, 0, maxY), immediate: true });
      } else if (last) {
        // On release, calculate momentum
        const momentumX = dx + vx * dxn * 50;
        const momentumY = dy + vy * dyn * 50;

        api.start({
          x: clamp(momentumX, 0, maxX),
          y: clamp(momentumY, 0, maxY),
          config: config.gentle
        });
      }
    },
    {
      from: () => [x.get(), y.get()],
      bounds: () => {
        const el = domTarget.current;
        if (!el) return { left: 0, top: 0, right: 0, bottom: 0 };
        return {
          left: 0,
          top: 0,
          right: window.innerWidth - el.offsetWidth,
          bottom: window.innerHeight - el.offsetHeight,
        };
      },
      rubberband: false,
    }
  );

  return (
    <animated.div
      ref={domTarget}
      {...bind()}
      style={{x, y, scale, touchAction: "none" }}
      className="fixed z-50"
    >
      {children}
    </animated.div>
  );
}
