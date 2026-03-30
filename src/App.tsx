import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Activity, MousePointer2, ChevronRight, Server, CheckCircle2, Lock, GitBranch } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- Micro-Interaction Components ---

const MagneticButton = ({ children, className = '', primary = false, ...props }: any) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.15;
    const y = (e.clientY - top - height / 2) * 0.15;
    gsap.to(buttonRef.current, { x, y, duration: 0.3, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  };

  const handleMouseEnter = () => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
  };

  const baseStyle = "relative overflow-hidden rounded-full font-mono text-xs uppercase tracking-wider px-6 py-3 transition-colors";
  const colorStyle = primary 
    ? "bg-text text-background font-bold" 
    : "bg-surface border border-border text-text hover:text-accent";

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`${baseStyle} ${colorStyle} ${className} group`}
      {...props}
    >
      <span className="absolute inset-0 w-full h-full bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"></span>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};

// --- Page Sections ---

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: { className: 'nav-scrolled', targets: navRef.current },
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav 
      ref={navRef} 
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-5xl rounded-[2rem] px-6 py-4 flex items-center justify-between transition-all duration-500 border border-transparent [&.nav-scrolled]:bg-background/70 [&.nav-scrolled]:backdrop-blur-xl [&.nav-scrolled]:border-border [&.nav-scrolled]:shadow-2xl"
    >
      <div className="flex items-center gap-3 font-sans font-bold text-lg tracking-tight">
        <Terminal className="w-5 h-5 text-accent" />
        <span>Cloude<span className="text-border mx-1">/</span>Remote</span>
      </div>
      <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-text/60">
        <a href="#features" className="hover:text-text transition-colors hover:-translate-y-[1px]">Features</a>
        <a href="#protocol" className="hover:text-text transition-colors hover:-translate-y-[1px]">Protocol</a>
      </div>
      <MagneticButton primary>Get early access</MagneticButton>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-elem', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[100dvh] w-full flex items-end pb-24 px-6 md:px-16 overflow-hidden">
      {/* Background Image & Gradient */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" 
          alt="Server infrastructure"
          className="w-full h-full object-cover opacity-30 grayscale mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl w-full flex flex-col items-start gap-6">
        <div className="hero-elem inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 rounded-full px-4 py-1.5 bg-accent/5 backdrop-blur-md">
          <Activity className="w-3 h-3" /> System Online — Agent Ready
        </div>
        
        <h1 className="hero-elem flex flex-col gap-2">
          <span className="font-sans font-bold text-2xl md:text-4xl tracking-tight text-text/80 uppercase">Your AI engineer.</span>
          <span className="font-drama italic text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-none text-text">Always running.</span>
        </h1>
        
        <div className="hero-elem font-mono text-sm md:text-base text-text/60 max-w-xl mt-4 border-l border-border pl-4 flex flex-col gap-2">
          <p>Run your XYZ in the cloud and control it from anywhere.</p>
        </div>
        
        <div className="hero-elem flex flex-wrap gap-4 md:gap-8 mt-8 font-sans font-medium text-xl md:text-2xl tracking-tight">
          <span className="text-text/80">No laptop.</span>
          <span className="text-text/80">No setup.</span>
          <span className="text-accent font-bold">Just ship.</span>
        </div>

        <div className="hero-elem mt-8 flex sm:flex-row flex-col gap-4">
          <MagneticButton primary className="px-8 py-4 text-sm scale-105">{">_ Join the waitlist"}</MagneticButton>
          <MagneticButton className="px-8 py-4 text-sm"><ChevronRight className="w-4 h-4"/> Read the Docs</MagneticButton>
        </div>
      </div>
      
      {/* Abstract Code Snippet Decoration */}
      <div className="hero-elem absolute top-1/4 right-10 hidden lg:block font-mono text-xs text-text/20 leading-relaxed max-w-xs text-right opacity-40">
        <div><span className="text-accent/50">const</span> instance = <span className="text-accent/50">new</span> Agent();</div>
        <div>await instance.connect(&#123; mode: <span className="text-text/50">'hybrid'</span> &#125;);</div>
        <div>instance.execute(&#123;</div>
        <div>&nbsp;&nbsp;task: <span className="text-text/50">'refactor_core'</span>,</div>
        <div>&nbsp;&nbsp;sync: <span className="text-accent/50">false</span></div>
        <div>&#125;);</div>
        <div className="mt-4 border-t border-border/50 pt-2 flex items-center justify-end gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          Running background process
        </div>
      </div>
    </section>
  );
};

const DiagnosticShufflerCard = () => {
  const [cards, setCards] = useState([
    { id: 1, label: 'Node Alpha — Connected', status: 'Optimal', load: '12%' },
    { id: 2, label: 'Node Beta — Syncing', status: 'Writing', load: '48%' },
    { id: 3, label: 'Node Gamma — Standby', status: 'Queued', load: '0%' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newCards = [...prev];
        const last = newCards.pop()!;
        newCards.unshift(last);
        return newCards;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface border border-border p-8 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden h-80 relative group hover:-translate-y-1 transition-transform duration-500">
      <h3 className="font-sans font-bold text-xl mb-2 flex items-center justify-between">
        Always-on Execution <Server className="w-5 h-5 text-text/40"/>
      </h3>
      <p className="font-mono text-xs text-text/50 mb-8">Run Claude Code continuously on a dedicated machine.</p>
      
      <div className="relative flex-1">
        {cards.map((card, i) => (
          <div 
            key={card.id}
            className="absolute left-0 right-0 bg-background border border-border p-4 rounded-xl flex items-center justify-between transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ 
              top: `${i * 24}px`, 
              scale: 1 - (i * 0.05),
              opacity: 1 - (i * 0.2),
              zIndex: 10 - i 
            }}
          >
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-accent animate-pulse' : 'bg-border'}`}></span>
              <span className="font-mono text-xs truncate max-w-[120px]">{card.label}</span>
            </div>
            <span className="font-mono text-[10px] text-text/40">{card.load}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TelemetryTypewriterCard = () => {
  const messages = [
    "Establishing remote socket...",
    "Agent connected to repo: cloude-ui",
    "> npm run build",
    "Compiled successfully in 432ms.",
    "Awaiting new instructions..."
  ];
  const [text, setText] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    let charIdx = 0;
    const currentMsg = messages[msgIdx];
    setText("");

    const typing = setInterval(() => {
      setText(currentMsg.substring(0, charIdx + 1));
      charIdx++;
      if (charIdx === currentMsg.length) {
        clearInterval(typing);
        setTimeout(() => {
          setMsgIdx((prev) => (prev + 1) % messages.length);
        }, 2000);
      }
    }, 50);

    return () => clearInterval(typing);
  }, [msgIdx]);

  return (
    <div className="bg-surface border border-border p-8 rounded-[2rem] shadow-2xl flex flex-col h-80 relative hover:-translate-y-1 transition-transform duration-500">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-sans font-bold text-xl">Remote Command <span className="font-normal text-text/40">Layer</span></h3>
        <div className="flex gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-border"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-border"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-border"></span>
        </div>
      </div>
      <p className="font-mono text-xs text-text/50 mb-6">Control, monitor, and interact from anywhere.</p>
      
      <div className="flex-1 bg-background rounded-xl p-4 font-mono text-xs border border-border/50 text-accent/80 flex flex-col justify-end">
        <div>
          <span className="text-text/70">$ cloude logs stream</span>
          <br/><br/>
          {text}<span className="inline-block w-2.5 h-3 bg-accent ml-1 animate-pulse translate-y-0.5"></span>
        </div>
      </div>
    </div>
  );
};

const CursorProtocolSchedulerCard = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.set(cursorRef.current, { x: 200, y: 100, opacity: 0 })
        .to(cursorRef.current, { opacity: 1, duration: 0.2 })
        .to(cursorRef.current, { x: 40, y: 30, duration: 1, ease: "power2.inOut" })
        .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to(targetRef.current, { backgroundColor: '#C9A84C', color: '#0D0D12', duration: 0.2 }, "-=0.1")
        .to(cursorRef.current, { x: 180, y: 120, duration: 0.8, ease: "power2.inOut", delay: 0.5 })
        .to(cursorRef.current, { opacity: 0, duration: 0.2 })
        .to(targetRef.current, { backgroundColor: 'transparent', color: '#FAF8F5', duration: 0.2 }, "+=0.5");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-surface border border-border p-8 rounded-[2rem] shadow-2xl flex flex-col h-80 relative hover:-translate-y-1 transition-transform duration-500 overflow-hidden">
      <h3 className="font-sans font-bold text-xl mb-2">Asynchronous <span className="text-accent underline decoration-accent/30 underline-offset-4">Output</span></h3>
      <p className="font-mono text-xs text-text/50 mb-8">Launch tasks. Return to completed code and commits.</p>
      
      <div className="flex-1 relative">
        <div className="grid grid-cols-2 gap-3 h-full pb-4">
          <div className="border border-border rounded-xl p-3 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-text/40">Task Queue</span>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-border rounded-full"></div>
              <div className="h-1.5 w-2/3 bg-border rounded-full"></div>
            </div>
          </div>
          <div ref={targetRef} className="border border-border rounded-xl p-3 flex flex-col justify-between transition-colors">
            <span className="font-mono text-[10px] opacity-60">Result Output</span>
            <div className="flex justify-end"><CheckCircle2 className="w-4 h-4" /></div>
          </div>
        </div>
        
        <div ref={cursorRef} className="absolute top-0 left-0 text-white drop-shadow-lg z-10" style={{ transform: 'translate(200px, 100px)' }}>
          <MousePointer2 className="w-6 h-6 fill-white" />
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-32 px-6 md:px-16 max-w-7xl mx-auto">
      <div className="mb-20">
        <h2 className="font-sans font-bold text-sm tracking-widest uppercase text-accent mb-4 pl-4 border-l border-accent">The Architecture</h2>
        <p className="font-drama italic text-4xl md:text-5xl max-w-2xl text-text leading-tight">Interactive Functional Artifacts.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DiagnosticShufflerCard />
        <TelemetryTypewriterCard />
        <CursorProtocolSchedulerCard />
      </div>
    </section>
  );
};

const Philosophy = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.phil-word', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const text1 = "Most engineering setups rely on:".split(" ");
  const text2 = "local environments constrained by battery and sleep cycles.".split(" ");
  const text3 = "We engineer for:".split(" ");
  const text4 = "cloud permanence.".split(" ");

  return (
    <section ref={containerRef} className="relative py-40 px-6 md:px-16 flex items-center bg-black overflow-hidden border-y border-border">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover opacity-20 grayscale"
          alt="Abstract dark architecture"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <div className="mb-12 font-sans font-medium text-lg md:text-2xl text-text/50 max-w-3xl leading-relaxed">
          {text1.map((w, i) => <span key={i} className="phil-word inline-block mr-2">{w}</span>)}
          <br />
          {text2.map((w, i) => <span key={`t2-${i}`} className="phil-word inline-block mr-2">{w}</span>)}
        </div>
        
        <div className="font-drama italic text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight">
          {text3.map((w, i) => <span key={`t3-${i}`} className="phil-word inline-block mr-3 md:mr-4">{w}</span>)}
          <br />
          {text4.map((w, i) => <span key={`t4-${i}`} className="phil-word inline-block mr-3 md:mr-4 text-accent">{w}</span>)}
        </div>
      </div>
    </section>
  );
};

const ProtocolStacking = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.stack-card');
      
      cards.forEach((card: any) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top top+=100',
          endTrigger: sectionRef.current,
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
          animation: gsap.to(card, {
            scale: 0.9,
            opacity: 0.5,
            filter: 'blur(10px)',
            ease: "none"
          }),
          scrub: true,
        });
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: "01",
      title: "Secure Terminal Handshake",
      desc: "Authenticate via SSH to your dedicated cloud instance.",
      icon: <Lock className="w-12 h-12 text-accent" strokeWidth={1} />
    },
    {
      num: "02",
      title: "Agent Deployment",
      desc: "Inject Claude Code natively into the cloned repository.",
      icon: <Terminal className="w-12 h-12 text-accent" strokeWidth={1} />
    },
    {
      num: "03",
      title: "Asynchronous Commit Pipeline",
      desc: "Agent pushes verified changes while you sleep.",
      icon: <GitBranch className="w-12 h-12 text-accent" strokeWidth={1} />
    }
  ];

  return (
    <section id="protocol" ref={sectionRef} className="py-24 px-6 md:px-16 min-h-[300vh] relative">
      <div className="max-w-4xl mx-auto h-full space-y-[80vh] pt-10">
        {steps.map((step) => (
          <div key={step.num} className="stack-card bg-surface border border-border rounded-[3rem] p-12 md:p-20 shadow-2xl h-[65vh] flex flex-col justify-between relative overflow-hidden origin-top">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl rounded-tl-none"></div>
            
            <div className="flex justify-between items-start z-10">
              <span className="font-mono text-4xl text-text/20 font-bold">{step.num}</span>
              {step.icon}
            </div>
            
            <div className="z-10">
              <h3 className="font-sans font-bold text-3xl md:text-5xl mb-4 tracking-tight">{step.title}</h3>
              <p className="font-mono text-sm md:text-base text-text/60 max-w-sm border-l-2 border-accent pl-4">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black pt-32 pb-10 px-6 md:px-16 rounded-t-[4rem] border-t border-border mt-32 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center mb-32 text-center">
        <h2 className="font-drama italic text-6xl md:text-8xl mb-8">Execute anywhere.</h2>
        <MagneticButton primary className="px-12 py-6 text-lg tracking-widest scale-110">Get early access</MagneticButton>
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-border/50 pt-10 mt-10">
        <div className="col-span-1 md:col-span-2 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 font-sans font-bold text-xl mb-4">
              <Terminal className="w-6 h-6 text-accent" />
              <span>Cloude/Remote</span>
            </div>
            <p className="font-mono text-xs text-text/40 max-w-xs">High-end developer system for always-on AI code generation & execution.</p>
          </div>
          
          <div className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-text/30 border border-text/10 rounded-full px-4 py-2 w-max bg-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Operational
          </div>
        </div>
        
        <div className="flex flex-col gap-4 font-mono text-xs text-text/60">
          <h4 className="font-sans font-bold text-text uppercase tracking-widest text-sm mb-2">Protocol</h4>
          <a href="#" className="hover:text-accent transition-colors">Documentation</a>
          <a href="#" className="hover:text-accent transition-colors">Integrations</a>
          <a href="#" className="hover:text-accent transition-colors">Instances</a>
        </div>
        
        <div className="flex flex-col gap-4 font-mono text-xs text-text/60">
          <h4 className="font-sans font-bold text-text uppercase tracking-widest text-sm mb-2">Legal</h4>
          <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-accent transition-colors">Data Processing</a>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="relative w-full">
      <div className="noise-overlay"></div>
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <ProtocolStacking />
      <Footer />
    </div>
  );
}

export default App;
