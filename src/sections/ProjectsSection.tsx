import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { storyChapters, type StoryChapter } from '../data/storyData';

interface ProjectCard {
  index: number;
  title: string;
  chapter1: StoryChapter;
  chapter2: StoryChapter;
  chapter3: StoryChapter;
}

const projects: ProjectCard[] = [
  {
    index: 0,
    title: '深海起源',
    chapter1: storyChapters[0],
    chapter2: storyChapters[1],
    chapter3: storyChapters[2],
  },
  {
    index: 1,
    title: '岸上冒险',
    chapter1: storyChapters[3],
    chapter2: storyChapters[4],
    chapter3: storyChapters[5],
  },
  {
    index: 2,
    title: '成长之路',
    chapter1: storyChapters[6],
    chapter2: storyChapters[7],
    chapter3: storyChapters[0],
  },
  {
    index: 3,
    title: '英雄之家',
    chapter1: storyChapters[1],
    chapter2: storyChapters[3],
    chapter3: storyChapters[7],
  },
];

interface CardProps {
  project: ProjectCard;
  totalCards: number;
  onImageClick: (chapter: StoryChapter) => void;
}

function Card({ project, totalCards, onImageClick }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (totalCards - 1 - project.index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <motion.div
      ref={ref}
      className="sticky w-full max-w-5xl mx-auto rounded-3xl border-2 border-[#D7E2EA] bg-[#0C0C0C] p-6 sm:p-8 md:p-10"
      style={{
        scale,
        top: `calc(96px + ${project.index * 28}px)`,
        zIndex: project.index + 1,
      }}
    >
      {/* 顶部行：大序号 + 项目名 */}
      <div className="flex items-baseline gap-4 sm:gap-6 mb-6 sm:mb-8">
        <span
          className="hero-heading font-black leading-none"
          style={{ fontSize: 'clamp(48px, 8vw, 100px)' }}
        >
          0{project.index + 1}
        </span>
        <h3
          className="text-[#D7E2EA] font-bold uppercase tracking-wider"
          style={{ fontSize: 'clamp(20px, 3vw, 36px)' }}
        >
          {project.title}
        </h3>
      </div>

      {/* 底部双栏图片网格 */}
      <div className="flex gap-3 sm:gap-4">
        {/* 左40% - 2张堆叠图 */}
        <div className="w-[40%] flex flex-col gap-3 sm:gap-4">
          <div
            className="rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer group"
            onClick={() => onImageClick(project.chapter1)}
          >
            <img
              src={project.chapter1.image}
              alt={project.chapter1.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div
            className="rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer group"
            onClick={() => onImageClick(project.chapter2)}
          >
            <img
              src={project.chapter2.image}
              alt={project.chapter2.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>

        {/* 右60% - 1张高图 */}
        <div
          className="w-[60%] rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => onImageClick(project.chapter3)}
        >
          <img
            src={project.chapter3.image}
            alt={project.chapter3.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ minHeight: '300px' }}
            loading="lazy"
          />
        </div>
      </div>
    </motion.div>
  );
}

interface ProjectsSectionProps {
  onImageClick: (chapter: StoryChapter) => void;
}

export default function ProjectsSection({ onImageClick }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="relative bg-[#0C0C0C] pt-16 sm:pt-20 -mt-16 sm:-mt-20 z-10"
      style={{
        borderTopLeftRadius: 'clamp(32px, 5vw, 80px)',
        borderTopRightRadius: 'clamp(32px, 5vw, 80px)',
      }}
    >
      <div className="text-center mb-12 sm:mb-16 px-6">
        <h2
          className="hero-heading font-black uppercase"
          style={{ fontSize: 'clamp(48px, 10vw, 160px)' }}
        >
          Project
        </h2>
      </div>

      <div className="h-[85vh]">
        {projects.map((project) => (
          <Card
            key={project.index}
            project={project}
            totalCards={projects.length}
            onImageClick={onImageClick}
          />
        ))}
      </div>

      <div className="h-32" />
    </section>
  );
}
