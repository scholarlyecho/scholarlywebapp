'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles, ArrowRight, CheckCircle2, Clock, Users, Brain,
  Trophy, GraduationCap, Briefcase, Star, Shield, Zap,
  Calendar, MessageCircle, Award, Target, Gift, Rocket, Heart
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FreeTrialForm from '@/components/FreeTrialForm';

const benefits = [
  { icon: Brain, title: 'Personal skill assessment', desc: 'A guided evaluation that maps your child to the perfect Coders Ladder level — not a generic age bracket.', gradient: 'from-brand-500 to-purple-600' },
  { icon: Users, title: 'Meet a real mentor', desc: 'A 1-on-1 session with a vetted engineer or AI practitioner from companies like Google, Microsoft, and Stripe.', gradient: 'from-pink-500 to-rose-500' },
  { icon: Target, title: 'Custom pathway plan', desc: 'Walk away with a clear roadmap — coding, AI, no-code, scholarships and competitions tailored to your child.', gradient: 'from-emerald-500 to-teal-600' },
  { icon: MessageCircle, title: 'Every question answered', desc: 'Pricing, schedule, format, age fit, sibling discounts. No pressure, no commitment, no hidden agenda.', gradient: 'from-amber-400 to-orange-500' },
];

const what = [
  { n: '01', icon: Gift, title: 'You book in 60 seconds', desc: 'Fill out the form — parent details, student DOB, country, plus your contact + availability preferences.' },
  { n: '02', icon: MessageCircle, title: 'We confirm within 24 hours', desc: 'Our admissions team emails (or calls — your choice) to confirm your slot and pre-assess fit.' },
  { n: '03', icon: Brain, title: 'Live 30-min assessment', desc: 'Your child meets a mentor on Zoom for a guided, age-appropriate skill check + an interactive challenge.' },
  { n: '04', icon: Rocket, title: 'Get your custom plan', desc: 'You receive a written pathway with recommended level, format, schedule, and pricing — yours to keep.' },
];

const audience = [
  { icon: GraduationCap, title: 'Curious beginners', age: 'Ages 5–10', desc: 'No experience needed. We start with visual coding (Scratch, Blockly) and storytelling.', gradient: 'from-teal-400 to-emerald-500' },
  { icon: Brain, title: 'Aspiring builders', age: 'Ages 11–14', desc: 'Ready for Python, web dev, mobile apps, and the no-code creator pathway.', gradient: 'from-brand-400 to-blue-500' },
  { icon: Trophy, title: 'Ambitious teens', age: 'Ages 15+', desc: 'AI Developer, Product Builder, competition prep and scholarship-ready portfolios.', gradient: 'from-violet-500 to-purple-600' },
  { icon: Briefcase, title: 'Career-focused families', age: 'All ages', desc: 'Looking for serious outcomes — internships, portfolio reviews, and career mentorship.', gradient: 'from-pink-500 to-rose-500' },
];

const faqs = [
  { q: 'Is this really 100% free?', a: 'Yes. The assessment class is completely free, takes about 30 minutes on Zoom, and there is zero obligation to enroll afterward. No credit card required.' },
  { q: 'How is this different from a free demo?', a: "A demo shows you a class. Our assessment evaluates your child's skills, learning style and goals — then produces a personalized written pathway you keep, even if you never enroll." },
  { q: 'Who runs the assessment?', a: 'A vetted ScholarlyEcho mentor — typically a working software engineer, AI practitioner, or experienced educator. All mentors are background-checked and trained for child safety.' },
  { q: 'How soon can I get a slot?', a: 'Most families are scheduled within 2–5 days. If you select "Immediately" on the form, we prioritize next-available slots and reach out within hours.' },
  { q: 'What if my child is shy or nervous?', a: "Totally normal. Our mentors are experienced with first-timers and adapt the session to your child's comfort level. Parents are welcome to sit in." },
  { q: 'Do you offer assessments for siblings?', a: "Yes — book one form per child, or mention it in your first session and we'll arrange the others. Sibling discounts apply if you later enroll multiple children." },
];

