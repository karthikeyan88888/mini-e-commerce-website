import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Volume2,
  Sparkles,
  Sliders,
  Shield,
  Layers,
  RotateCcw,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { getProductImageUrl, getCategoryFallback } from '../utils/productImages';
import {
  ListeningAnswers,
  ContextSelection,
  ListeningProfile,
  ProductMatch,
  calculateListeningProfile,
  calculateProductMatches,
  getRecommendedDuo,
} from '../utils/listeningLabRules';

type LabStage =
  | 'HERO'
  | 'QUESTIONS'
  | 'PROFILE_RESULT'
  | 'CONTEXT'
  | 'TRANSITION'
  | 'MATCH'
  | 'DUO'
  | 'COMPLETE';

export const ListeningLabPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, openDrawer } = useCart();

  // Products from API
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Stage Management
  const [stage, setStage] = useState<LabStage>('HERO');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Selections
  const [answers, setAnswers] = useState<Partial<ListeningAnswers>>({});
  const [context, setContext] = useState<ContextSelection>({ primary: 'HOME' });
  const [hasSelectedPrimary, setHasSelectedPrimary] = useState(false);

  // Computed Engine Results
  const [profile, setProfile] = useState<ListeningProfile | null>(null);
  const [matches, setMatches] = useState<ProductMatch[]>([]);
  const [duoHeadphone, setDuoHeadphone] = useState<Product | null>(null);
  const [duoEarbud, setDuoEarbud] = useState<Product | null>(null);

  // Duo Change Modals
  const [isChangingHeadphone, setIsChangingHeadphone] = useState(false);
  const [isChangingEarbud, setIsChangingEarbud] = useState(false);

  // Cart Action Feedback
  const [cartAddingId, setCartAddingId] = useState<string | null>(null);
  const [addedItemSuccessId, setAddedItemSuccessId] = useState<string | null>(null);
  const [isAddingDuo, setIsAddingDuo] = useState(false);
  const [duoAddedSuccess, setDuoAddedSuccess] = useState(false);

  // Fetch Real Products
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setIsLoadingProducts(true);
        const res = await api.get('/products');
        const prods: Product[] = res.data.products || res.data.data || res.data || [];
        if (isMounted) {
          setProducts(prods);
        }
      } catch (err) {
        console.error('Failed to load products for Listening Lab:', err);
      } finally {
        if (isMounted) setIsLoadingProducts(false);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Questions Definition (One at a time)
  const questions = [
    {
      id: 'listenTo',
      title: 'WHAT DO YOU LISTEN TO MOST?',
      subtitle: 'Select your primary acoustic medium.',
      options: [
        { label: 'Music', desc: 'High-fidelity dynamics & instrumental timbre' },
        { label: 'Gaming', desc: 'Positional spatial awareness & ultra-low latency' },
        { label: 'Movies', desc: 'Cinematic sub-bass rumble & expansive soundstage' },
        { label: 'Podcasts', desc: 'Intelligible vocal clarity & natural mid-band' },
      ],
    },
    {
      id: 'where',
      title: 'WHERE DO YOU LISTEN MOST?',
      subtitle: 'Identify your most frequent acoustic environment.',
      options: [
        { label: 'Home', desc: 'Stationary desktop, dedicated listening lounge' },
        { label: 'Office', desc: 'Open-floor plan, deep work & collaboration' },
        { label: 'Commute', desc: 'Urban transit, train, subway locomotion' },
        { label: 'Travel', desc: 'Long flights, hotel sessions & international transit' },
      ],
    },
    {
      id: 'priority',
      title: 'WHAT MATTERS MOST?',
      subtitle: 'Define your personal sound philosophy.',
      options: [
        { label: 'Deep Bass', desc: 'Visceral sub-bass slam with textured physical impact' },
        { label: 'Balance', desc: 'Neutral reference curve with harmonic honesty' },
        { label: 'Detail', desc: 'Micro-transients, planar speed & high resolution' },
        { label: 'Immersion', desc: 'Expansive 3D spatial acoustic envelope' },
      ],
    },
    {
      id: 'portability',
      title: 'HOW IMPORTANT IS PORTABILITY?',
      subtitle: 'Balance chassis size against mobility.',
      options: [
        { label: 'Low', desc: 'Stationary desktop reference listening' },
        { label: 'Medium', desc: 'Move fluidly between desk, couch, and bag' },
        { label: 'High', desc: 'Ultra-compact, pocket-ready at all times' },
      ],
    },
    {
      id: 'sessionLength',
      title: 'HOW LONG ARE YOUR LISTENING SESSIONS?',
      subtitle: 'Determines ergonomic clamp pressure and battery weight.',
      options: [
        { label: 'Short', desc: '30–60 minutes (quick transit or quick calls)' },
        { label: 'Medium', desc: '1–3 hours (daily albums or focused sprints)' },
        { label: 'Long', desc: '4+ hours (all-day master tracks or deep flow)' },
      ],
    },
  ];

  // Current Question
  const currentQ = questions[currentQuestionIndex];
  const currentAnswerKey = currentQ?.id as keyof ListeningAnswers;
  const currentSelectedValue = answers[currentAnswerKey];

  // Context Choices
  const contextOptions: { id: ContextSelection['primary']; label: string; desc: string }[] = [
    { id: 'COMMUTE', label: 'COMMUTE', desc: 'Transit & urban locomotion' },
    { id: 'FOCUS', label: 'FOCUS', desc: 'Deep intellectual flow' },
    { id: 'WORK', label: 'WORK', desc: 'Hybrid calls & collaborative desk' },
    { id: 'TRAVEL', label: 'TRAVEL', desc: 'Flights & long transits' },
    { id: 'HOME', label: 'HOME', desc: 'Evening vinyl & sofa relaxation' },
    { id: 'GAMING', label: 'GAMING', desc: 'Low-latency spatial awareness' },
    { id: 'RELAX', label: 'RELAX', desc: 'Late night warm acoustic unwind' },
  ];

  // Question navigation
  const handleSelectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentAnswerKey]: value }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // All 5 answered: compute profile
      const fullAnswers = answers as ListeningAnswers;
      const genProfile = calculateListeningProfile(fullAnswers);
      setProfile(genProfile);
      setStage('PROFILE_RESULT');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setStage('HERO');
    }
  };

  // Context Selection Handler
  const handleContextClick = (item: ContextSelection['primary']) => {
    if (!hasSelectedPrimary || context.primary === item) {
      setContext({ primary: item, secondary: undefined });
      setHasSelectedPrimary(true);
    } else {
      // Toggle secondary
      if (context.secondary === item) {
        setContext((prev) => ({ ...prev, secondary: undefined }));
      } else {
        setContext((prev) => ({ ...prev, secondary: item }));
      }
    }
  };

  // Trigger Context Transition -> Match
  const handleProceedToMatch = () => {
    setStage('TRANSITION');
    setTimeout(() => {
      const fullAnswers = answers as ListeningAnswers;
      const calculatedMatches = calculateProductMatches(products, fullAnswers, context);
      const duo = getRecommendedDuo(products, fullAnswers, context);
      setMatches(calculatedMatches);
      setDuoHeadphone(duo.headphone);
      setDuoEarbud(duo.earbud);
      setStage('MATCH');
    }, 1200);
  };

  // Add individual product to cart
  const handleAddToCart = async (product: Product) => {
    setCartAddingId(product.id);
    const res = await addToCart(product.id, 1);
    setCartAddingId(null);
    if (res.success) {
      setAddedItemSuccessId(product.id);
      setTimeout(() => setAddedItemSuccessId(null), 2500);
    } else if (res.message && res.message.toLowerCase().includes('log in')) {
      navigate('/login');
    }
  };

  // Add Duo to cart
  const handleAddDuoToCart = async () => {
    if (!duoHeadphone || !duoEarbud) return;
    setIsAddingDuo(true);
    const res1 = await addToCart(duoHeadphone.id, 1);
    const res2 = await addToCart(duoEarbud.id, 1);
    setIsAddingDuo(false);

    if (res1.success || res2.success) {
      setDuoAddedSuccess(true);
      setTimeout(() => setDuoAddedSuccess(false), 3000);
    } else if (
      (res1.message && res1.message.toLowerCase().includes('log in')) ||
      (res2.message && res2.message.toLowerCase().includes('log in'))
    ) {
      navigate('/login');
    }
  };

  // Restart Journey
  const handleRestart = () => {
    setAnswers({});
    setContext({ primary: 'HOME' });
    setHasSelectedPrimary(false);
    setCurrentQuestionIndex(0);
    setProfile(null);
    setMatches([]);
    setDuoHeadphone(null);
    setDuoEarbud(null);
    setStage('HERO');
  };

  // Progress Bar Steps Definition
  const progressSteps = [
    { id: 'LISTENING', label: '01 LISTENING', active: stage === 'QUESTIONS' || stage === 'PROFILE_RESULT' || stage === 'HERO' },
    { id: 'CONTEXT', label: '02 CONTEXT', active: stage === 'CONTEXT' || stage === 'TRANSITION' },
    { id: 'MATCH', label: '03 MATCH', active: stage === 'MATCH' },
    { id: 'DUO', label: '04 DUO', active: stage === 'DUO' || stage === 'COMPLETE' },
  ];

  // Helper for metric bar rendering
  const renderMetricBar = (label: string, value: number) => {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-white/60 tracking-wider uppercase">{label}</span>
          <span className="text-copper font-bold">{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-copper/80 to-champagne rounded-full transition-all duration-700 ease-out"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* 1. Global Centered Header & Progress System */}
      <div className="w-full max-w-4xl mx-auto mb-10 text-center">
        {/* Top Laboratory Brand Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-copper/10 border border-copper/30 text-copper font-mono text-[10px] tracking-[0.25em] uppercase font-bold mb-3 shadow-[0_0_15px_rgba(200,131,74,0.15)]">
          <Sparkles className="w-3 h-3 text-copper" />
          <span>NEXORO LISTENING LAB</span>
        </div>

        <h1 className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-white/50 mb-6">
          ACOUSTIC PROFILING & HARDWARE SYNTHESIS
        </h1>

        {/* Unified 4-Step Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto border-b border-white/[0.08] pb-4">
          {progressSteps.map((step, idx) => {
            const stepOrder = ['LISTENING', 'CONTEXT', 'MATCH', 'DUO'];
            const currentOrder =
              stage === 'HERO' || stage === 'QUESTIONS' || stage === 'PROFILE_RESULT'
                ? 0
                : stage === 'CONTEXT' || stage === 'TRANSITION'
                ? 1
                : stage === 'MATCH'
                ? 2
                : 3;
            const isCompleted = idx < currentOrder;
            const isCurrent = idx === currentOrder;

            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5">
                <span
                  className={`text-[9px] sm:text-[11px] font-mono tracking-wider uppercase transition-colors ${
                    isCurrent
                      ? 'text-copper font-bold'
                      : isCompleted
                      ? 'text-white/80'
                      : 'text-white/30'
                  }`}
                >
                  {step.label}
                </span>
                <div
                  className={`h-0.5 w-full rounded-full transition-all duration-500 ${
                    isCurrent
                      ? 'bg-copper shadow-[0_0_10px_#c8834a]'
                      : isCompleted
                      ? 'bg-white/40'
                      : 'bg-white/[0.08]'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Centered Application Shell */}
      <main className="w-full max-w-3xl mx-auto flex-1 flex flex-col items-center justify-center">
        {/* ========================================================================= */}
        {/* STAGE 0: HERO OPENING SCREEN */}
        {/* ========================================================================= */}
        {stage === 'HERO' && (
          <div className="w-full p-8 sm:p-14 rounded-2xl bg-[#0b0c10] border border-white/[0.08] text-center shadow-2xl relative overflow-hidden animate-fade-in">
            {/* Subtle Copper Ambient Backdrop Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-copper/10 blur-[100px] pointer-events-none rounded-full" />

            <div className="relative z-10 max-w-xl mx-auto space-y-6">
              <span className="inline-block px-3 py-1 rounded bg-white/[0.04] border border-white/10 text-[10px] font-mono tracking-[0.2em] text-champagne uppercase font-bold">
                4 STEPS &bull; LESS THAN A MINUTE
              </span>

              <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white leading-[1.1] uppercase">
                YOUR LISTENING.<br />
                YOUR CONTEXT.<br />
                <span className="text-copper">YOUR NEXORO.</span>
              </h2>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans max-w-md mx-auto">
                Tell us how you listen. We&apos;ll help you discover the right NEXORO acoustic architecture.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setStage('QUESTIONS')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-copper hover:bg-copper-hover text-black font-headline font-extrabold text-xs tracking-[0.2em] uppercase transition-all shadow-xl shadow-copper/20 hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>BEGIN DISCOVERY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-center gap-6 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                <span>Deterministic Precision</span>
                <span>&bull;</span>
                <span>Transparent Matching</span>
                <span>&bull;</span>
                <span>Zero AI Claims</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 1: QUESTIONS (ONE AT A TIME) */}
        {/* ========================================================================= */}
        {stage === 'QUESTIONS' && (
          <div className="w-full p-6 sm:p-12 rounded-2xl bg-[#0b0c10] border border-white/[0.08] shadow-2xl relative animate-fade-in flex flex-col justify-between min-h-[520px]">
            {/* Question Header & Counter */}
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-6">
                <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold">
                  STEP 01 &bull; ACOUSTIC PROFILE
                </span>
                <span className="text-xs font-mono text-white/50 font-bold">
                  QUESTION {currentQuestionIndex + 1} OF {questions.length}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-headline tracking-tight text-white uppercase mb-2">
                {currentQ.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mb-8 font-sans">
                {currentQ.subtitle}
              </p>

              {/* Interactive Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentQ.options.map((opt) => {
                  const isSelected = currentSelectedValue === opt.label;
                  return (
                    <button
                      key={opt.label}
                      data-lab-option={opt.label}
                      onClick={() => handleSelectOption(opt.label)}
                      className={`text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#15161d] border-copper shadow-[0_0_18px_rgba(200,131,74,0.22)] ring-1 ring-copper/60'
                          : 'bg-[#0f1015] border-white/[0.08] hover:border-white/20 hover:bg-[#121319]'
                      }`}
                    >
                      <div className="space-y-1">
                        <span
                          className={`text-sm sm:text-base font-headline font-bold block ${
                            isSelected ? 'text-white' : 'text-white/80'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                          {opt.desc}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? 'bg-copper border-copper text-black'
                            : 'border-white/20 bg-black/40'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="pt-8 mt-8 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={handlePrevQuestion}
                className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-white/25 text-white/70 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK</span>
              </button>

              <button
                data-lab-next
                onClick={handleNextQuestion}
                disabled={!currentSelectedValue}
                className="px-6 py-2.5 rounded-lg bg-copper hover:bg-copper-hover disabled:opacity-30 disabled:pointer-events-none text-black font-headline font-extrabold text-xs tracking-[0.15em] uppercase flex items-center gap-2 transition-all shadow-md shadow-copper/20 cursor-pointer"
              >
                <span>{currentQuestionIndex === questions.length - 1 ? 'GENERATE PROFILE' : 'NEXT'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 1.5: DETERMINISTIC LISTENING PROFILE RESULT */}
        {/* ========================================================================= */}
        {stage === 'PROFILE_RESULT' && profile && (
          <div className="w-full p-6 sm:p-12 rounded-2xl bg-[#0b0c10] border border-white/[0.08] shadow-2xl relative animate-fade-in space-y-8">
            <div className="border-b border-white/[0.06] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-1">
                  DISCOVERY PROFILE SYNTHESIZED
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-headline tracking-tight text-white uppercase">
                  {profile.title}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-copper/15 border border-copper/30 flex items-center justify-center text-copper">
                <Volume2 className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-copper font-mono tracking-wider uppercase font-semibold">
                &ldquo;{profile.tagline}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                {profile.description}
              </p>
            </div>

            {/* Restrained Metric Bars */}
            <div className="p-6 rounded-xl bg-[#0f1015] border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
                <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
                  ACOUSTIC METRIC BALANCE
                </span>
                <span className="text-[10px] font-mono text-white/30">
                  RULES-BASED CALIBRATION
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderMetricBar('Immersion', profile.metrics.immersion)}
                {renderMetricBar('Detail & Resolution', profile.metrics.detail)}
                {renderMetricBar('Portability', profile.metrics.portability)}
                {renderMetricBar('Acoustic Isolation', profile.metrics.isolation)}
              </div>
              {renderMetricBar('Low-End Bass Dynamics', profile.metrics.bass)}
            </div>

            <p className="text-[11px] font-mono text-white/40 text-center">
              Built deterministically from your listening preferences.
            </p>

            {/* Action Bar */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={() => setStage('QUESTIONS')}
                className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-white/25 text-white/70 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ADJUST ANSWERS</span>
              </button>

              <button
                onClick={() => setStage('CONTEXT')}
                className="px-7 py-3 rounded-lg bg-copper hover:bg-copper-hover text-black font-headline font-extrabold text-xs tracking-[0.18em] uppercase flex items-center gap-2 transition-all shadow-lg shadow-copper/25 hover:scale-[1.02] cursor-pointer"
              >
                <span>CONTINUE TO CONTEXT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: CONTEXT SELECTION */}
        {/* ========================================================================= */}
        {stage === 'CONTEXT' && (
          <div className="w-full p-6 sm:p-12 rounded-2xl bg-[#0b0c10] border border-white/[0.08] shadow-2xl relative animate-fade-in flex flex-col justify-between min-h-[520px]">
            <div>
              <div className="border-b border-white/[0.06] pb-3 mb-6 flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold">
                  STEP 02 &bull; OPERATIONAL CONTEXT
                </span>
                <span className="text-xs font-mono text-white/50">
                  PRIMARY + OPTIONAL SECONDARY
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-headline tracking-tight text-white uppercase mb-2">
                WHERE WILL YOU USE IT?
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mb-6 font-sans">
                Choose the moment that matters most to your listening lifestyle.
              </p>

              {/* Context Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {contextOptions.map((opt) => {
                  const isPrimary = context.primary === opt.id;
                  const isSecondary = context.secondary === opt.id;
                  const isSelected = isPrimary || isSecondary;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleContextClick(opt.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[105px] ${
                        isPrimary
                          ? 'bg-[#15161d] border-copper shadow-[0_0_15px_rgba(200,131,74,0.25)] ring-1 ring-copper/70'
                          : isSecondary
                          ? 'bg-[#13141a] border-champagne/40 text-champagne'
                          : 'bg-[#0f1015] border-white/[0.08] hover:border-white/20 hover:bg-[#121319]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-xs font-headline font-black tracking-wider uppercase ${
                            isSelected ? 'text-white' : 'text-white/80'
                          }`}
                        >
                          {opt.label}
                        </span>
                        {isPrimary && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-copper text-black uppercase">
                            PRIMARY
                          </span>
                        )}
                        {isSecondary && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-white/10 text-champagne uppercase">
                            2ND
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-white/50 leading-tight font-sans mt-2">
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-8 mt-8 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={() => setStage('PROFILE_RESULT')}
                className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-white/25 text-white/70 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK</span>
              </button>

              <button
                onClick={handleProceedToMatch}
                className="px-7 py-3 rounded-lg bg-copper hover:bg-copper-hover text-black font-headline font-extrabold text-xs tracking-[0.18em] uppercase flex items-center gap-2 transition-all shadow-lg shadow-copper/25 hover:scale-[1.02] cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2.5: FAST EDITORIAL CONTEXT TRANSITION */}
        {/* ========================================================================= */}
        {stage === 'TRANSITION' && (
          <div className="w-full p-12 sm:p-20 rounded-2xl bg-[#0b0c10] border border-white/[0.08] shadow-2xl text-center space-y-4 animate-fade-in">
            <div className="w-8 h-8 rounded-full border-2 border-copper/30 border-t-copper animate-spin mx-auto mb-4" />
            <span className="text-[11px] font-mono tracking-[0.25em] text-copper uppercase font-bold block">
              NOW WE KNOW HOW YOU LISTEN.
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-headline tracking-tight text-white uppercase">
              LET&apos;S FIND YOUR NEXORO MATCH.
            </h2>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: NEXORO MATCH (REAL PRODUCTS + TRANSPARENT REASONS) */}
        {/* ========================================================================= */}
        {stage === 'MATCH' && (
          <div className="w-full space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block">
                STEP 03 &bull; SYNTHESIS COMPLETE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-headline tracking-tight text-white uppercase">
                YOUR NEXORO MATCH
              </h2>
              <p className="text-xs sm:text-sm text-white/60 font-sans max-w-md mx-auto">
                Precision hardware matched to your profile and operational context.
              </p>
            </div>

            {/* Match Cards */}
            <div className="space-y-6">
              {matches.map((item, idx) => {
                const prod = item.product;
                const isPrimary = item.rank === 'PRIMARY';
                const canonicalImg = getProductImageUrl(prod);
                const isAdding = cartAddingId === prod.id;
                const isSuccess = addedItemSuccessId === prod.id;

                return (
                  <div
                    key={prod.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isPrimary
                        ? 'bg-[#0d0e13] border-copper shadow-2xl shadow-copper/15 ring-1 ring-copper/40 p-6 sm:p-8'
                        : 'bg-[#0a0b0f] border-white/[0.08] hover:border-white/20 p-5 sm:p-6'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-mono font-black tracking-widest uppercase ${
                            isPrimary
                              ? 'bg-copper text-black shadow-md shadow-copper/30'
                              : 'bg-white/10 text-white/80'
                          }`}
                        >
                          {item.rank} MATCH
                        </span>
                        <span className="text-[11px] font-mono text-white/40">
                          {prod.category === 'EARBUDS' ? 'WIRELESS EARBUDS' : prod.category}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-copper">
                        MATCH SCORE {item.score}
                      </span>
                    </div>

                    {/* Product Presentation Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Product Image */}
                      <div className="md:col-span-5 relative aspect-square rounded-xl bg-[#14151b] overflow-hidden border border-white/[0.06]">
                        <img
                          src={canonicalImg}
                          alt={prod.name}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            const target = e.currentTarget;
                            const fb = getCategoryFallback(prod.category);
                            if (target.src !== fb && !target.src.endsWith(fb)) {
                              target.src = fb;
                            }
                          }}
                        />
                      </div>

                      {/* Product Metadata & Why This Match */}
                      <div className="md:col-span-7 space-y-4">
                        <div>
                          <div className="flex items-baseline justify-between mb-1">
                            <h3 className="text-xl sm:text-2xl font-black font-headline text-white tracking-tight">
                              {prod.name}
                            </h3>
                            <span className="text-lg font-black font-headline text-copper">
                              ${prod.price.toFixed(2)}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            {prod.stock > 0 ? 'DISPATCH READY &bull; IN STOCK' : 'OUT OF STOCK'}
                          </span>
                        </div>

                        {/* WHY THIS MATCH Callout */}
                        <div className="p-4 rounded-xl bg-[#121319] border border-white/[0.06] space-y-1">
                          <span className="text-[9px] font-mono tracking-widest text-copper uppercase font-bold block">
                            WHY THIS MATCH
                          </span>
                          <p className="text-xs text-white/80 leading-relaxed font-sans">
                            {item.whyThisMatch}
                          </p>
                        </div>

                        {/* Compact Acoustic Metric Visual */}
                        <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[10px]">
                          <div className="p-2 rounded bg-black/40 border border-white/[0.04]">
                            <span className="text-white/40 block text-[8px] uppercase">PORTABILITY</span>
                            <span className="text-copper font-bold">{item.metrics.portability}%</span>
                          </div>
                          <div className="p-2 rounded bg-black/40 border border-white/[0.04]">
                            <span className="text-white/40 block text-[8px] uppercase">IMMERSION</span>
                            <span className="text-copper font-bold">{item.metrics.immersion}%</span>
                          </div>
                          <div className="p-2 rounded bg-black/40 border border-white/[0.04]">
                            <span className="text-white/40 block text-[8px] uppercase">ISOLATION</span>
                            <span className="text-copper font-bold">{item.metrics.isolation}%</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => handleAddToCart(prod)}
                            disabled={isAdding || prod.stock <= 0}
                            className="flex-1 py-3 px-4 rounded-xl bg-copper hover:bg-copper-hover disabled:opacity-40 text-black font-headline font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-copper/20 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {isSuccess ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>ADDED TO CART</span>
                              </>
                            ) : isAdding ? (
                              <span>ADDING...</span>
                            ) : (
                              <>
                                <ShoppingBag className="w-4 h-4" />
                                <span>ADD TO CART</span>
                              </>
                            )}
                          </button>

                          <Link
                            to={`/products/${prod.id}`}
                            className="py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-1.5 transition-colors"
                          >
                            <span>VIEW PRODUCT</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step Transition to DUO */}
            <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
              <button
                onClick={() => setStage('CONTEXT')}
                className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-white/25 text-white/70 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK TO CONTEXT</span>
              </button>

              <button
                onClick={() => setStage('DUO')}
                className="px-7 py-3 rounded-lg bg-copper hover:bg-copper-hover text-black font-headline font-extrabold text-xs tracking-[0.18em] uppercase flex items-center gap-2 transition-all shadow-lg shadow-copper/25 hover:scale-[1.02] cursor-pointer"
              >
                <span>PROCEED TO NEXORO DUO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 4: NEXORO DUO (HEADPHONE + EARBUD ECOSYSTEM) */}
        {/* ========================================================================= */}
        {stage === 'DUO' && duoHeadphone && duoEarbud && (
          <div className="w-full space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block">
                STEP 04 &bull; COMPLETE AUDIO SETUP
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-headline tracking-tight text-white uppercase">
                BUILD YOUR NEXORO DUO
              </h2>
              <p className="text-xs sm:text-sm text-white/60 font-sans max-w-md mx-auto">
                One for immersive listening. One for life on the move.
              </p>
            </div>

            {/* Duo 2-Column Presentation (Stacked on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT: IMMERSIVE LISTENING (HEADPHONE) */}
              <div className="p-6 rounded-2xl bg-[#0b0c10] border border-white/[0.08] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-copper uppercase font-bold">
                      IMMERSIVE LISTENING
                    </span>
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      HEADPHONE
                    </span>
                  </div>

                  <div className="aspect-[4/3] rounded-xl bg-[#14151b] overflow-hidden border border-white/[0.06] mb-4">
                    <img
                      src={getProductImageUrl(duoHeadphone)}
                      alt={duoHeadphone.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-lg font-headline font-black text-white">
                      {duoHeadphone.name}
                    </h3>
                    <span className="text-base font-headline font-bold text-copper">
                      ${duoHeadphone.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 font-sans line-clamp-2">
                    {duoHeadphone.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    IN STOCK &bull; DISPATCH READY
                  </span>
                  <button
                    onClick={() => setIsChangingHeadphone(true)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 text-[10px] font-mono text-white/80 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    CHANGE HEADPHONE
                  </button>
                </div>
              </div>

              {/* RIGHT: ON-THE-GO LISTENING (WIRELESS EARBUD) */}
              <div className="p-6 rounded-2xl bg-[#0b0c10] border border-white/[0.08] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-copper uppercase font-bold">
                      ON-THE-GO LISTENING
                    </span>
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      WIRELESS EARBUD
                    </span>
                  </div>

                  <div className="aspect-[4/3] rounded-xl bg-[#14151b] overflow-hidden border border-white/[0.06] mb-4">
                    <img
                      src={getProductImageUrl(duoEarbud)}
                      alt={duoEarbud.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-lg font-headline font-black text-white">
                      {duoEarbud.name}
                    </h3>
                    <span className="text-base font-headline font-bold text-copper">
                      ${duoEarbud.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 font-sans line-clamp-2">
                    {duoEarbud.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    IN STOCK &bull; DISPATCH READY
                  </span>
                  <button
                    onClick={() => setIsChangingEarbud(true)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 text-[10px] font-mono text-white/80 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    CHANGE EARBUD
                  </button>
                </div>
              </div>
            </div>

            {/* Duo Checkout Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#12131a] to-[#0c0d12] border border-copper/40 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
                <div>
                  <span className="text-[10px] font-mono text-copper uppercase tracking-widest font-bold block mb-1">
                    COMBINED ECOSYSTEM PRICING
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black font-headline text-white uppercase tracking-tight">
                    {duoHeadphone.name} + {duoEarbud.name}
                  </h4>
                  <p className="text-xs text-white/60 font-sans mt-0.5">
                    Built for focused listening at home and portable listening on the move.
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">
                    TOTAL SETUP PRICE
                  </span>
                  <span className="text-3xl font-black font-headline text-white tracking-tight">
                    ${(duoHeadphone.price + duoEarbud.price).toFixed(2)}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                    FREE EXPEDITED SHIPPING INCLUDED
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handleAddDuoToCart}
                  disabled={isAddingDuo}
                  className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-copper hover:bg-copper-hover disabled:opacity-40 text-black font-headline font-extrabold text-xs tracking-[0.2em] uppercase transition-all shadow-xl shadow-copper/25 flex items-center justify-center gap-3 cursor-pointer"
                >
                  {duoAddedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>NEXORO DUO ADDED TO YOUR CART</span>
                    </>
                  ) : isAddingDuo ? (
                    <span>ADDING DUO TO CART...</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD DUO TO CART</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStage('COMPLETE')}
                  className="w-full sm:w-auto py-4 px-6 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer text-center"
                >
                  VIEW SETUP SUMMARY &rarr;
                </button>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-2">
              <button
                onClick={() => setStage('MATCH')}
                className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-white/25 text-white/70 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK TO MATCHES</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 5: FINAL COMPLETE SUMMARY */}
        {/* ========================================================================= */}
        {stage === 'COMPLETE' && duoHeadphone && duoEarbud && profile && (
          <div className="w-full p-8 sm:p-14 rounded-2xl bg-[#0b0c10] border border-white/[0.08] shadow-2xl relative animate-fade-in text-center space-y-8">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-copper/15 border border-copper/40 flex items-center justify-center text-copper mx-auto mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block">
                NEXORO LISTENING SETUP COMPLETE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tight text-white uppercase">
                YOUR NEXORO JOURNEY IS READY.
              </h2>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
              {/* Profile Card */}
              <div className="p-4 rounded-xl bg-[#0f1015] border border-white/[0.06] space-y-1">
                <span className="text-[9px] font-mono text-copper uppercase tracking-widest font-bold">
                  LISTENING PROFILE
                </span>
                <span className="text-sm font-headline font-bold text-white block">
                  {profile.title}
                </span>
                <p className="text-[11px] text-white/50">{profile.tagline}</p>
              </div>

              {/* Context Card */}
              <div className="p-4 rounded-xl bg-[#0f1015] border border-white/[0.06] space-y-1">
                <span className="text-[9px] font-mono text-copper uppercase tracking-widest font-bold">
                  PRIMARY CONTEXT
                </span>
                <span className="text-sm font-headline font-bold text-white block">
                  {context.primary} {context.secondary ? `&bull; ${context.secondary}` : ''}
                </span>
                <p className="text-[11px] text-white/50">Calibrated for real-world acoustic moments</p>
              </div>

              {/* Headphone Selection */}
              <div className="p-4 rounded-xl bg-[#0f1015] border border-white/[0.06] flex items-center gap-3">
                <img
                  src={getProductImageUrl(duoHeadphone)}
                  alt={duoHeadphone.name}
                  className="w-12 h-12 rounded-lg object-cover bg-black"
                />
                <div>
                  <span className="text-[8px] font-mono text-white/40 uppercase block">IMMERSIVE</span>
                  <span className="text-xs font-headline font-bold text-white block">
                    {duoHeadphone.name}
                  </span>
                  <span className="text-[10px] font-mono text-copper font-bold">
                    ${duoHeadphone.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Earbud Selection */}
              <div className="p-4 rounded-xl bg-[#0f1015] border border-white/[0.06] flex items-center gap-3">
                <img
                  src={getProductImageUrl(duoEarbud)}
                  alt={duoEarbud.name}
                  className="w-12 h-12 rounded-lg object-cover bg-black"
                />
                <div>
                  <span className="text-[8px] font-mono text-white/40 uppercase block">ON-THE-GO</span>
                  <span className="text-xs font-headline font-bold text-white block">
                    {duoEarbud.name}
                  </span>
                  <span className="text-[10px] font-mono text-copper font-bold">
                    ${duoEarbud.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={`/products/${duoHeadphone.id}`}
                className="py-3 px-5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors"
              >
                VIEW HEADPHONE
              </Link>
              <Link
                to={`/products/${duoEarbud.id}`}
                className="py-3 px-5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors"
              >
                VIEW EARBUD
              </Link>
              <Link
                to="/catalog"
                className="py-3 px-6 rounded-xl bg-copper hover:bg-copper-hover text-black font-headline font-extrabold text-xs tracking-wider uppercase transition-all shadow-md shadow-copper/20"
              >
                CONTINUE SHOPPING
              </Link>
            </div>

            <div className="pt-2">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 text-[11px] font-mono text-white/40 hover:text-white transition-colors cursor-pointer uppercase"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESTART LISTENING LAB</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* COMPACT MODAL: CHANGE HEADPHONE */}
      {/* ========================================================================= */}
      {isChangingHeadphone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0d0e13] border border-white/15 rounded-2xl p-6 shadow-2xl max-h-[85vh] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-copper uppercase">
                SELECT IMMERSIVE HEADPHONE
              </span>
              <button
                onClick={() => setIsChangingHeadphone(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {products
                .filter((p) => p.category === 'HEADPHONES' && p.status === 'ACTIVE')
                .map((hp) => {
                  const isSelected = duoHeadphone?.id === hp.id;
                  return (
                    <div
                      key={hp.id}
                      onClick={() => {
                        setDuoHeadphone(hp);
                        setIsChangingHeadphone(false);
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#15161f] border-copper ring-1 ring-copper/50'
                          : 'bg-[#101116] border-white/[0.06] hover:border-white/20 hover:bg-[#13141b]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImageUrl(hp)}
                          alt={hp.name}
                          className="w-14 h-14 rounded-lg object-cover bg-black flex-shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-headline font-bold text-white">
                            {hp.name}
                          </h4>
                          <span className="text-xs font-mono text-copper font-bold block mt-0.5">
                            ${hp.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase bg-white/5 hover:bg-white/15 text-white/80">
                        {isSelected ? 'SELECTED' : 'SELECT'}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPACT MODAL: CHANGE EARBUD */}
      {/* ========================================================================= */}
      {isChangingEarbud && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0d0e13] border border-white/15 rounded-2xl p-6 shadow-2xl max-h-[85vh] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-copper uppercase">
                SELECT WIRELESS EARBUD
              </span>
              <button
                onClick={() => setIsChangingEarbud(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {products
                .filter(
                  (p) =>
                    (p.category === 'EARBUDS' || p.category === 'WIRELESS EARBUDS') &&
                    p.status === 'ACTIVE'
                )
                .map((eb) => {
                  const isSelected = duoEarbud?.id === eb.id;
                  return (
                    <div
                      key={eb.id}
                      onClick={() => {
                        setDuoEarbud(eb);
                        setIsChangingEarbud(false);
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#15161f] border-copper ring-1 ring-copper/50'
                          : 'bg-[#101116] border-white/[0.06] hover:border-white/20 hover:bg-[#13141b]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImageUrl(eb)}
                          alt={eb.name}
                          className="w-14 h-14 rounded-lg object-cover bg-black flex-shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-headline font-bold text-white">
                            {eb.name}
                          </h4>
                          <span className="text-xs font-mono text-copper font-bold block mt-0.5">
                            ${eb.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase bg-white/5 hover:bg-white/15 text-white/80">
                        {isSelected ? 'SELECTED' : 'SELECT'}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
