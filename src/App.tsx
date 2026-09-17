import { useState, useCallback } from 'react';
import StarfieldBackground from './components/StarfieldBackground';
import ClothEffect from './components/ClothEffect';
import InkClickEffect from './components/InkClickEffect';
import ImageModal from './components/ImageModal';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import type { StoryChapter } from './data/storyData';
import './index.css';

interface ModalData {
  isOpen: boolean;
  title: string;
  content: string;
  imageSrc?: string;
}

function App() {
  const [modal, setModal] = useState<ModalData>({
    isOpen: false,
    title: '',
    content: '',
    imageSrc: undefined,
  });

  const handleImageClick = useCallback(async (chapter: StoryChapter) => {
    try {
      const response = await fetch(chapter.contentFile);
      const text = await response.text();
      // 去掉md文件中的第一行标题（因为弹窗已经有标题了）
      const contentWithoutTitle = text.replace(/^#.*\n/, '').trim();
      setModal({
        isOpen: true,
        title: chapter.title,
        content: contentWithoutTitle,
        imageSrc: chapter.image,
      });
    } catch {
      setModal({
        isOpen: true,
        title: chapter.title,
        content: '内容加载失败，请稍后再试。',
        imageSrc: chapter.image,
      });
    }
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0C0C0C] overflow-x-clip">
      {/* Three.js 3D星空背景 */}
      <StarfieldBackground />

      {/* 布料物理效果层 */}
      <ClothEffect />

      {/* 点击墨水特效层 */}
      <InkClickEffect />

      {/* 页面内容 */}
      <div className="relative z-10">
        <HeroSection />
        <MarqueeSection onImageClick={handleImageClick} />
        <AboutSection />
        <ProjectsSection onImageClick={handleImageClick} />

        {/* Footer */}
        <footer className="relative bg-[#0C0C0C] py-12 text-center border-t border-[#222]">
          <p className="text-[#666] text-sm uppercase tracking-wider">
            © 2026 My-Program · 大肥鱼的英雄网站
          </p>
        </footer>
      </div>

      {/* 图片弹窗 */}
      <ImageModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        content={modal.content}
        imageSrc={modal.imageSrc}
      />
    </div>
  );
}

export default App;
