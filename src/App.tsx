import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Terminal, Smartphone, Activity, Code2, MousePointer2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const NoiseOverlay = () => (
  <svg className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] w-full h-full">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

const MagneticButton = ({ children, className = '', onClick = undefined, href = undefined }: any) => {
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const btn = btnRef.current;
      if (!btn) return;
      
      const onMouseEnter = () => gsap.to(btn, { scale: 1.03, duration: 0.4, ease: 'power3.out' });
      const onMouseLeave = () => gsap.to(btn, { scale: 1, duration: 0.4, ease: 'power3.out' });
      
      btn.addEventListener('mouseenter', onMouseEnter);
      btn.addEventListener('mouseleave', onMouseLeave);
      
      return () => {
        btn.removeEventListener('mouseenter', onMouseEnter);
        btn.removeEventListener('mouseleave', onMouseLeave);
      };
    }, btnRef);
    return () => ctx.revert();
  }, []);

  const Component = href ? 'a' : 'button';
  return (
    <div ref={btnRef} className="inline-block relative">
      {/* @ts-ignore */}
      <Component href={href} onClick={onClick} className={`relative overflow-hidden inline-flex items-center justify-center cursor-pointer transition-colors duration-300 ${className}`}>
        {children}
      </Component>
    </div>
  );
};

// Cluely-inspired MouseGlow Wrapper for cards
const MouseGlowWrapper = ({ children, className = '' }: any) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  return (
    <div
      ref={boxRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 ${className}`}
    >
      <div
        className="absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, rgba(204, 88, 51, 0.08), transparent 60%)`,
        }}
      />
      {/* Subtle border highlight following cursor */}
      <div 
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay rounded-[inherit]"
        style={{
          boxShadow: `inset 0 0 0 1px rgba(204, 88, 51, 0.2)`,
          background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(204, 88, 51, 0.15), transparent 40%)`,
          maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`
        }}
      />
      <div className="relative z-20 h-full w-full">
        {children}
      </div>
    </div>
  );
};

const Navbar = () => {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        onEnter: () => gsap.to(navRef.current, { 
          backgroundColor: 'rgba(242, 240, 233, 0.8)', 
          backdropFilter: 'blur(16px)',
          color: '#1A1A1A', 
          borderColor: 'rgba(46, 64, 54, 0.1)', 
          duration: 0.4 
        }),
        onLeaveBack: () => gsap.to(navRef.current, { 
          backgroundColor: 'transparent', 
          backdropFilter: 'blur(0px)',
          color: '#F2F0E9', 
          borderColor: 'transparent', 
          duration: 0.4 
        })
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header className="fixed top-6 left-0 right-0 z-40 px-6 sm:px-12 flex justify-center pointer-events-none">
      <div ref={navRef} className="pointer-events-auto px-8 py-4 rounded-[2rem] border border-transparent flex items-center justify-between w-full max-w-5xl text-background transition-colors shadow-sm">
        <div className="font-sans font-bold text-xl tracking-tight">Cloude Remote</div>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a href="#features" className="hover:-translate-y-[1px] transition-transform opacity-80 hover:opacity-100">Features</a>
          <a href="#philosophy" className="hover:-translate-y-[1px] transition-transform opacity-80 hover:opacity-100">Philosophy</a>
          <a href="#protocol" className="hover:-translate-y-[1px] transition-transform opacity-80 hover:opacity-100">Protocol</a>
        </nav>
        <MagneticButton className="bg-accent text-background px-5 py-2.5 rounded-[2rem] text-sm font-medium hover:bg-accent/90 shadow-lg shadow-accent/20">
          Request Access
        </MagneticButton>
      </div>
    </header>
  );
};

const Hero = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-elem', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out',
        duration: 1.2,
        delay: 0.2
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative h-[100dvh] w-full flex flex-col justify-end pb-24 px-6 sm:px-12 lg:px-24">
      {/* Background with Dark overlay to primary Moss gradient */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2564&auto=format&fit=crop" 
          alt="Clean Tech Hardware Grid" 
          className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-primary/95 to-primary/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-dark/60"></div>
      </div>

      <div className="relative z-10 max-w-4xl text-background">
        <h1 className="flex flex-col gap-2">
          <span className="hero-elem font-sans font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight text-background/90">
            Your coding environment is the
          </span>
          <span className="hero-elem font-drama italic font-light text-6xl sm:text-8xl md:text-[8rem] leading-[0.9] drop-shadow-sm">
            Sanctuary.
          </span>
        </h1>
        <p className="hero-elem mt-8 text-lg md:text-xl font-sans font-light max-w-2xl text-background/80 leading-relaxed">
          Cloude Remote — a calm, always-on AI coding workspace that runs in the cloud. Check progress, guide tasks, and stay connected without opening your laptop.
        </p>
        <div className="hero-elem mt-12 flex items-center gap-6">
          <MagneticButton className="bg-primary border border-primary-light hover:bg-primary/90 text-background px-8 py-4 rounded-[2rem] text-lg font-medium shadow-2xl flex items-center gap-2">
            Request early access <ArrowRight size={20} />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};

