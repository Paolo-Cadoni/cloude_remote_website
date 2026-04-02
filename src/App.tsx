import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, MousePointer2, ChevronRight, Server, CheckCircle2 } from 'lucide-react';
import { hasSupabaseConfig, supabase } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

const WAITLIST_SECTION_ID = 'waitlist';
const SUPABASE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-waitlist-thanks`
  : null;
const TELEMETRY_MESSAGES = [
  'Establishing remote socket...',
  'Agent connected to repo: cloude-ui',
  '> npm run build',
  'Compiled successfully in 432ms.',
  'Awaiting new instructions...',
] as const;

type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  primary?: boolean;
};

const scrollToWaitlist = () => {
  document.getElementById(WAITLIST_SECTION_ID)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

// --- Micro-Interaction Components ---

const MagneticButton = ({
  children,
  className = '',
  primary = false,
  ...props
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.04;
    const y = (e.clientY - top - height / 2) * 0.04;
    gsap.to(buttonRef.current, { x, y, duration: 0.3, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' });
  };

  const handleMouseEnter = () => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, { scale: 1.01, duration: 0.3, ease: 'power2.out' });
  };

  const baseStyle = "relative overflow-hidden rounded-xl font-medium text-[13px] md:text-sm px-6 py-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent/50";
  const colorStyle = primary 
    ? "bg-text text-background font-semibold shadow-sm hover:scale-[1.01] hover:brightness-110" 
    : "bg-transparent border border-white/10 text-text/80 hover:bg-white/5 hover:text-text";

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`${baseStyle} ${colorStyle} ${className} group`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'error' | 'success'; message: string }>({
    type: 'idle',
    message: '',
  });
  const formStartedAt = useRef<number | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const elapsedMs = formStartedAt.current ? Date.now() - formStartedAt.current : Infinity;
    const honeypotValue = honeypotRef.current?.value.trim();

    if (honeypotValue || elapsedMs < 1500) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setFeedback({ type: 'error', message: 'Please enter an email address.' });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (!supabase) {
      setFeedback({
        type: 'error',
        message: 'Supabase is not configured yet. Add your project URL and anon key to .env.local.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: 'idle', message: '' });

    const { data, error } = await supabase
      .from('waitlist_signups')
      .upsert(
        {
          email: normalizedEmail,
          source: 'website',
        },
        {
          onConflict: 'email',
          ignoreDuplicates: true,
        },
      )
      .select('id');

    if (error) {
      setFeedback({
        type: 'error',
        message: 'Something went wrong while saving your email. Please try again in a moment.',
      });

      setIsSubmitting(false);
      return;
    }

    const isExistingSignup = !data || data.length === 0;

    if (isExistingSignup) {
      setFeedback({ type: 'success', message: "You're already on the list. We'll be in touch." });
      setIsSubmitting(false);
      return;
    }

    setEmail('');

    if (SUPABASE_FUNCTION_URL) {
      try {
        const emailResponse = await fetch(SUPABASE_FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: normalizedEmail }),
        });

        if (emailResponse.ok) {
          setFeedback({ type: 'success', message: 'You are on the list. Check your inbox for a confirmation email.' });
        } else {
          setFeedback({
            type: 'success',
            message: 'You are on the list. We saved your email, but the confirmation email is still being set up.',
          });
        }
      } catch {
        setFeedback({
          type: 'success',
          message: 'You are on the list. We saved your email, but the confirmation email could not be sent yet.',
        });
      }
    } else {
      setFeedback({
        type: 'success',
        message: 'You are on the list. We saved your email, and confirmation email setup is still pending.',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] backdrop-blur-xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="waitlist-company">Company</label>
          <input
            ref={honeypotRef}
            id="waitlist-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-black/30 px-5 text-sm text-text placeholder:text-text/35 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
          />
          <MagneticButton
            primary
            type="submit"
            disabled={isSubmitting}
            className="min-h-14 w-full sm:w-auto sm:min-w-[220px] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Joining...' : 'Join the waitlist'}
          </MagneticButton>
        </div>
        <div className="mt-3 flex flex-col gap-2 px-1 text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-text/35">
            {hasSupabaseConfig
              ? 'Stored securely in Supabase'
              : 'Add your Supabase keys to activate submissions'}
          </p>
          {feedback.type !== 'idle' && (
            <p className={`text-sm ${feedback.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>
              {feedback.message}
            </p>
          )}
        </div>
      </div>
    </form>
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
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-5xl rounded-[1.5rem] px-4 md:px-5 py-2 flex items-center justify-between transition-all duration-500 border border-transparent [&.nav-scrolled]:bg-[#0A0A0F]/60 [&.nav-scrolled]:backdrop-blur-2xl [&.nav-scrolled]:border-white/5 [&.nav-scrolled]:shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center gap-2 font-sans font-semibold text-base tracking-tight">
        <Terminal className="w-4 h-4 text-accent" strokeWidth={2.5} />
        <span className="translate-y-[0.5px]">Cloude<span className="text-white/20 mx-1">/</span>Remote</span>
      </div>
      <div className="hidden md:flex items-center gap-6 font-sans text-[13px] font-medium tracking-wide text-text/70 translate-y-[0.5px]">
        <a href="#features" className="hover:text-text transition-all duration-300 transform hover:-translate-y-[1px]">Features</a>
      </div>
      <MagneticButton
        primary
        onClick={scrollToWaitlist}
        className="!px-4 !py-1.5 !text-[13px] !rounded-xl !tracking-wide"
      >
        Get early access
      </MagneticButton>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-elem', {
        y: 15,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.1
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] w-full flex items-center justify-center pt-32 pb-24 px-6 md:px-16">
      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center gap-6 md:gap-8">
        {/* System Status Badge */}
        <div className="hero-elem relative inline-flex rounded-full p-[1px] overflow-hidden bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.01)]">
          {/* Light Sweep (the boundary stroke highlight) */}
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%]" 
               style={{ animation: 'sweep 5s ease-in-out infinite 2s' }} />
          
          {/* Inner Badge Surface */}
          <div className="relative z-10 flex items-center justify-center gap-[10px] font-mono text-[9.5px] md:text-[10px] font-medium uppercase tracking-[0.28em] text-accent/90 px-[14px] py-[5px] bg-[#0a0a0f] rounded-full">
            {/* Heartbeat Dot */}
            <div className="relative flex items-center justify-center w-[5px] h-[5px]">
              <div className="absolute w-full h-full rounded-full bg-accent" style={{ animation: 'system-breathe 2.4s ease-in-out infinite' }} />
              {/* Ghost Ring */}
              <div className="absolute w-full h-full rounded-full border-[0.5px] border-accent" style={{ animation: 'system-ghost 2.4s cubic-bezier(0.2, 0, 0.4, 1) infinite' }} />
            </div>
            <span className="translate-y-[0.5px] opacity-90">ALWAYS RUNNING</span>
          </div>
        </div>
        
        <h1 className="hero-elem max-w-3xl">
          <span className="font-sans font-bold text-4xl sm:text-5xl md:text-[3.5rem] tracking-tight text-text leading-[1.1] md:leading-[1.1]">
            Code from your phone.
          </span>
        </h1>
        
        <div className="hero-elem font-medium text-sm md:text-[17px] text-text/50 max-w-xl flex flex-col gap-2">
          <p>Control your coding agents from anywhere.</p>
        </div>
        
        <div className="hero-elem flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-2 md:mt-4 font-medium text-sm md:text-[15px] tracking-wide text-text/40">
          <span>No laptop.</span>
          <span className="opacity-40 select-none">•</span>
          <span>No setup.</span>
          <span className="opacity-40 select-none">•</span>
          <span className="text-text/90 font-medium">Just ship.</span>
        </div>

        <div className="hero-elem mt-6 md:mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center justify-center">
          <MagneticButton primary onClick={scrollToWaitlist} className="w-full sm:w-auto">
            Join the waitlist
          </MagneticButton>
          <MagneticButton className="w-full sm:w-auto group">
            <span className="opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-2">View on GitHub <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5"/></span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};

