import * as React from 'react';
import { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from './firebase';
import { ChatBot } from './components/ChatBot';
import { 
  MapPin, 
  Instagram, 
  Globe, 
  ChevronRight, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Utensils, 
  Coffee, 
  TrendingUp, 
  Menu as MenuIcon, 
  X,
  Search,
  Zap,
  Users,
  ArrowRight,
  Star,
  Quote,
  Trash2,
  RefreshCw,
  Clock
} from 'lucide-react';

// --- Error Handling & Utilities ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

// --- Shared Components ---

interface FloatingElementProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ children, className, delay = 0, duration = 6, style }) => (
  <motion.div
    animate={{ 
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay
    }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  light?: boolean;
}

const SectionHeading = ({ title, subtitle, light = false }: SectionHeadingProps) => (
  <div className="text-center mb-16 md:mb-24">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`inline-block px-4 py-1.5 rounded-full ${light ? 'bg-white/10 text-brand-accent' : 'bg-brand-accent/10 text-brand-accent'} text-xs font-bold uppercase tracking-widest mb-4`}
    >
      {subtitle}
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className={`text-4xl md:text-6xl font-serif font-bold ${light ? 'text-white' : 'text-brand-green'} leading-tight`}
    >
      {title}
    </motion.h2>
  </div>
);

