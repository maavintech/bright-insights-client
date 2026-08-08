import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    image: 'https://picsum.photos/id/1074/1920/1080',
    eyebrow: 'Smart Money',
    title: 'Master Your Money, Brighten Your Future',
    text: 'Budgeting, saving, and investing basics that actually make sense.',
    to: '/category/personal-finance',
    cta: 'Explore Finance',
  },
  {
    image: 'https://picsum.photos/id/1062/1920/1080',
    eyebrow: 'Bright Beginnings',
    title: 'Raise Resilient, Happy Kids',
    text: 'Positive parenting ideas for the everyday chaos of family life.',
    to: '/category/parenting',
    cta: 'Explore Parenting',
  },
  {
    image: 'https://picsum.photos/id/103/1920/1080',
    eyebrow: 'Life Upgraded',
    title: 'Small Changes, Massive Results',
    text: 'Productivity and lifestyle hacks that save you hours every week.',
    to: '/category/lifestyle-hacks',
    cta: 'Explore Lifestyle',
  },
  {
    image: 'https://picsum.photos/id/0/1920/1080',
    eyebrow: 'Demystifying AI',
    title: 'AI, Simplified for Everyday Life',
    text: 'No jargon — just clear, practical guides to using AI tools well.',
    to: '/category/ai-basics',
    cta: 'Explore AI Basics',
  },
];

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[index];

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <span className="inline-block rounded-full bg-brand-yellow px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-ink">
              {slide.eyebrow}
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
              {slide.title}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-xl text-white/90">{slide.text}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={slide.to}
                className="rounded-full bg-brand-blue px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-blue/30 transition-transform hover:scale-105"
              >
                {slide.cta}
              </Link>
              <Link
                to="/blog"
                className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                Browse All Insights
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition-colors hover:bg-white/30 sm:block"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition-colors hover:bg-white/30 sm:block"
      >
        ›
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.image}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-brand-yellow' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
