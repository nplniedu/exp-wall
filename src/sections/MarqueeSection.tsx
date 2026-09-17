import { useEffect, useRef, useState } from 'react';
import { marqueeImages, type StoryChapter } from '../data/storyData';

interface MarqueeSectionProps {
  onImageClick: (chapter: StoryChapter) => void;
}

export default function MarqueeSection({ onImageClick }: MarqueeSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  // 第1行前11个，第2行后10个
  const row1Images = marqueeImages.slice(0, 11);
  const row2Images = marqueeImages.slice(11, 21);

  // 三倍复制实现无缝循环
  const row1Tripled = [...row1Images, ...row1Images, ...row1Images];
  const row2Tripled = [...row2Images, ...row2Images, ...row2Images];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.offsetTop;
      const calculated = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(calculated);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0C0C0C] py-16 sm:py-20 overflow-hidden"
    >
      {/* 第一行 - 向右滚动 */}
      <div
        className="flex gap-3 mb-3"
        style={{
          transform: `translateX(${offset - 200}px)`,
          willChange: 'transform',
        }}
      >
        {row1Tripled.map((chapter, i) => (
          <div
            key={`row1-${i}`}
            className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group relative"
            style={{ width: '420px', height: '270px' }}
            onClick={() => onImageClick(chapter)}
          >
            <img
              src={chapter.image}
              alt={chapter.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white text-sm font-medium">{chapter.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 第二行 - 向左滚动 */}
      <div
        className="flex gap-3"
        style={{
          transform: `translateX(${-(offset - 200)}px)`,
          willChange: 'transform',
        }}
      >
        {row2Tripled.map((chapter, i) => (
          <div
            key={`row2-${i}`}
            className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group relative"
            style={{ width: '420px', height: '270px' }}
            onClick={() => onImageClick(chapter)}
          >
            <img
              src={chapter.image}
              alt={chapter.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white text-sm font-medium">{chapter.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
