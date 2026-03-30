import { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, ArrowRight, MousePointer2, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Custom Easing
const springBounce = "cubic-bezier(0.34, 1.56, 0.64, 1)";

const Navbar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top -100",
        end: 99999,
        toggleClass: {
          className: "scrolled-nav",
          targets: navRef.current
        }
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav 
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-full flex items-center gap-12 transition-all duration-300 [&.scrolled-nav]:bg-background/80 [&.scrolled-nav]:backdrop-blur-xl [&.scrolled-nav]:border [&.scrolled-nav]:border-dark/10 [&.scrolled-nav]:shadow-lg text-white [&.scrolled-nav]:text-dark"
    >
      <div className="font-heading font-bold text-lg tracking-tight hover-lift cursor-pointer">
        Cloude Remote
      </div>
      <div className="hidden md:flex items-center gap-8 font-heading text-sm font-medium">
        <a href="#features" className="hover:text-accent transition-colors hover-lift">Features</a>
        <a href="#philosophy" className="hover:text-accent transition-colors hover-lift">Philosophy</a>
        <a href="#protocol" className="hover:text-accent transition-colors hover-lift">Protocol</a>
      </div>
      <button className="magnetic-btn bg-accent text-white px-5 py-2 text-sm font-bold rounded-full hover:bg-red-600 transition-colors">
        Join waitlist
      </button>
    </nav>
  );
};

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
      });
      gsap.from(".hero-btn", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.8
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[100dvh] w-full overflow-hidden bg-dark">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2670&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
      
      <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 md:px-16 max-w-7xl mx-auto text-white">
        <div className="max-w-4xl">
          <h1 className="flex flex-col gap-2 mb-8">
            <span className="hero-text font-heading font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-paper">
              Your AI engineer.
            </span>
            <span className="hero-text font-drama italic text-7xl md:text-8xl lg:text-9xl text-accent pb-4">
              Always running.
            </span>
          </h1>
          <p className="hero-text font-heading text-xl md:text-2xl text-paper/90 mb-2 font-medium max-w-2xl leading-relaxed">
            Run Claude Code in the cloud and control it from anywhere.
          </p>
          <p className="hero-text font-data text-sm md:text-base text-paper/60 mb-10 max-w-2xl border-l-2 border-accent pl-4">
            No laptop. No setup. Just ship.
          </p>
          
          <div className="hero-btn flex flex-col sm:flex-row gap-4">
            <button className="magnetic-btn bg-accent text-white px-8 py-4 rounded-full font-heading font-bold text-lg flex items-center justify-center gap-2 hover:bg-red-600">
              <Terminal size={20} /> Join the waitlist
            </button>
            <button className="magnetic-btn bg-transparent border border-paper/30 text-paper px-8 py-4 rounded-full font-heading font-bold text-lg flex items-center justify-center gap-2 hover:bg-paper/10">
              Get early access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Feature 1: Shuffler
const ShufflerCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.shuffler-item');
      let currentIndex = 0;
      
      const cycle = () => {
        gsap.to(cards, {
          y: (i) => {
            const pos = (i - currentIndex + cards.length) % cards.length;
            return pos * 12;
          },
          scale: (i) => {
            const pos = (i - currentIndex + cards.length) % cards.length;
            return 1 - pos * 0.05;
          },
          opacity: (i) => {
            const pos = (i - currentIndex + cards.length) % cards.length;
            return 1 - pos * 0.3;
          },
          zIndex: (i) => {
            const pos = (i - currentIndex + cards.length) % cards.length;
            return cards.length - pos;
          },
          duration: 0.8,
          ease: springBounce
        });
        currentIndex = (currentIndex + 1) % cards.length;
      };
      
      cycle();
      const interval = setInterval(cycle, 2500);
      return () => clearInterval(interval);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-primary/50 border border-dark/10 rounded-[2rem] p-8 h-full shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
      <div className="mb-12 relative z-10">
        <h3 className="font-heading font-bold text-2xl mb-3">Always-on AI agents</h3>
        <p className="font-sans text-dark/70">Run Claude Code on a persistent cloud machine. No laptop required.</p>
      </div>
      
      <div ref={containerRef} className="relative h-40 w-full mt-auto">
        {['Persistent Runtime', 'Isolated Execution', 'State Recovery'].map((label, i) => (
          <div key={i} className="shuffler-item absolute top-0 left-0 w-full bg-background border border-dark/10 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <span className="font-data text-xs text-dark/50">SYS_{i+1}</span>
            <span className="font-heading font-semibold text-sm">{label}</span>
            <Activity size={16} className="text-accent" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Feature 2: Typewriter
const TypewriterCard = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const messages = [
      "Connecting to agent session...",
      "Status: Running remotely",
      "Receiving inputs via mobile link...",
      "Task executing. Monitor mode active.",
    ];
    let msgIndex = 0;
    
    // Cursor blink
    gsap.to(cursorRef.current, { opacity: 0, duration: 0.4, repeat: -1, yoyo: true });
    
    // Typewriter
    let timeout: ReturnType<typeof setTimeout>;
    const type = () => {
      const targetText = messages[msgIndex];
      let charIndex = 0;
      if (textRef.current) textRef.current.textContent = '';
      
      const nextChar = () => {
        if (charIndex < targetText.length) {
          if (textRef.current) textRef.current.textContent += targetText[charIndex];
          charIndex++;
          timeout = setTimeout(nextChar, 50 + Math.random() * 50);
        } else {
          timeout = setTimeout(() => {
            msgIndex = (msgIndex + 1) % messages.length;
            type();
          }, 2000);
        }
      };
      nextChar();
    };
    
    type();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-dark rounded-[2rem] p-8 h-full shadow-sm relative overflow-hidden flex flex-col justify-between text-paper group">
      <div className="absolute top-6 right-8 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="font-data text-xs text-paper/50">LIVE FEED</span>
      </div>
      
      <div className="mb-12 relative z-10">
        <h3 className="font-heading font-bold text-2xl mb-3 text-white">Control from anywhere</h3>
        <p className="font-sans text-paper/70">Start, monitor, and interact with your coding agent directly from your phone.</p>
      </div>
      
      <div className="font-data text-xs md:text-sm text-accent bg-black/50 p-6 rounded-[1.5rem] border border-paper/10 min-h-[5rem] flex items-center">
        <span>&gt; </span>
        <span ref={textRef}></span>
        <span ref={cursorRef} className="inline-block w-2 h-4 bg-accent ml-1 align-middle"></span>
      </div>
    </div>
  );
};

// Feature 3: Scheduler
const SchedulerCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      
      tl.set('.cursor-svg', { x: 0, y: 150, opacity: 0 })
        .to('.cursor-svg', { opacity: 1, duration: 0.3 })
        .to('.cursor-svg', { x: 120, y: 30, duration: 1, ease: 'power2.inOut' })
        .to('.cursor-svg', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to('.grid-cell-target', { backgroundColor: '#E63B2E', color: '#fff', duration: 0.2 }, '-=0.1')
        .to('.cursor-svg', { x: 200, y: 100, duration: 0.8, ease: 'power2.inOut', delay: 0.3 })
        .to('.cursor-svg', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to('.btn-save', { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }, '-=0.1')
        .to('.cursor-svg', { opacity: 0, duration: 0.3, delay: 0.3 })
        .to('.grid-cell-target', { backgroundColor: 'transparent', color: '', duration: 0.5 });
        
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-primary/50 border border-dark/10 rounded-[2rem] p-8 h-full shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between" ref={containerRef}>
      <div className="mb-12 relative z-10">
        <h3 className="font-heading font-bold text-2xl mb-3">Async workflows</h3>
        <p className="font-sans text-dark/70">Launch tasks, close the app, come back to completed work later.</p>
      </div>
      
      <div className="relative border border-dark/10 bg-background rounded-[1.5rem] p-4 font-data text-xs mt-auto">
        <div className="grid grid-cols-7 gap-1 mb-4 text-center text-dark/40 font-bold">
          {days.map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({length: 14}).map((_, i) => (
            <div key={i} className={`aspect-square flex items-center justify-center rounded-md border border-dark/5 ${i === 9 ? 'grid-cell-target' : ''}`}>
              {i + 1}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-dark/40 uppercase">Task: Refactor</span>
          <div className="btn-save bg-dark text-paper px-3 py-1 rounded-full text-[10px] tracking-wide font-bold">Deploy</div>
        </div>
        
        <MousePointer2 className="cursor-svg absolute top-0 left-0 w-6 h-6 text-dark fill-dark filter drop-shadow-md z-20" />
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-24 px-4 bg-background z-20 relative rounded-t-[3rem] -mt-10 border-t border-dark/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[26rem]">
          <div className="feature-card"><ShufflerCard /></div>
          <div className="feature-card"><TypewriterCard /></div>
          <div className="feature-card"><SchedulerCard /></div>
        </div>
      </div>
    </section>
  );
};

const PhilosophySection = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".phil-text-1", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        opacity: 0, y: 20, duration: 1
      });
      gsap.from(".phil-text-2", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
        opacity: 0, y: 40, duration: 1.2, delay: 0.2
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="philosophy" ref={sectionRef} className="relative py-40 px-6 bg-dark flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 filter grayscale mix-blend-overlay"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555580399-56c221191fd4?q=80&w=2600&auto=format&fit=crop')" }} 
      />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
        <p className="phil-text-1 font-heading text-xl md:text-2xl text-paper/60 uppercase tracking-widest font-light">
          Most dev tools focus on: <br className="md:hidden" /><span className="text-paper/90 font-medium">adding more interfaces to your laptop.</span>
        </p>
        <p className="phil-text-2 font-heading font-bold text-4xl md:text-6xl text-white leading-tight">
          We focus on: giving your code a <span className="font-drama italic text-accent font-normal mr-2">permanent location</span>.
        </p>
      </div>
    </section>
  );
};

const ProtocolSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.protocol-card');
      
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Don't shrink the last card
        
        ScrollTrigger.create({
          trigger: card,
          start: "top top+=100", // Start when it hits the pinning area
          endTrigger: cards[i + 1],
          end: "top top+=100", // End when next card arrives
          scrub: true,
          animation: gsap.to(card, {
            scale: 0.9,
            opacity: 0.4,
            filter: 'blur(10px)',
            transformOrigin: "top center",
            ease: "none"
          })
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const protocols = [
    {
      step: "0.1",
      title: "Instantiate",
      desc: "Spawn an autonomous agent in a containerized sandbox on a persistent server.",
      anim: <div className="w-24 h-24 border-2 border-accent/40 rotate-[45deg] animate-[spin_8s_linear_infinite] flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-accent rotate-[45deg] animate-[spin_6s_linear_infinite_reverse]" />
            </div>
    },
    {
      step: "0.2",
      title: "Handoff",
      desc: "Transfer context seamlessly from your initial mobile prompt to the cloud runtime.",
      anim: <div className="w-full max-w-[200px] h-20 bg-dark/5 rounded overflow-hidden relative border border-dark/10">
              <div className="absolute top-0 bottom-0 w-2 bg-accent shadow-[0_0_15px_rgba(230,59,46,0.8)] animate-[ping_2s_linear_infinite]" style={{ animation: "scan 2s linear infinite" }} />
              <style>{`@keyframes scan { 0% { left: 0%; } 50% { left: 100%; } 100% { left: 0%; } }`}</style>
            </div>
    },
    {
      step: "0.3",
      title: "Execute",
      desc: "The agent iterates autonomously. Check terminal logs and approve pull requests anytime.",
      anim: <div className="flex items-center gap-1 h-20">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-2 bg-accent/80 rounded-full animate-pulse" 
                     style={{ height: `${Math.max(20, Math.random() * 80)}%`, animationDuration: `${0.5 + Math.random()}s` }} />
              ))}
            </div>
    }
  ];

  return (
    <section id="protocol" ref={sectionRef} className="bg-primary/20 py-24 px-4 relative">
      <div className="max-w-4xl mx-auto space-y-32">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-dark mb-4">The Logic Sequence</h2>
          <p className="font-data text-dark/60 text-sm">SYSTEM OPS / ARCHITECTURE PROTOCOL</p>
        </div>
        
        {protocols.map((p, i) => (
          <div key={i} className="protocol-card min-h-[50vh] sticky top-[100px] bg-background border border-dark/10 rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)]">
            <div className="flex-1 space-y-6 w-full">
              <span className="font-data text-accent font-bold text-xl">{p.step} _</span>
              <h3 className="font-heading font-bold text-4xl md:text-5xl tracking-tight text-dark">{p.title}</h3>
              <p className="font-sans text-lg text-dark/70 max-w-sm leading-relaxed">{p.desc}</p>
            </div>
            <div className="w-full md:w-1/2 h-64 bg-primary/30 rounded-[1.5rem] border border-dark/5 flex items-center justify-center overflow-hidden">
              {p.anim}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const GetStartedSection = () => {
  return (
    <section className="py-32 px-4 bg-background relative z-10">
      <div className="max-w-4xl mx-auto bg-dark rounded-[3rem] p-12 md:p-24 text-center border-t-[8px] border-accent shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-paper mb-6">Ready to abandon your localhost?</h2>
          <p className="font-sans text-paper/70 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Claim your persistent container. Join the waitlist to get early access to Cloude Remote.
          </p>
          <button className="magnetic-btn bg-accent text-white px-10 py-5 rounded-full font-heading font-bold text-xl inline-flex items-center justify-center gap-3 hover:bg-red-600 w-full sm:w-auto">
            Get early access <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-dark text-paper rounded-t-[4rem] px-8 pt-20 pb-12 relative -mt-8 z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 relative z-10">
        <div className="md:col-span-2">
          <h2 className="font-heading font-bold text-3xl mb-4 text-white">Cloude Remote</h2>
          <p className="font-sans text-paper/60 max-w-sm">No laptop. No setup. Just ship. Run, control, and ship code from anywhere.</p>
        </div>
        
        <div>
          <h4 className="font-data text-xs text-paper/40 mb-6 font-bold tracking-widest">PRODUCT</h4>
          <ul className="space-y-4 font-sans text-sm text-paper/80">
            <li><a href="#" className="hover:text-accent transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-data text-xs text-paper/40 mb-6 font-bold tracking-widest">LEGAL</h4>
          <ul className="space-y-4 font-sans text-sm text-paper/80">
            <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-paper/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <p className="font-data text-xs text-paper/40">© {new Date().getFullYear()} Cloude Remote Inc.</p>
        
        <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-paper/5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-data text-xs text-paper/60 tracking-widest">SYSTEM OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="relative bg-background min-h-screen text-dark selection:bg-accent selection:text-white">
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <PhilosophySection />
        <ProtocolSection />
        <GetStartedSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