// Feature Card 1: Diagnostic Shuffler
const PersistentWorkspaceCard = () => {
  const [cards, setCards] = useState(['Always Active', 'Stable State', 'Instant Resume']);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const next = [...prev];
        const last = next.pop()!;
        next.unshift(last);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MouseGlowWrapper className="card-surface p-8 h-[400px] flex flex-col text-left">
      <div className="z-10 relative">
        <h3 className="font-sans font-bold text-2xl text-dark mb-2">Persistent cloud workspace</h3>
        <p className="font-sans text-dark/60">Your AI coding environment stays active, stable, and ready at all times.</p>
      </div>
      <div ref={container} className="relative flex-1 mt-8 flex justify-center items-center h-full pointer-events-none">
        {cards.map((label, i) => (
          <div 
            key={label}
            className="absolute p-4 w-full max-w-[240px] rounded-2xl bg-white border border-primary/10 shadow-sm flex items-center gap-3 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              transform: `translateY(${i * 20 - 20}px) scale(${1 - i * 0.05})`,
              opacity: 1 - i * 0.3,
              zIndex: 10 - i,
            }}
          >
            <Activity size={20} className="text-accent" />
            <span className="font-mono text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </MouseGlowWrapper>
  );
};

// Feature Card 2: Telemetry Typewriter
const SeamlessMobileCard = () => {
  const [text, setText] = useState('');
  const fullText = "Connection established.\nInitiating sequence.\nProgress checked without laptop.\nSystem nominal.";
  
  useEffect(() => {
    let i = 0;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#telemetry-card',
        start: 'top 80%',
        onEnter: () => {
          const type = () => {
            if (i <= fullText.length) {
              setText(fullText.slice(0, i));
              i++;
              setTimeout(type, 40 + Math.random() * 60);
            }
          };
          type();
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <MouseGlowWrapper id="telemetry-card" className="card-surface p-8 h-[400px] flex flex-col text-left">
      <div className="z-10 relative">
        <h3 className="font-sans font-bold text-2xl text-dark mb-2">Seamless mobile access</h3>
        <p className="font-sans text-dark/60">Check progress, guide tasks, and stay connected on the go.</p>
      </div>
      <div className="mt-8 flex-1 bg-dark text-background rounded-2xl p-6 font-mono text-sm overflow-hidden flex flex-col relative shadow-inner pointer-events-none">
        <div className="flex items-center gap-2 mb-4 text-xs text-background/60">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(204,88,51,0.8)]"></div>
          Live Feed
        </div>
        <div className="whitespace-pre-wrap leading-relaxed opacity-90">
          {text}<span className="inline-block w-2.5 h-4 ml-1 bg-accent animate-pulse align-middle"></span>
        </div>
      </div>
    </MouseGlowWrapper>
  );
};

// Feature Card 3: Cursor Protocol Scheduler
const EffortlessSetupCard = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.set(cursorRef.current, { x: 50, y: 150, opacity: 0 })
        .to(cursorRef.current, { opacity: 1, duration: 0.3 })
        .to(cursorRef.current, { x: 140, y: 50, duration: 1, ease: 'power2.inOut' })
        .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to(targetRef.current, { backgroundColor: '#CC5833', color: '#F2F0E9', duration: 0.2 }, '-=0.1')
        .to(cursorRef.current, { x: 220, y: 120, duration: 0.8, ease: 'power2.inOut', delay: 0.2 })
        .to(cursorRef.current, { opacity: 0, duration: 0.3 })
        .to(targetRef.current, { backgroundColor: '#e5e7eb', color: '#1A1A1A', duration: 0.2, delay: 0.5 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <MouseGlowWrapper className="card-surface p-8 h-[400px] flex flex-col text-left">
      <div className="z-10 relative">
        <h3 className="font-sans font-bold text-2xl text-dark mb-2">Effortless setup</h3>
        <p className="font-sans text-dark/60">Start coding with AI in seconds, no infrastructure required.</p>
      </div>
      <div className="mt-8 flex-1 relative flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-[280px] bg-white rounded-2xl p-4 shadow-sm border border-primary/5">
          <div className="text-xs uppercase tracking-wider text-dark/40 font-bold mb-3">Configuration</div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-100 rounded w-full"></div>
            <div className="h-2 bg-gray-100 rounded w-4/5"></div>
            <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-3">
              <span className="text-xs font-mono text-dark/60">Status: Ready</span>
              <div ref={targetRef} className="px-3 py-1 bg-gray-200 text-dark rounded-full text-xs font-medium transition-colors">
                Zero Config
              </div>
            </div>
          </div>
        </div>
        <div ref={cursorRef} className="absolute left-0 top-0 z-20" style={{ transform: 'translate(50px, 150px)' }}>
          <MousePointer2 size={24} className="text-dark fill-dark drop-shadow-lg" />
        </div>
      </div>
    </MouseGlowWrapper>
  );
};

const Philosophy = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.phil-line', {
        scrollTrigger: {
          trigger: container.current,
          start: 'top 60%',
        },
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out'
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} id="philosophy" className="py-32 px-6 sm:px-12 lg:px-24 bg-dark text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2564&auto=format&fit=crop" alt="Abstract Data Arch" className="w-full h-full object-cover grayscale mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-transparent to-dark"></div>
      </div>
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <p className="phil-line font-sans text-xl md:text-2xl text-background/60 mb-8 font-light">
          Most environments focus on: setup, friction, and localized constraints.
        </p>
        <h2 className="phil-line font-drama italic text-5xl md:text-7xl lg:text-8xl leading-tight drop-shadow-md">
          We focus on: <br />
          <span className="text-accent not-italic font-sans font-bold tracking-tight">continuous flow.</span>
        </h2>
      </div>
    </section>
  );
};

