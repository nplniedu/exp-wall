import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export default function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const characters = text.split('');

  return (
    <div ref={ref} className={className}>
      {characters.map((char, index) => {
        const start = index / characters.length;
        const end = (index + 1) / characters.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
        return (
          <motion.span
            key={index}
            style={{ opacity }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </div>
  );
}
