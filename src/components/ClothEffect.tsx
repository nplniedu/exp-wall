import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ClothNode {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
}

export default function ClothEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<ClothNode[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, px: -1000, py: -1000, down: false });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLS = 28;
    const ROWS = 18;
    const spacingX = window.innerWidth / (COLS - 1);
    const spacingY = window.innerHeight / (ROWS - 1);

    // 初始化网格节点
    const nodes: ClothNode[] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        nodes.push({
          x: x * spacingX,
          y: y * spacingY,
          ox: x * spacingX,
          oy: y * spacingY,
          vx: 0,
          vy: 0,
        });
      }
    }
    nodesRef.current = nodes;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.px = mouseRef.current.x;
      mouseRef.current.py = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleMouseDown = () => { mouseRef.current.down = true; };
    const handleMouseUp = () => { mouseRef.current.down = false; };
    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.down = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);

    const damping = 0.92;
    const stiffness = 0.08;
    const mouseRadius = 150;
    const mouseForce = mouseRef.current.down ? 2.5 : 1.2;

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // 物理更新
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // 鼠标斥力
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * mouseForce;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
        }
        // 回弹到原位
        n.vx += (n.ox - n.x) * stiffness;
        n.vy += (n.oy - n.y) * stiffness;
        // 阻尼
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
      }

      // 绘制布料网格线（微弱可见）
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let y = 0; y < ROWS; y++) {
        ctx.beginPath();
        for (let x = 0; x < COLS; x++) {
          const n = nodes[y * COLS + x];
          if (x === 0) ctx.moveTo(n.x, n.y);
          else ctx.lineTo(n.x, n.y);
        }
        ctx.stroke();
      }
      for (let x = 0; x < COLS; x++) {
        ctx.beginPath();
        for (let y = 0; y < ROWS; y++) {
          const n = nodes[y * COLS + x];
          if (y === 0) ctx.moveTo(n.x, n.y);
          else ctx.lineTo(n.x, n.y);
        }
        ctx.stroke();
      }

      // 鼠标位置的光晕
      if (mx > 0 && my > 0) {
        const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        gradient.addColorStop(0, 'rgba(150, 180, 255, 0.08)');
        gradient.addColorStop(1, 'rgba(150, 180, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mx, my, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      // 内容容器轻微偏移（模拟布料拉扯DOM）
      if (contentRef.current) {
        // 找到鼠标附近的中心节点偏移
        let totalOffsetX = 0;
        let totalOffsetY = 0;
        let count = 0;
        for (const n of nodes) {
          const dx = n.x - mx;
          const dy = n.y - my;
          if (Math.sqrt(dx * dx + dy * dy) < 200) {
            totalOffsetX += n.x - n.ox;
            totalOffsetY += n.y - n.oy;
            count++;
          }
        }
        if (count > 0) {
          const avgX = totalOffsetX / count * 0.15;
          const avgY = totalOffsetY / count * 0.15;
          gsap.to(contentRef.current, {
            x: avgX,
            y: avgY,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[5] pointer-events-none"
      />
      <div ref={contentRef} className="relative z-10">
        {/* 这个div包裹页面内容，实现整体轻微偏移 */}
      </div>
    </>
  );
}
