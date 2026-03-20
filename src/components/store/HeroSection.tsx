import { useEffect, useRef, useState } from "react";

export const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className={`transition-all duration-700 ${visible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-sm uppercase tracking-[0.3em] text-gold font-medium mb-6">
            Handcrafted with Indian Heritage 
          </p>
        </div>
        
        <h1
          className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight text-balance max-w-4xl mx-auto transition-all duration-700 delay-100 ${visible ? 'animate-reveal-up' : 'opacity-0'}`}
        >
          The Art of
          <br />
          <span className="italic font-normal text-primary">Indian Elegance</span>
        </h1>
        
        <p
          className={`mt-8 text-muted-foreground max-w-lg mx-auto text-pretty text-base md:text-lg leading-relaxed transition-all duration-700 delay-200 ${visible ? 'animate-reveal-up' : 'opacity-0'}`}
        >
          Timeless silhouettes woven from generations of craft. 
          Each piece carries the soul of its artisan.
        </p>

        <div className={`mt-10 transition-all duration-700 delay-300 ${visible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <a
            href="#collection"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-sm text-sm font-medium tracking-wide uppercase hover:bg-maroon-light transition-colors duration-200 active:scale-[0.97]"
          >
            Explore Collection
          </a>
        </div>

        {/* Ornamental divider */}
        <div className={`mt-16 max-w-xs mx-auto ornament-divider transition-all duration-700 delay-[400ms] ${visible ? 'animate-reveal-fade' : 'opacity-0'}`}>
          <span className="text-gold text-lg">✦</span>
        </div>
      </div>
    </section>
  );
};
