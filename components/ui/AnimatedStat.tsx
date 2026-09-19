"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface AnimatedStatProps {
  value: string | number;
  suffix?: string;
  className?: string;
}

export function AnimatedStat({ value, suffix = "", className = "" }: AnimatedStatProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated || !elementRef.current) return;

    const el = elementRef.current;
    
    // Set up intersection observer to trigger on scroll
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        setHasAnimated(true);
        startAnimation(el);
      }
    }, { threshold: 0.1 });

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasAnimated, value, suffix]);

  const startAnimation = (el: HTMLElement) => {
    let targetNum = 0;
    let combinedSuffix = suffix;
    
    if (typeof value === 'number') {
      targetNum = value;
    } else {
      const match = String(value).match(/^([\d.]+)(.*)$/);
      if (match) {
        targetNum = parseFloat(match[1]);
        combinedSuffix = match[2] + suffix;
      } else {
        targetNum = 0;
        combinedSuffix = String(value) + suffix;
      }
    }

    const digits = String(targetNum).replace('.', '').length || 1;
    
    el.textContent = '0'.repeat(digits) + combinedSuffix;
    el.style.opacity = '0.4';

    let scrambleTicks = 0;
    const scrambleMax = 7;
    
    const scrambleInt = setInterval(() => {
      scrambleTicks++;
      const rnd = Array.from({ length: digits }).map(() => Math.floor(Math.random() * 10)).join('');
      el.textContent = rnd + combinedSuffix;
      
      if (scrambleTicks >= scrambleMax) {
        clearInterval(scrambleInt);
        el.style.opacity = '1';
        
        let obj = { v: 0 };
        gsap.to(obj, {
          v: targetNum,
          duration: 0.9,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.floor(obj.v) + combinedSuffix;
          }
        });
      }
    }, 45);
  };

  return (
    <span ref={elementRef} className={className}>
      {typeof value === 'number' ? '0'.repeat(String(value).length) : '0'}
      {suffix}
    </span>
  );
}