const Protocol = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card-trigger');
      
      cards.forEach((card: any, i) => {
        if (i === cards.length - 1) return; // Skip last card
        ScrollTrigger.create({
          trigger: card,
          start: 'top 15%',
          endTrigger: '.protocol-wrapper',
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
          animation: gsap.to(card, {
            scale: 0.92,
            opacity: 0.4,
            filter: 'blur(8px)',
            ease: 'none'
          }),
          scrub: true,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const protocols = [
    { num: '01', title: 'Initialize Workspace', desc: 'Secure an isolated agent in the cloud, always ready to accept commands without spinning up local resources.', Icon: Terminal },
    { num: '02', title: 'Orchestrate Tasks', desc: 'Engage with the environment smoothly from your mobile device while commuting or away from the desk.', Icon: Smartphone },
    { num: '03', title: 'Seamless Execution', desc: 'Return to your machine to find processes complete. A mathematically stable continuity of focus.', Icon: Code2 },
  ];

  return (
    <section ref={sectionRef} id="protocol" className="py-32 bg-background protocol-wrapper relative">
      <div className="max-w-4xl mx-auto px-6 sm:px-12">
        <h2 className="font-sans font-bold text-4xl text-dark mb-16 text-center tracking-tight">System Protocol</h2>
        <div className="relative">
          {protocols.map((p) => (
            <div key={p.num} className="protocol-card-trigger w-full h-[60vh] min-h-[400px] mb-8">
              {/* Using MouseGlowWrapper for Stacking Cards */}
              <MouseGlowWrapper className="w-full h-full bg-white border border-primary/10 rounded-[3rem] shadow-xl p-10 flex flex-col md:flex-row items-center justify-between gap-12 text-dark">
                <div className="flex-1 z-10">
                  <div className="font-mono text-accent text-lg mb-6 tracking-widest">[STEP {p.num}]</div>
                  <h3 className="font-sans font-bold text-4xl mb-6">{p.title}</h3>
                  <p className="font-sans text-xl text-dark/70 font-light max-w-md leading-relaxed">{p.desc}</p>
                </div>
                <div className="flex-1 flex justify-center items-center z-10 pointer-events-none">
                  <div className="w-48 h-48 rounded-full border border-primary/20 flex items-center justify-center relative bg-background/30 backdrop-blur-sm">
                    <div className="absolute inset-4 rounded-full border border-accent/30 animate-[spin_12s_linear_infinite]"></div>
                    <div className="absolute inset-8 rounded-full border border-primary/10 animate-[spin_18s_linear_infinite_reverse]"></div>
                    <p.Icon size={48} strokeWidth={1} className="text-primary relative z-10" />
                  </div>
                </div>
              </MouseGlowWrapper>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-background px-6 py-24 sm:px-12 lg:px-24 rounded-t-[4rem]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-sans font-bold text-3xl mb-4 text-background">Cloude Remote</h2>
          <p className="font-sans text-background/60 max-w-sm font-light">
            A calm, always-on AI coding workspace that runs in the cloud. Establish your sanctuary.
          </p>
          <div className="mt-12 flex items-center gap-3 font-mono text-sm text-background/80 bg-dark/20 inline-flex px-4 py-2 rounded-full border border-background/5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
            System Operational
          </div>
        </div>
        <div className="flex flex-col md:items-end justify-center">
          <h3 className="font-sans text-2xl mb-8">Ready to initiate?</h3>
          <MagneticButton className="bg-accent hover:bg-background hover:text-dark text-background px-10 py-5 rounded-[3rem] text-xl font-medium shadow-lg transition-colors border border-transparent">
            Request early access
          </MagneticButton>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-24 pt-8 border-t border-background/10 flex justify-between font-mono text-xs text-background/40">
        <p>© {new Date().getFullYear()} Cloude Remote</p>
        <p>Protocol Active</p>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="min-h-screen relative w-full selection:bg-accent/20 selection:text-accent">
      <NoiseOverlay />
      <Navbar />
      <main>
        <Hero />
        <section id="features" className="py-32 px-6 sm:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <PersistentWorkspaceCard />
            <SeamlessMobileCard />
            <EffortlessSetupCard />
          </div>
        </section>
        <Philosophy />
        <Protocol />
      </main>
      <Footer />
    </div>
  );
};

export default App;
