"use client";

import { useRef, ReactNode, useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

type DraggableProps = {
  children: ReactNode;
  handleSelector: string;
};

export default function Draggable({ children, handleSelector }: DraggableProps) {
  const [ready, setReady] = useState(false);
  const domTarget = useRef<HTMLDivElement>(null);

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

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
  
    // const randomStart = () => {
    //   const el = domTarget.current;
    //   if (!el) return;
  
    //   const width = el.offsetWidth;
    //   const height = el.offsetHeight;
  
    //   const maxX = window.innerWidth - width;
    //   const maxY = window.innerHeight - height;
  
    //   const randX = Math.floor(Math.random() * maxX);
    //   const randY = Math.floor(Math.random() * maxY);
  
    //   api.start({ x: randX, y: randY, config: config.gentle });
    //   setReady(true);
    // };

    centerAndReset();
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

      // Clamp helper
      const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

      if (down) {
        // While dragging, follow finger/mouse
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
      rubberband: false, // set to true if you want stretchy edges
    }
  );

  return (
    <animated.div
      ref={domTarget}
      {...bind()}
      style={{ x, y, touchAction: "none" }}
      className="fixed z-50"
      // className={`fixed z-50 transition-opacity duration-300 ${
      //   ready ? "opacity-100" : "opacity-0 pointer-events-none"
      // }`}
    >
      {children}
    </animated.div>
  );
}
