import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  imageSrc?: string;
}

export default function ImageModal({ isOpen, onClose, title, content, imageSrc }: ImageModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* 背景遮罩 */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* 弹窗内容 */}
          <motion.div
            className="relative bg-[#1a1a1a] rounded-3xl border border-[#333] max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#333] hover:bg-[#444] transition-colors"
            >
              <X size={20} className="text-white" />
            </button>

            {/* 图片 */}
            {imageSrc && (
              <div className="w-full h-48 sm:h-64 overflow-hidden flex-shrink-0">
                <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* 文字内容 */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#D7E2EA] mb-4">{title}</h3>
              <div className="text-[#aaa] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {content}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
