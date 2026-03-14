import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
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
  Quote
} from 'lucide-react';

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
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
            Ranchi's #1 Growth Agency
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-brand-green leading-[1.05] mb-8 text-balance">
            Helping Cafés & <span className="text-brand-accent italic">Restaurants</span> in Ranchi Get More Customers.
          </h1>
          <p className="text-xl text-brand-green/70 mb-12 max-w-xl leading-relaxed font-medium">
            We specialize in turning local food businesses into digital landmarks through expert Google Maps optimization, viral Instagram marketing, and high-converting restaurant websites.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <a href="#contact" className="px-10 py-5 bg-brand-green text-brand-cream rounded-2xl font-bold text-lg hover:bg-brand-brown transition-all shadow-2xl hover:shadow-brand-green/40 flex items-center justify-center gap-3 group">
              Get a Free Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
            <a href="https://wa.me/916209009255" className="px-10 py-5 glass border-brand-green/10 rounded-2xl font-bold text-lg hover:bg-brand-green hover:text-brand-cream transition-all flex items-center justify-center gap-3">
              <MessageCircle className="w-6 h-6" />
              Chat on WhatsApp
            </a>
          </div>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-brand-cream overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="Client" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex text-brand-accent mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-sm font-bold text-brand-green/60">Trusted by 50+ Ranchi Restaurants</p>
            </div>
          </div>
        </motion.div>

        <div className="relative perspective-1000 hidden lg:block">
          <motion.div style={{ y: y1 }} className="relative z-20">
            <div className="w-full aspect-[4/5] glass-dark rounded-[4rem] p-12 flex items-center justify-center relative overflow-hidden group border-white/20">
              {/* Main 3D Object - Coffee Cup */}
              <FloatingElement className="relative z-10">
                <div className="relative">
                  <img 
                    src="https://picsum.photos/seed/premium-coffee/800/800" 
                    alt="Premium Coffee" 
                    className="w-[450px] h-[450px] object-cover rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rotate-6 group-hover:rotate-0 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-10 -right-10 glass p-6 rounded-3xl shadow-2xl animate-float-slow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Monthly Growth</p>
                        <p className="text-2xl font-serif font-bold text-brand-green">+142%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              {/* Floating Icons */}
              <FloatingElement delay={1} duration={5} className="absolute top-20 right-10">
                <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center shadow-xl text-brand-accent">
                  <MapPin size={40} />
                </div>
              </FloatingElement>
              
              <FloatingElement delay={2} duration={7} className="absolute bottom-40 left-10">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center shadow-xl text-brand-accent">
                  <Instagram size={32} />
                </div>
              </FloatingElement>

              {/* Coffee Beans / Small Elements */}
              {[1,2,3,4,5].map(i => (
                <FloatingElement 
                  key={i} 
                  delay={i * 0.5} 
                  duration={4 + i} 
                  className={`absolute w-4 h-4 bg-brand-brown/40 rounded-full blur-[1px]`}
                  style={{ 
                    top: `${10 + i * 15}%`, 
                    left: `${15 + i * 12}%` 
                  }}
                />
              ))}
            </div>
          </motion.div>
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
      title: "The Terrace", 
      location: "Ranchi",
      category: "Social Media Ads", 
      img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      title: "Ranchi Bakers", 
      location: "Ranchi",
      category: "Local SEO", 
      img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800" 
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
      title: "Instagram Growth",
      desc: "Restaurant Instagram improved with consistent food reels, better captions, and profile optimization.",
      outcome: "Result: higher engagement and more customers discovering the restaurant.",
      icon: <Instagram className="w-10 h-10" />,
      img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Google Maps Visibility",
      desc: "Restaurant Google Business Profile optimized with better photos, menu information, and keywords.",
      outcome: "Result: more visibility in “restaurant near me” searches.",
      icon: <MapPin className="w-10 h-10" />,
      img: "https://images.unsplash.com/photo-1569336415962-a4bd4f79c3f2?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Restaurant Website",
      desc: "Modern mobile-friendly website created with menu, location map, and WhatsApp contact.",
      outcome: "Result: easier for customers to find the restaurant and view the menu.",
      icon: <Globe className="w-10 h-10" />,
      img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          subtitle="Sample Results & Example Projects" 
          title="Results Restaurants Can Achieve" 
        />
        
        <p className="text-center text-brand-green/60 text-xl max-w-3xl mx-auto mb-20 -mt-10">
          These are example outcomes based on common restaurant marketing improvements.
        </p>

        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {results.map((r, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group bg-brand-cream rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-brand-green/5"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={r.img} 
                  alt={r.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-accent shadow-lg">
                  {r.icon}
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-serif font-bold text-brand-green mb-4">{r.title}</h3>
                <p className="text-brand-green/70 mb-6 leading-relaxed">
                  {r.desc}
                </p>
                <div className="p-6 bg-brand-accent/10 rounded-2xl border border-brand-accent/20">
                  <p className="text-brand-green font-bold text-sm uppercase tracking-wider mb-2 opacity-50">Outcome</p>
                  <p className="text-brand-green font-bold italic">
                    {r.outcome}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center space-y-12">
          <p className="text-brand-green/50 italic text-lg max-w-2xl mx-auto">
            “Results depend on each restaurant’s current online presence. Contact us for a free audit to see how your restaurant can improve.”
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <a 
              href="#contact" 
              className="px-10 py-6 bg-brand-green text-brand-cream rounded-2xl font-bold text-xl hover:bg-brand-brown transition-all shadow-2xl shadow-brand-green/20 flex items-center gap-3 group"
            >
              Get Your Free Restaurant Online Audit
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
            <div className="flex items-center gap-4 text-brand-green font-bold text-lg">
              <div className="w-10 h-10 bg-brand-accent/20 rounded-full flex items-center justify-center text-brand-accent">
                <Phone size={18} />
              </div>
              <span>WhatsApp / Phone: +91 6209009255</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RestaurantGallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1476224489421-aba8c155111a?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1484723088339-323833995281?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=600"
  ];

  return (
    <section className="py-32 bg-brand-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <SectionHeading 
          subtitle="Visual Showcase" 
          title="Capturing the Essence of Ranchi's Finest Dining" 
        />
      </div>
      
      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {[...images, ...images].map((img, i) => (
          <div key={i} className="w-[300px] h-[400px] flex-shrink-0 rounded-[2.5rem] overflow-hidden shadow-xl">
            <img 
              src={img} 
              alt="Restaurant Food" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
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
            <h3 className="text-4xl font-serif font-bold mb-10">Request Audit</h3>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40">Your Name</label>
                  <input type="text" className="w-full px-8 py-5 bg-brand-cream rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/20 transition-all font-medium" placeholder="John Doe" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40">Restaurant Name</label>
                  <input type="text" className="w-full px-8 py-5 bg-brand-cream rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/20 transition-all font-medium" placeholder="The Ranchi Bistro" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest opacity-40">Phone Number</label>
                <input type="tel" className="w-full px-8 py-5 bg-brand-cream rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/20 transition-all font-medium" placeholder="+91 00000 00000" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest opacity-40">Your Message</label>
                <textarea rows={4} className="w-full px-8 py-5 bg-brand-cream rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/20 transition-all font-medium" placeholder="How can we help you grow?" />
              </div>
              <button className="w-full py-6 bg-brand-green text-brand-cream rounded-2xl font-bold text-xl hover:bg-brand-brown transition-all shadow-2xl shadow-brand-green/20 flex items-center justify-center gap-3">
                Send Audit Request
                <ArrowRight />
              </button>
            </form>
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
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 100 }}
      className="fixed bottom-10 right-10 z-50 flex items-center gap-4"
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="hidden md:block bg-white px-6 py-3 rounded-2xl shadow-xl border border-brand-green/5 font-bold text-brand-green"
      >
        Chat with us! 🚀
      </motion.div>
      
      <motion.a
        href="https://wa.me/916209009255"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-20 h-20 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(37,211,102,0.4)] hover:shadow-[#25D366]/60 transition-all group"
      >
        <MessageCircle className="w-10 h-10 fill-current" />
        
        {/* Animated rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-10 delay-300" />
        
        {/* Notification dot */}
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-white z-10" />
      </motion.a>
    </motion.div>
  );
};

export default function App() {
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
    </div>
  );
}
