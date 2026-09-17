import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24"
    >
      <FadeIn delay={0} y={20}>
        <h2
          className="hero-heading font-black uppercase text-center mb-12 sm:mb-16"
          style={{ fontSize: 'clamp(40px, 8vw, 120px)' }}
        >
          有关大肥鱼
        </h2>
      </FadeIn>

      <div className="max-w-[560px] w-full text-center">
        <AnimatedText
          text="这里放你大肥鱼的表情包呀喂"
          className="text-[#D7E2EA] text-lg sm:text-xl md:text-2xl leading-relaxed mb-12 sm:mb-16"
        />
      </div>

      <FadeIn delay={0.3} y={20}>
        <ContactButton />
      </FadeIn>
    </section>
  );
}
