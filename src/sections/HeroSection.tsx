import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-x-clip flex flex-col">
      {/* 导航栏 */}
      <FadeIn delay={0} y={0}>
        <nav className="flex justify-center gap-8 sm:gap-12 md:gap-16 pt-8 sm:pt-10">
          {['About', 'Projects', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[#D7E2EA] uppercase tracking-wider text-sm sm:text-base
                hover:opacity-70 transition-opacity duration-200 cursor-pointer"
            >
              {item}
            </a>
          ))}
        </nav>
      </FadeIn>

      {/* 大标题 */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1
            className="hero-heading font-black uppercase text-center leading-none"
            style={{
              fontSize: 'clamp(60px, 14vw, 280px)',
            }}
          >
            我的网页
          </h1>
        </FadeIn>
      </div>

      {/* 底部左右布局 */}
      <div className="flex justify-between items-end px-6 sm:px-12 md:px-20 pb-10 sm:pb-14">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wider text-xs sm:text-sm md:text-base">
            Creative Developer
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* 人像装饰 */}
      <FadeIn delay={0.6} y={30}>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-60 pointer-events-none">
          <img
            src="images/marquee/1.png"
            alt="hero"
            className="w-48 h-auto rounded-2xl object-cover"
            style={{ filter: 'grayscale(30%)' }}
          />
        </div>
      </FadeIn>
    </section>
  );
}