// --- Sections ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4 glass shadow-lg' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-2xl font-serif font-bold tracking-tight text-brand-green flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-brand-cream shadow-lg">
            <Utensils className="w-6 h-6" />
          </div>
          <span className="hidden sm:block">DineGrow</span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-bold uppercase tracking-widest hover:text-brand-accent transition-colors">
              {link.name}
            </a>
          ))}
          <a href="#contact" className="px-8 py-3 bg-brand-green text-brand-cream rounded-full text-sm font-bold hover:bg-brand-brown transition-all shadow-xl hover:shadow-brand-green/20">
            Free Audit
          </a>
        </div>

        <button className="md:hidden text-brand-green" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={32} /> : <MenuIcon size={32} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-brand-cream border-b border-brand-green/10 p-8 md:hidden flex flex-col gap-6 shadow-2xl overflow-hidden"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-2xl font-serif font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                {link.name}
              </a>
            ))}
            <a href="#contact" className="w-full py-4 bg-brand-green text-brand-cream rounded-2xl text-center font-bold text-lg" onClick={() => setIsMobileMenuOpen(false)}>
              Get Free Audit
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-accent/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-brown/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-sm border border-brand-accent/20">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
            Ranchi's Premier Growth Agency
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-medium text-brand-green leading-[0.95] mb-8 text-balance">
            Elevating <span className="italic font-serif">Ranchi's</span> Culinary <span className="text-brand-accent">Landmarks.</span>
          </h1>
          <p className="text-xl text-brand-green/70 mb-12 max-w-xl leading-relaxed font-light">
            We transform local restaurants into digital powerhouses. Through aesthetic branding, viral social strategy, and precision SEO, we ensure your tables are always full.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <a href="#contact" className="px-10 py-6 bg-brand-green text-brand-cream rounded-2xl font-bold text-lg hover:bg-brand-brown transition-all shadow-2xl shadow-brand-green/40 flex items-center justify-center gap-3 group">
              Get a Free Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
            <a href="https://wa.me/916209009255" className="px-10 py-6 glass border-brand-green/10 rounded-2xl font-bold text-lg hover:bg-brand-green hover:text-brand-cream transition-all flex items-center justify-center gap-3">
              <MessageCircle className="w-6 h-6" />
              WhatsApp Us
            </a>
          </div>
          
          <div className="mt-16 flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-14 h-14 rounded-full border-4 border-brand-cream overflow-hidden shadow-lg">
                  <img src={`https://picsum.photos/seed/chef${i}/150/150`} alt="Chef" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex text-brand-accent mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className="text-sm font-bold text-brand-green/60 uppercase tracking-widest">Trusted by 50+ Local Icons</p>
            </div>
          </div>
        </motion.div>

        <div className="relative perspective-1000 hidden lg:block">
          <motion.div style={{ y: y1 }} className="relative z-20">
            <div className="w-full aspect-[4/5] glass p-4 rounded-[4rem] flex items-center justify-center relative overflow-hidden group border-white/40 shadow-2xl">
              {/* Main Image Container */}
              <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1550966842-2849a28c0a61?auto=format&fit=crop&q=80&w=1200" 
                  alt="Fine Dining Ranchi" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 via-transparent to-transparent" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-12 left-12 right-12">
                  <p className="text-brand-accent font-serif italic text-2xl mb-2">Signature Strategy</p>
                  <h3 className="text-white text-4xl font-serif font-bold leading-tight">Visual Storytelling for Modern Palates</h3>
                </div>
              </div>

              {/* Floating Stats Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 glass p-8 rounded-[2.5rem] shadow-2xl z-30"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600">
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Growth Index</p>
                    <p className="text-3xl font-serif font-bold text-brand-green">+215%</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <FloatingElement delay={1} duration={5} className="absolute top-12 right-12 z-30">
                <div className="w-24 h-24 glass rounded-[2rem] flex items-center justify-center shadow-2xl text-brand-accent border-white/40">
                  <MapPin size={48} />
                </div>
              </FloatingElement>
              
              <FloatingElement delay={2} duration={7} className="absolute bottom-40 left-12 z-30">
                <div className="w-20 h-20 glass rounded-[1.5rem] flex items-center justify-center shadow-2xl text-brand-accent border-white/40">
                  <Instagram size={40} />
                </div>
              </FloatingElement>

            </div>
          </motion.div>
          
          {/* Decorative Background Element */}
          <motion.div 
            style={{ y: y2 }}
            className="absolute -top-20 -left-20 w-64 h-64 border border-brand-accent/20 rounded-full z-10"
          />
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "Google Maps Optimization",
      desc: "We help your restaurant dominate local searches. When someone searches for 'best café in Ranchi', we make sure you're at the top.",
      icon: <MapPin className="w-12 h-12" />,
      color: "bg-emerald-500/10 text-emerald-600",
      tag: "Local SEO"
    },
    {
      title: "Instagram Marketing",
      desc: "From viral food reels to aesthetic grid layouts, we create content that makes people crave your food before they even visit.",
      icon: <Instagram className="w-12 h-12" />,
      color: "bg-pink-500/10 text-pink-600",
      tag: "Social Growth"
    },
    {
      title: "Restaurant Website Creation",
      desc: "Modern, lightning-fast websites with digital menus, WhatsApp ordering, and seamless reservation features built-in.",
      icon: <Globe className="w-12 h-12" />,
      color: "bg-blue-500/10 text-blue-600",
      tag: "Digital Hub"
    }
  ];

  return (
    <section id="services" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          subtitle="Our Expertise" 
          title="Premium Marketing Solutions for Ranchi's Food Scene" 
        />

        <div className="grid md:grid-cols-3 gap-10">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="card-3d glass-dark p-12 rounded-[3.5rem] border border-brand-green/5 hover:border-brand-accent/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-10">
                <div className={`w-24 h-24 rounded-[2rem] ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                  {service.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{service.tag}</span>
              </div>
              <h3 className="text-3xl font-serif font-bold mb-6 text-brand-green leading-tight">{service.title}</h3>
              <p className="text-brand-green/70 leading-relaxed mb-10 text-lg">
                {service.desc}
              </p>
              <div className="flex items-center gap-2 text-brand-accent font-bold group-hover:gap-4 transition-all">
                Learn More <ArrowRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Free Online Audit",
      desc: "We perform a deep-dive analysis of your current Google Maps listing, Instagram profile, and website to find growth opportunities.",
      icon: <Search className="w-8 h-8" />
    },
    {
      step: "02",
      title: "Strategic Optimization",
      desc: "Our team improves your profiles, creates high-quality content, and optimizes your digital presence for maximum visibility.",
      icon: <Zap className="w-8 h-8" />
    },
    {
      step: "03",
      title: "More Customers",
      desc: "With improved visibility and branding, your restaurant becomes the go-to choice for local foodies in Ranchi.",
      icon: <Users className="w-8 h-8" />
    }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-brand-green text-brand-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-accent via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading 
          subtitle="The Process" 
          title="How We Grow Your Business" 
          light 
        />

        <div className="grid md:grid-cols-3 gap-16 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 z-0" />
          
          {steps.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-brand-accent text-brand-green flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(197,160,89,0.3)] group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>
              <div className="text-brand-accent font-black text-6xl mb-4 opacity-20 font-serif italic">{step.step}</div>
              <h3 className="text-3xl font-serif font-bold mb-6">{step.title}</h3>
              <p className="text-brand-cream/60 leading-relaxed text-lg">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const projects = [
    { 
      title: "The Coffee House", 
      location: "Ranchi",
      category: "Instagram Marketing", 
      img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "Spice Route", 
      location: "Ranchi",
      category: "Website Design", 
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "Bistro 24", 
      location: "Ranchi",
      category: "Google Maps SEO", 
      img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "Urban Grill", 
      location: "Ranchi",
      category: "Full Growth Package", 
      img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "The Grand Terrace", 
      location: "Main Road, Ranchi",
      category: "Social Media Ads", 
      img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "Artisan Bakers", 
      location: "Lalpur, Ranchi",
      category: "Local SEO", 
      img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "Royal Tandoor Elite", 
      location: "Doranda, Ranchi",
      category: "Brand Identity", 
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "Green Leaf Bistro", 
      location: "Kanke Road, Ranchi",
      category: "Influencer Marketing", 
      img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "The Burger Loft", 
      location: "Bariatu, Ranchi",
      category: "Performance Ads", 
      img: "https://images.unsplash.com/photo-1460306855393-0410f61241c7?auto=format&fit=crop&q=80&w=800" 
    }
  ];

  return (
    <section id="portfolio" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          subtitle="Our Work" 
          title="Recent Success Stories in Ranchi" 
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group overflow-hidden rounded-[3rem] shadow-2xl cursor-pointer aspect-[4/5]"
            >
              <img 
                src={project.img} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green/95 via-brand-green/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                >
                  <span className="inline-block px-4 py-1 rounded-full bg-brand-accent text-brand-green text-[10px] font-black uppercase tracking-widest mb-4">
                    {project.category}
                  </span>
                  <h3 className="text-3xl font-serif font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-brand-accent/80 text-sm font-bold flex items-center gap-2">
                    <MapPin size={14} /> {project.location}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SampleResults = () => {
  const results = [
    {
      title: "Social Authority",
      desc: "We transform your Instagram into a visual menu that Ranchi foodies can't stop scrolling.",
      outcome: "3.2x higher engagement & viral reach.",
      icon: <Instagram className="w-10 h-10" />,
      img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Maps Dominance",
      desc: "Be the first choice when someone searches for 'best food near me' in Ranchi.",
      outcome: "#1 Ranking in Local Pack searches.",
      icon: <MapPin className="w-10 h-10" />,
      img: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Digital Storefront",
      desc: "A high-end website that converts casual visitors into loyal dine-in customers.",
      outcome: "45% increase in direct bookings.",
      icon: <Globe className="w-10 h-10" />,
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  return (
    <section className="py-32 bg-white overflow-hidden noise-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <p className="text-brand-accent font-black uppercase tracking-[0.3em] text-xs mb-4">Case Studies</p>
          <h2 className="text-5xl md:text-7xl font-display font-medium text-brand-green leading-none mb-8">
            Measurable <span className="italic font-serif">Impact.</span>
          </h2>
          <p className="text-brand-green/60 text-xl max-w-2xl mx-auto font-light">
            Real growth metrics achieved for our partner restaurants through strategic digital interventions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {results.map((r, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group bg-brand-cream rounded-[3.5rem] overflow-hidden shadow-2xl hover:shadow-brand-accent/10 transition-all duration-700 border border-brand-green/5"
            >
              <div className="h-80 overflow-hidden relative">
                <img 
                  src={r.img} 
                  alt={r.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-green/5 group-hover:bg-transparent transition-colors duration-700" />
                <div className="absolute top-8 left-8 w-16 h-16 glass rounded-2xl flex items-center justify-center text-brand-accent shadow-2xl border-white/40">
                  {r.icon}
                </div>
              </div>
              <div className="p-12">
                <h3 className="text-3xl font-serif font-bold text-brand-green mb-4">{r.title}</h3>
                <p className="text-brand-green/70 mb-8 leading-relaxed font-light">
                  {r.desc}
                </p>
                <div className="p-8 bg-brand-green text-brand-cream rounded-[2rem] shadow-xl group-hover:bg-brand-accent group-hover:text-brand-green transition-colors duration-500">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Key Metric</p>
                  <p className="text-2xl font-serif font-bold italic">
                    {r.outcome}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Evidence Gallery */}
        <div className="mb-24">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1 bg-brand-green/10" />
            <h3 className="text-2xl font-serif font-bold text-brand-green italic">Visual Evidence</h3>
            <div className="h-px flex-1 bg-brand-green/10" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1550966842-2849a28c0a61?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=600"
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-square rounded-3xl overflow-hidden border border-brand-green/5 shadow-lg group"
              >
                <img 
                  src={img} 
                  alt="Success Story" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <a 
            href="#contact" 
            className="inline-flex items-center gap-4 px-12 py-6 bg-brand-green text-brand-cream rounded-2xl font-bold text-xl hover:bg-brand-brown transition-all shadow-2xl shadow-brand-green/20 group"
          >
            Start Your Success Story
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

const RestaurantGallery = () => {
  const row1 = [
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1550966842-2849a28c0a61?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800",
  ];
  const row2 = [
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1460306855393-0410f61241c7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
  ];

  return (
    <section className="py-32 bg-brand-cream overflow-hidden noise-bg">
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-brand-accent font-black uppercase tracking-[0.3em] text-xs mb-4">Visual Excellence</p>
            <h2 className="text-5xl md:text-7xl font-display font-medium text-brand-green leading-none">
              Capturing the <span className="italic font-serif">Soul</span> of Ranchi's Dining.
            </h2>
          </div>
          <p className="text-brand-green/60 text-lg max-w-sm font-light">
            Professional photography that makes your food look as good as it tastes.
          </p>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {[...row1, ...row1].map((img, i) => (
            <div key={i} className="w-[450px] h-[300px] flex-shrink-0 rounded-[3rem] overflow-hidden shadow-2xl group border border-white/20">
              <img 
                src={img} 
                alt="Restaurant Food" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-8 animate-marquee-reverse whitespace-nowrap">
          {[...row2, ...row2].map((img, i) => (
            <div key={i} className="w-[450px] h-[300px] flex-shrink-0 rounded-[3rem] overflow-hidden shadow-2xl group border border-white/20">
              <img 
                src={img} 
                alt="Restaurant Food" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceArea = () => {
  return (
    <section className="py-24 bg-brand-cream/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-dark p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-accent/5 via-transparent to-transparent" />
          
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-green mb-8 relative z-10">
            Proudly Serving Restaurants Across <span className="text-brand-accent italic">All of Ranchi</span>
          </h2>
          
          <p className="text-brand-green/60 text-xl max-w-2xl mx-auto relative z-10 leading-relaxed">
            We are dedicated to helping restaurants across the entire city grow their online presence and attract more local customers.
          </p>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    restaurantName: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const path = 'auditRequests';
      await addDoc(collection(db, path), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Call backend notification API
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, restaurantName: formData.restaurantName })
        });
      } catch (notifyErr) {
        console.warn("Notification failed, but data was saved:", notifyErr);
      }

      setIsSubmitted(true);
      setFormData({ name: '', restaurantName: '', phone: '', message: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'auditRequests');
      setError('Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-brand-green text-brand-cream relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <SectionHeading 
              subtitle="Get Started" 
              title="Claim Your Free Online Presence Audit" 
              light 
            />
            <p className="text-xl text-brand-cream/70 mb-16 leading-relaxed">
              Stop losing customers to your competitors. Let us show you exactly how to dominate the Ranchi food market.
            </p>
            
            <div className="space-y-10">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-brand-accent shadow-xl">
                  <Phone size={36} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-2">Call or WhatsApp</p>
                  <a href="tel:+916209009255" className="text-3xl font-bold hover:text-brand-accent transition-colors">+91 6209009255</a>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-brand-accent shadow-xl">
                  <MapPin size={36} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-2">Service Area</p>
                  <p className="text-3xl font-bold">Ranchi, Jharkhand</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 md:p-16 rounded-[4rem] text-brand-green shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
          >
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-4xl font-serif font-bold mb-4">Request Sent!</h3>
                <p className="text-brand-green/60 text-lg mb-8">Thank you for reaching out. Our team will analyze your presence and contact you within 24 hours.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-8 py-4 bg-brand-green text-brand-cream rounded-2xl font-bold hover:bg-brand-brown transition-all"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-4xl font-serif font-bold mb-10">Request Audit</h3>
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest opacity-40">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-8 py-5 bg-brand-cream rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/20 transition-all font-medium" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest opacity-40">Restaurant Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.restaurantName}
                        onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                        className="w-full px-8 py-5 bg-brand-cream rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/20 transition-all font-medium" 
                        placeholder="The Ranchi Bistro" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-8 py-5 bg-brand-cream rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/20 transition-all font-medium" 
                      placeholder="+91 00000 00000" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40">Your Message</label>
                    <textarea 
                      rows={4} 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-8 py-5 bg-brand-cream rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/20 transition-all font-medium" 
                      placeholder="How can we help you grow?" 
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                  <button 
                    disabled={isSubmitting}
                    className="w-full py-6 bg-brand-green text-brand-cream rounded-2xl font-bold text-xl hover:bg-brand-brown transition-all shadow-2xl shadow-brand-green/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Audit Request'}
                    <ArrowRight />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-24 bg-brand-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2">
            <a href="#" className="text-4xl font-serif font-bold text-brand-green flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-brand-green rounded-2xl flex items-center justify-center text-brand-cream">
                <Utensils />
              </div>
              DineGrow
            </a>
            <p className="text-brand-green/60 max-w-sm text-xl leading-relaxed font-medium">
              Helping cafés and restaurants in Ranchi grow their online presence and attract more local customers through specialized digital marketing.
            </p>
          </div>
          <div>
            <h4 className="font-black text-brand-green mb-8 uppercase tracking-[0.2em] text-xs opacity-40">Services</h4>
            <ul className="space-y-5 text-brand-green/70 font-bold">
              <li><a href="#" className="hover:text-brand-accent transition-colors">Google Maps SEO</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Instagram Marketing</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">WhatsApp Ordering</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-brand-green mb-8 uppercase tracking-[0.2em] text-xs opacity-40">Contact</h4>
            <ul className="space-y-5 text-brand-green/70 font-bold">
              <li>Ranchi, Jharkhand</li>
              <li>+91 6209009255</li>
              <li>hello@dinegrow.in</li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-brand-green/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-brand-green/40 text-sm font-bold">© 2026 DineGrow Marketing. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-brand-green/40 hover:text-brand-accent transition-all"><Instagram size={24} /></a>
            <a href="#" className="text-brand-green/40 hover:text-brand-accent transition-all"><MessageCircle size={24} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FloatingWhatsApp = () => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 100 }}
      className="fixed bottom-10 left-10 z-50 flex items-center gap-4"
    >
      <motion.a
        href="https://wa.me/916209009255"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-20 h-20 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(37,211,102,0.4)] hover:shadow-[#25D366]/60 transition-all group"
      >
        <MessageCircle className="w-10 h-10 fill-current" />
        <div className="absolute inset-0 bg-white rounded-full scale-0 group-hover:scale-110 opacity-20 transition-transform duration-500" />
        
        {/* Animated rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-10 delay-300" />
        
        {/* Notification dot */}
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-white z-10" />
      </motion.a>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="hidden md:block bg-white px-6 py-3 rounded-2xl shadow-xl border border-brand-green/5 font-bold text-brand-green"
      >
        Chat with us! 🚀
      </motion.div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.email === "vishaljaiswal8873@gmail.com") {
      const q = query(collection(db, 'auditRequests'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(reqs);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'auditRequests');
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => signOut(auth);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'auditRequests', id), { status: newStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `auditRequests/${id}`);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await deleteDoc(doc(db, 'auditRequests', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `auditRequests/${id}`);
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    completed: requests.filter(r => r.status === 'completed').length
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user || user.email !== "vishaljaiswal8873@gmail.com") {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
        <div className="max-w-md w-full p-12 bg-white rounded-[3rem] shadow-2xl text-center">
          <h2 className="text-3xl font-serif font-bold text-brand-green mb-8">Admin Access</h2>
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-brand-green text-brand-cream rounded-2xl font-bold hover:bg-brand-brown transition-all flex items-center justify-center gap-3"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-brand-green">Audit Requests</h1>
            <p className="text-brand-green/60 mt-2">Manage your restaurant growth leads</p>
          </div>
          <button onClick={handleLogout} className="text-brand-green/60 font-bold hover:text-brand-green">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-brand-green/5">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-brand-green/5 rounded-xl text-brand-green">
                <Users size={20} />
              </div>
              <p className="text-sm font-bold text-brand-green/60 uppercase tracking-widest">Total Leads</p>
            </div>
            <p className="text-4xl font-serif font-bold text-brand-green">{stats.total}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-brand-green/5">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600">
                <Clock size={20} />
              </div>
              <p className="text-sm font-bold text-brand-green/60 uppercase tracking-widest">Pending</p>
            </div>
            <p className="text-4xl font-serif font-bold text-brand-green">{stats.pending}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-brand-green/5">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-50 rounded-xl text-green-600">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-sm font-bold text-brand-green/60 uppercase tracking-widest">Completed</p>
            </div>
            <p className="text-4xl font-serif font-bold text-brand-green">{stats.completed}</p>
          </div>
        </div>

        <div className="grid gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-brand-green/5 group">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-2xl font-serif font-bold text-brand-green">{req.restaurantName}</h3>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      req.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-brand-green/60 font-medium mb-4">{req.name} • <a href={`tel:${req.phone}`} className="hover:text-brand-accent">{req.phone}</a></p>
                  <div className="bg-brand-cream/50 p-6 rounded-2xl mb-4 italic text-brand-green/80">
                    "{req.message || 'No message provided'}"
                  </div>
                  <p className="text-xs text-brand-green/40 flex items-center gap-2">
                    <Clock size={12} />
                    {req.createdAt?.toDate().toLocaleString()}
                  </p>
                </div>
                
                <div className="flex md:flex-col gap-3">
                  <select 
                    value={req.status}
                    onChange={(e) => updateStatus(req.id, e.target.value)}
                    className="px-4 py-2 bg-brand-cream rounded-xl border-none text-sm font-bold text-brand-green focus:ring-2 focus:ring-brand-accent transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button 
                    onClick={() => deleteRequest(req.id)}
                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Lead"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-brand-green/10">
              <div className="w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-6 text-brand-green/20">
                <RefreshCw size={40} />
              </div>
              <p className="text-xl font-serif font-bold text-brand-green/40">No audit requests found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#admin') {
      setIsAdminView(true);
    }
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAdminView) {
    return (
      <AdminDashboard />
    );
  }

  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Portfolio />
        <SampleResults />
        <RestaurantGallery />
        <ServiceArea />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ChatBot />
    </div>
  );
}