const WaitlistSection = () => {
  return (
    <section id={WAITLIST_SECTION_ID} className="px-6 pb-12 md:px-16">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/8 bg-gradient-to-br from-white/[0.05] via-white/[0.025] to-transparent px-6 py-12 shadow-[0_30px_80px_rgba(0,0,0,0.28)] md:px-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-accent/80">
            Early Access
          </p>
          <h2 className="font-sans text-3xl font-bold tracking-tight text-text md:text-5xl">
            Join the first wave of remote builders.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-text/55 md:text-base">
            Leave your email and we&apos;ll keep your place on the list for launch updates, private beta invites,
            and rollout news.
          </p>
        </div>

        <div className="mt-10">
          <WaitlistForm />
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
    <div className="bg-white/[0.02] border border-white/5 shadow-sm p-8 rounded-[2rem] flex flex-col overflow-hidden h-80 relative group hover:-translate-y-1 transition-transform duration-500">
      <h3 className="font-sans font-bold text-xl mb-2 flex items-center justify-between">
        Always-on Execution <Server className="w-5 h-5 text-text/40"/>
      </h3>
      <p className="font-mono text-xs text-text/50 mb-8">Run Claude Code continuously on a dedicated machine.</p>
      
      <div className="relative flex-1">
        {cards.map((card, i) => (
          <div 
            key={card.id}
            className="absolute left-0 right-0 bg-black/40 border border-white/5 backdrop-blur-md p-4 rounded-xl flex items-center justify-between transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
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
  const [text, setText] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    let charIdx = 0;
    const currentMsg = TELEMETRY_MESSAGES[msgIdx];
    setText("");

    const typing = setInterval(() => {
      setText(currentMsg.substring(0, charIdx + 1));
      charIdx++;
      if (charIdx === currentMsg.length) {
        clearInterval(typing);
        setTimeout(() => {
          setMsgIdx((prev) => (prev + 1) % TELEMETRY_MESSAGES.length);
        }, 2000);
      }
    }, 50);

    return () => clearInterval(typing);
  }, [msgIdx]);

  return (
    <div className="bg-white/[0.02] border border-white/5 shadow-sm p-8 rounded-[2rem] flex flex-col h-80 relative hover:-translate-y-1 transition-transform duration-500">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-sans font-bold text-xl">Remote Command <span className="font-normal text-text/40">Layer</span></h3>
        <div className="flex gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-border"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-border"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-border"></span>
        </div>
      </div>
      <p className="font-mono text-xs text-text/50 mb-6">Control, monitor, and interact from anywhere.</p>
      
      <div className="flex-1 bg-black/40 backdrop-blur-md rounded-xl p-4 font-mono text-xs border border-white/5 text-accent/80 flex flex-col justify-end">
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
    <div ref={containerRef} className="bg-white/[0.02] border border-white/5 shadow-sm p-8 rounded-[2rem] flex flex-col h-80 relative hover:-translate-y-1 transition-transform duration-500 overflow-hidden">
      <h3 className="font-sans font-bold text-xl mb-2">Asynchronous <span className="text-accent underline decoration-accent/30 underline-offset-4">Output</span></h3>
      <p className="font-mono text-xs text-text/50 mb-8">Launch tasks. Return to completed code and commits.</p>
      
      <div className="flex-1 relative">
        <div className="grid grid-cols-2 gap-3 h-full pb-4">
          <div className="border border-white/5 bg-black/20 rounded-xl p-3 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-text/40">Task Queue</span>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-white/10 rounded-full"></div>
              <div className="h-1.5 w-2/3 bg-white/10 rounded-full"></div>
            </div>
          </div>
          <div ref={targetRef} className="border border-white/5 bg-black/20 rounded-xl p-3 flex flex-col justify-between transition-colors">
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
    <section ref={containerRef} className="relative py-40 px-6 md:px-16 flex items-center">
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

const Footer = () => {
  return (
    <footer className="relative z-20 pb-20 px-6 md:px-16 pt-32">
      {/* Thin Horizontal Line Separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col items-center mb-32 text-center">
        <h2 className="font-drama italic text-6xl md:text-8xl mb-8">Execute anywhere.</h2>
        <MagneticButton primary onClick={scrollToWaitlist} className="px-12 py-6 text-lg tracking-widest scale-110">
          Get early access
        </MagneticButton>
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
          <h4 className="font-sans font-bold text-text uppercase tracking-widest text-sm mb-2">Platform</h4>
          <a href="#features" className="hover:text-accent transition-colors">Features</a>
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
    <div className="relative w-full min-h-screen bg-[#0A0A0F] text-text selection:bg-accent/30 selection:text-white">
      {/* Global Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D12] via-[#0A0A0F] to-[#0D0D12]" />
        {/* Soft radial zones */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/[0.015] blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/[0.01] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-accent/[0.015] blur-[150px]" />
      </div>

      {/* Global Noise Overlay */}
      <div className="noise-overlay fixed inset-0 z-10 pointer-events-none mix-blend-overlay opacity-[0.03]"></div>

      {/* Content Layer */}
      <div className="relative z-20">
        <Navbar />
        <Hero />
        <WaitlistSection />
        <Features />
        <Philosophy />
        <Footer />
      </div>
    </div>
  );
}

export default App;
