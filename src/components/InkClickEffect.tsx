import { useEffect, useRef } from 'react';

interface InkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'burst' | 'trail';
}

const neonColors = [
  '#ff00ff', '#00ffff', '#ff6b00', '#00ff88',
  '#ff0066', '#6600ff', '#00ff00', '#ffff00',
  '#ff3366', '#33ccff', '#ff9900', '#cc00ff',
];

function randomNeonColor() {
  return neonColors[Math.floor(Math.random() * neonColors.length)];
}

export default function InkClickEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<InkParticle[]>([]);
  const animRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const lastTrailTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 创建爆炸粒子
    const createBurst = (x: number, y: number) => {
      const baseColor = randomNeonColor();
      const particleCount = 25 + Math.floor(Math.random() * 15);
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3;
        const speed = 1 + Math.random() * 3;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 4,
          maxRadius: 8 + Math.random() * 15,
          color: Math.random() > 0.5 ? baseColor : randomNeonColor(),
          life: 0,
          maxLife: 120 + Math.random() * 60, // ~2秒+
          type: 'burst',
        });
      }
    };

    // 创建拖尾粒子
    const createTrail = (x: number, y: number) => {
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: 3 + Math.random() * 5,
          maxRadius: 10 + Math.random() * 20,
          color: randomNeonColor(),
          life: 0,
          maxLife: 80 + Math.random() * 40,
          type: 'trail',
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      createBurst(e.clientX, e.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      createBurst(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const now = Date.now();
        if (now - lastTrailTimeRef.current > 16) {
          createTrail(e.clientX, e.clientY);
          lastTrailTimeRef.current = now;
        }
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // 物理更新
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.vy += 0.02; // 轻微重力

        // 扩散（0.5秒内扩散到约200px）
        const expandProgress = Math.min(p.life / 30, 1);
        const currentRadius = p.radius + (p.maxRadius - p.radius) * expandProgress;

        // 透明度：前30帧扩散，之后慢慢变淡
        let alpha: number;
        if (p.life < 30) {
          alpha = 0.8;
        } else {
          alpha = 0.8 * (1 - (p.life - 30) / (p.maxLife - 30));
        }
        alpha = Math.max(0, alpha);

        if (p.life >= p.maxLife || alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // 绘制发光墨滴
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
        gradient.addColorStop(0, p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.4, p.color + Math.floor(alpha * 180).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.7, p.color + Math.floor(alpha * 80).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, p.color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // 外发光
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color + Math.floor(alpha * 100).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalCompositeOperation = 'source-over';
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[50] pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