const testimonials = [
  { name: 'Amina D.', role: 'Parent · Senegal', flag: '🇸🇳', quote: 'The free class blew us away. Our mentor was kind, professional, and genuinely cared about our son\'s journey.' },
  { name: 'Rachel T.', role: 'Parent · USA', flag: '🇺🇸', quote: 'Best 30 minutes we\'ve spent in months. We left with a clear plan and zero pressure to enroll.' },
  { name: 'Kwame A.', role: 'Parent · Ghana', flag: '🇬🇭', quote: 'They assessed Joy where she actually was — not where her age said she should be. Game changer.' },
  { name: 'Fatima G.', role: 'Parent · Kenya', flag: '🇰🇪', quote: 'A real mentor, a real challenge, real feedback. This is what other "free trials" wish they were.' },
];

function FloatingChip({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute glass rounded-2xl shadow-2xl border border-white/12 ${className}`}>
      {children}
    </motion.div>
  );
}

export default function AssessmentClassPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="overflow-hidden">

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center pt-28 pb-16 noise-overlay overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>

        {/* Ambient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.18]"
            style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, -25, 0], y: [0, 15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-[5%] right-[10%] w-[420px] h-[420px] rounded-full opacity-[0.13]"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)' }} />
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute top-[55%] left-[30%] w-[300px] h-[300px] rounded-full opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />

          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

          {/* Stars */}
          {[...Array(28)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-white"
              style={{
                width: `${0.8 + Math.random() * 1.5}px`,
                height: `${0.8 + Math.random() * 1.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.05,
              }}
              animate={{ opacity: [0.05, Math.random() * 0.5 + 0.15, 0.05] }}
              transition={{ duration: 2 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4 }} />
          ))}

          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.4) 30%, rgba(168,85,247,0.5) 50%, rgba(236,72,153,0.4) 70%, transparent 100%)' }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">

              {/* Left copy */}
              <div className="relative">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-[13px] font-semibold mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  100% FREE · No Credit Card · No Obligation
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="text-[2.2rem] sm:text-[3rem] md:text-[3.6rem] lg:text-[4.4rem] font-extrabold text-white leading-[1.05] tracking-[-0.04em] mb-6"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Try a Class.
                  <br />
                  <span className="gradient-text-animated">Get a Plan.</span>
                  <br />
                  <span className="text-white/90">For Free.</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                  className="text-white/55 text-[1rem] sm:text-[1.05rem] leading-[1.8] mb-8 max-w-[520px]">
                  A free, no-obligation 30-minute assessment with a certified ScholarlyEcho mentor.
                  We&apos;ll evaluate your child&apos;s skills, recommend the perfect Coders Ladder pathway,
                  and answer every question — before you commit to anything.
                </motion.p>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="space-y-3 mb-9">
                  {[
                    'Personalized skill evaluation in 30 minutes',
                    '1-on-1 with a world-class mentor',
                    'Custom learning pathway you keep, free',
                    'Competition & scholarship roadmap included',
                  ].map((t, i) => (
                    <motion.div key={t}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className="flex items-center gap-3 text-white/75 text-[14px]">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                      </div>
                      {t}
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                  className="grid grid-cols-3 gap-3 max-w-md mb-8">
                  {[
                    { n: '30 min', l: 'Class duration' },
                    { n: '24 hrs', l: 'Confirmation' },
                    { n: '$0', l: 'Total cost' },
                  ].map(({ n, l }, i) => (
                    <motion.div key={l}
                      whileHover={{ y: -3, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ transitionDelay: `${0.9 + i * 0.08}s` }}
                      className="glass rounded-2xl p-3.5 text-center border border-white/8">
                      <div className="text-lg font-extrabold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{n}</div>
                      <div className="text-white/45 text-[11px] mt-0.5 font-medium">{l}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Social proof */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}
                  className="flex flex-wrap items-center gap-3 sm:gap-5">
                  <div className="flex -space-x-2.5">
                    {[['AM', '#6e42ff'], ['TK', '#f59e0b'], ['FO', '#10b981'], ['AJ', '#ec4899'], ['ND', '#3b82f6']].map(([init, bg], i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0d1333] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: bg as string }}>
                        {init}
                      </div>
                    ))}
                  </div>
                  <div className="text-white/50 text-[13px]">
                    <span className="text-white font-bold">200+</span> families this month
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                    <span className="text-white/50 text-[13px] ml-1.5">4.9/5</span>
                  </div>
                </motion.div>
              </div>

              {/* Right form with floating chips */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                id="book"
                className="relative">

                <FloatingChip className="-top-3 -left-3 px-3.5 py-2.5 text-white z-20 hidden md:block" delay={0.9}>
                  <div className="flex items-center gap-2 text-[12px]">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                      <Gift className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-bold text-emerald-300 text-[11px]">Free, no card</div>
                      <div className="text-white/50 text-[10px]">Truly $0 to try</div>
                    </div>
                  </div>
                </FloatingChip>

                <FloatingChip className="-bottom-3 -right-3 px-3.5 py-2.5 text-white z-20 hidden md:block" delay={1.1}>
                  <div className="flex items-center gap-2 text-[12px]">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-300 text-[11px]">Scholarship-ready</div>
                      <div className="text-white/50 text-[10px]">$380K+ earned by alumni</div>
                    </div>
                  </div>
                </FloatingChip>

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                  <FreeTrialForm />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ WHAT YOU GET ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Award className="w-3.5 h-3.5" /> What You Get
            </div>
            <h2 className="section-heading mb-5 max-w-3xl mx-auto">
              More Than a Demo — A <span className="gradient-text-animated">Real Assessment</span>
            </h2>
            <p className="section-subheading mx-auto">
              Every free class is built around your child. You leave with insight, a custom plan, and zero pressure.
            </p>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map(({ icon: Icon, title, desc, gradient }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="premium-card group relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.16] transition-opacity duration-700 bg-gradient-to-br ${gradient}`} />
                <motion.div whileHover={{ rotate: -5, scale: 1.08 }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient} shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="font-bold text-slate-900 mb-2 text-[15px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Clock className="w-3.5 h-3.5" /> How It Works
            </div>
            <h2 className="section-heading mb-5">From Form to <span className="gradient-text">Class</span> in 4 Steps</h2>
            <p className="section-subheading mx-auto">A simple, transparent process — designed around busy parents and excited learners.</p>
          </SectionWrapper>

          <div className="relative">
            {/* Animated connector line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[2px] origin-left"
              style={{ background: 'linear-gradient(90deg, #6e42ff, #a855f7, #ec4899, #f59e0b)' }} />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
              {what.map(({ n, icon: Icon, title, desc }, i) => (
                <motion.div key={n}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  className="relative">
                  {/* Step circle */}
                  <div className="relative flex justify-center mb-5">
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 6 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-24 h-24 rounded-full bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center relative z-10">
                      <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-brand-500 via-purple-600 to-pink-500 flex items-center justify-center">
                        <Icon className="w-9 h-9 text-white" />
                      </div>
                    </motion.div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-brand-500 flex items-center justify-center text-[12px] font-extrabold text-brand-600 shadow-md">
                      {n}
                    </div>
                  </div>
                  <div className="text-center px-2">
                    <h3 className="font-bold text-slate-900 mb-2 text-[15px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                    <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ AUDIENCE ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <SectionWrapper className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">
              <Users className="w-3.5 h-3.5" /> Who It&apos;s For
            </div>
            <h2 className="section-heading mb-5">Every Learner. Every Stage.</h2>
            <p className="section-subheading mx-auto">From wide-eyed first-timers to ambitious teens prepping for international competitions and scholarships.</p>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {audience.map(({ icon: Icon, title, age, desc, gradient }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="premium-card group relative overflow-hidden">
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.18] transition-opacity duration-700 bg-gradient-to-br ${gradient}`} />
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -4 }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient} shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">{age}</div>
                <h3 className="font-bold text-slate-900 mb-2 text-[15px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL MARQUEE ═══ */}
      <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden noise-overlay"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 50%, #0c1a2e 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10 mb-10">
          <SectionWrapper className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-[13px] font-medium mb-5">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Loved by parents worldwide
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight tracking-[-0.02em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Real reviews from <span className="gradient-text-animated">real families</span>
            </h2>
          </SectionWrapper>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #0a1027 0%, transparent 100%)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #0a1027 0%, transparent 100%)' }} />

          <div className="flex animate-marquee gap-5 whitespace-normal">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i}
                className="flex-shrink-0 w-[320px] sm:w-[360px] glass rounded-2xl p-5 border border-white/8">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-white/75 text-[13px] leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-white/8">
                  <div className="text-xl">{t.flag}</div>
                  <div>
                    <div className="text-white font-bold text-[12px]">{t.name}</div>
                    <div className="text-white/40 text-[10px]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST RIBBON ═══ */}
      <section className="py-12 sm:py-14 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {[
              { icon: Shield, label: 'Background-checked mentors', color: 'text-brand-500' },
              { icon: Star, label: '4.9/5 from 1,200+ families', color: 'text-amber-500' },
              { icon: Zap, label: '30-min focused session', color: 'text-purple-500' },
              { icon: Calendar, label: 'Schedule that fits you', color: 'text-emerald-500' },
            ].map(({ icon: Icon, label, color }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-[13px] font-semibold">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQs ═══ */}
      <section className="py-16 sm:py-20 md:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <SectionWrapper className="text-center mb-12">
            <div className="section-tag mx-auto mb-5">
              <MessageCircle className="w-3.5 h-3.5" /> Common Questions
            </div>
            <h2 className="section-heading mb-4">Quick <span className="gradient-text">Answers</span></h2>
          </SectionWrapper>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <motion.details key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="premium-card group cursor-pointer open:ring-2 open:ring-brand-200">
                <summary className="flex items-center justify-between font-semibold text-slate-800 cursor-pointer list-none select-none text-[15px]">
                  {q}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform duration-200 flex-shrink-0 ml-4" />
                </summary>
                <p className="mt-3 text-slate-500 text-[13px] leading-relaxed border-t border-slate-100 pt-3">{a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 sm:py-24 md:py-32 relative overflow-hidden noise-overlay text-center"
        style={{ background: 'linear-gradient(165deg, #070c1b 0%, #10082e 40%, #0d1333 60%, #070c1b 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(110,66,255,0.3) 30%, rgba(168,85,247,0.4) 50%, rgba(236,72,153,0.3) 70%, transparent 100%)' }} />

        <div className="max-w-2xl mx-auto px-5 relative z-10">
          <SectionWrapper>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-8"
              style={{ boxShadow: '0 0 80px rgba(110,66,255,0.4), 0 0 160px rgba(110,66,255,0.15)' }}>
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-[-0.02em]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Ready to see what your child can <span className="gradient-text-animated">build?</span>
            </h2>
            <p className="text-white/55 text-base sm:text-lg mb-10 leading-relaxed">
              Book a free assessment class. No card. No commitment. Just clarity.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
              <Link href="#book"
                className="group inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl font-bold text-white text-[15px] sm:text-[16px] gradient-bg hover:-translate-y-1 transition-all duration-300"
                style={{ boxShadow: '0 8px 40px rgba(110,66,255,0.45), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                Book Free Class <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/learning-hub"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-semibold text-white/80 text-[15px] sm:text-[16px] bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-white/15 transition-all duration-300">
                Explore Programs
              </Link>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </div>
  );
}
