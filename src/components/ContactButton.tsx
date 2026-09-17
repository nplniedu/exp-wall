import { motion } from 'framer-motion';

interface ContactButtonProps {
  className?: string;
}

export default function ContactButton({ className = '' }: ContactButtonProps) {
  return (
    <motion.button
      className={`relative uppercase text-white font-semibold tracking-wider cursor-pointer ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        borderRadius: '9999px',
        padding: 'clamp(10px, 1.5vw, 16px) clamp(24px, 3vw, 40px)',
        fontSize: 'clamp(12px, 1.2vw, 16px)',
        boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.2), inset 0 -2px 8px rgba(0,0,0,0.3)',
        outline: '2px solid white',
        outlineOffset: '-3px',
        border: 'none',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      Tell Me
    </motion.button>
  );
}
