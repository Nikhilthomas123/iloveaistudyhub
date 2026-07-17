import React, { useState, useRef, useEffect } from 'react';
import { researchService } from '../services/researchService';
import type { ResearchResult, StructuredContent } from '../services/researchService';
import { QuizGenerator } from './QuizGenerator';

interface DashboardProps {
  activeTab: 'flashcards' | 'research' | 'quiz';
}

interface Flashcard {
  question: string;
  answer: string;
  category: string;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  findings?: StructuredContent;
}

const USER_ID = '60d5f15d9f1b2c001f8d423a';

export const Dashboard: React.FC<DashboardProps> = ({ activeTab }) => {
  // --- Flashcards State ---
  const flashcards: Flashcard[] = [
    {
      category: 'Question',
      question: 'What is a React Hook?',
      answer: 'Hooks are functions that let you "hook into" React state and lifecycle features from function components.',
    },
    {
      category: 'Question',
      question: 'What is Tailwind CSS?',
      answer: 'A utility-first CSS framework containing low-level utility classes like flex, pt-4, text-center and rotate to build custom designs without writing CSS.',
    },
    {
      category: 'Question',
      question: 'What is Vite?',
      answer: 'A build tool that aims to provide a faster and leaner development experience for modern web projects via native ESM and hot module replacement.',
    },
    {
      category: 'Question',
      question: 'What is TypeScript?',
      answer: 'A strongly typed programming language that builds on JavaScript, adding static type definitions to help catch errors early during development.',
    },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mainScrollContainerRef = useRef<HTMLElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const handleStudyDeck = (index: number) => {
    setIsFlipped(false);
    setTiltStyle({});
    setCurrentCardIndex(index);
    setTimeout(() => {
      mainScrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setTiltStyle({});
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTiltStyle({});
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    if (!isFlipped) {
      setTiltStyle({
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      });
    } else {
      setTiltStyle({
        transform: `rotateY(180deg) rotateX(${rotateX}deg)`,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!isFlipped) {
      setTiltStyle({ transform: 'rotateX(0deg) rotateY(0deg)' });
    } else {
      setTiltStyle({ transform: 'rotateY(180deg)' });
    }
  };

  // --- AI Research State ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'user',
      text: 'Analyze the impact of LLMs on executive function in professional productivity software. Focus on "flow state" metrics.',
      timestamp: '13:42',
    },
    {
      sender: 'ai',
      text: '',
      timestamp: '13:42',
      findings: {
        summary: 'Current research indicates a dual-natured impact of LLM integration into productivity tools. While completion speed increases by up to 37%, there is a measurable risk of "Cognitive Offloading" which can disrupt deep flow states if interaction patterns are too frequent.',
        bullets: [
          'Micro-Interruption Thresholds: Users experienced a 12% drop in sustained concentration when AI suggestions appeared more than once every 180 seconds.',
          'Augmentation vs. Delegation: High-performance professionals reported better outcomes when using LLMs for structural outlines rather than granular content generation.',
          'Feedback Loops: Real-time latency below 200ms is critical for maintaining the illusion of "Co-creation" in research tasks.',
        ],
        citations: ['Citation: Miller et al. (2024)', 'Report: HCI Insights Q1'],
      },
    },
  ]);

  const [history, setHistory] = useState<ResearchResult[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch past research queries on load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const results = await researchService.getResearchResults(USER_ID);
        setHistory(results);
      } catch (err) {
        console.error('Error fetching research history:', err);
      }
    };
    if (activeTab === 'research') {
      fetchHistory();
    }
  }, [activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const topic = inputVal.trim();
    const userMsg: ChatMessage = {
      sender: 'user',
      text: topic,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const result = await researchService.generateResearch(topic, USER_ID);
      
      let parsed: StructuredContent;
      try {
        parsed = JSON.parse(result.content);
      } catch (err) {
        parsed = {
          summary: result.content,
          bullets: [],
          citations: ['AI Generated Report'],
        };
      }

      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        findings: parsed,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      
      // Refresh sidebar list
      const updatedHistory = await researchService.getResearchResults(USER_ID);
      setHistory(updatedHistory);
    } catch (err: any) {
      console.error('Error generating research:', err);
      const errMsg: ChatMessage = {
        sender: 'ai',
        text: `Error generating research: ${err.response?.data?.error || err.message}. Make sure your Gemini API key is configured.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectHistoryItem = (item: ResearchResult) => {
    let parsed: StructuredContent;
    try {
      parsed = JSON.parse(item.content);
    } catch (err) {
      parsed = {
        summary: item.content,
        bullets: [],
        citations: ['AI Generated Report'],
      };
    }

    setChatMessages([
      {
        sender: 'user',
        text: `Research topic: "${item.topic}"`,
        timestamp: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        sender: 'ai',
        text: '',
        timestamp: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        findings: parsed,
      },
    ]);
  };

  return (
    <div className="flex-1 w-full bg-background relative overflow-hidden">
      {activeTab === 'flashcards' ? (
        // ================= FLASHCARDS VIEW =================
        <main ref={mainScrollContainerRef} className="p-8 h-[calc(100vh-64px)] overflow-y-auto w-full">
          <div className="max-w-screen-max_width mx-auto space-y-12">
            {/* Study Mode Header */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Study Mode</h2>
                  <p className="text-body-md text-on-surface-variant">
                    Currently reviewing:{' '}
                    <span className="font-semibold text-primary">React & Development Basics</span>
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setTimeout(() => {
                        const randomIndex = Math.floor(Math.random() * flashcards.length);
                        setCurrentCardIndex(randomIndex);
                      }, 150);
                    }}
                    className="px-4 py-2 bg-primary-container text-on-primary-container rounded-xl flex items-center gap-2 hover:brightness-110 transition-all font-semibold active:scale-95 duration-100"
                  >
                    <span className="material-symbols-outlined text-[20px]">shuffle</span>
                    Shuffle
                  </button>
                </div>
              </div>

              {/* Interactive Flashcard */}
              <div className="flex flex-col items-center justify-center py-8">
                <div
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full max-w-2xl aspect-[1.6/1] perspective-1000 cursor-pointer group"
                >
                  <div
                    style={tiltStyle}
                    className={`relative w-full h-full transition-transform duration-500 preserve-3d shadow-xl rounded-2xl border border-outline-variant ${
                      isFlipped ? 'flip-active' : ''
                    }`}
                  >
                    {/* Card Front */}
                    <div className="absolute inset-0 w-full h-full bg-white rounded-2xl backface-hidden flex flex-col items-center justify-center p-12 text-center">
                      <span className="text-label-md text-primary-container font-bold mb-4 uppercase tracking-widest">
                        {flashcards[currentCardIndex].category}
                      </span>
                      <h3 className="font-headline-xl text-headline-xl text-on-surface leading-tight">
                        {flashcards[currentCardIndex].question}
                      </h3>
                      <div className="absolute bottom-6 flex items-center gap-2 text-on-surface-variant opacity-60">
                        <span className="material-symbols-outlined">touch_app</span>
                        <span className="text-label-md">Click to flip</span>
                      </div>
                    </div>

                    {/* Card Back */}
                    <div className="absolute inset-0 w-full h-full bg-primary-container text-on-primary-container rounded-2xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-12 text-center">
                      <span className="text-label-md text-primary-fixed font-bold mb-4 uppercase tracking-widest">
                        Answer
                      </span>
                      <p className="text-headline-md font-medium leading-relaxed">
                        {flashcards[currentCardIndex].answer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-6 mt-10 w-full max-w-2xl">
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={handlePrevCard}
                      className="p-4 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined block">arrow_back_ios_new</span>
                    </button>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-body-md font-bold text-on-surface">
                        Card {currentCardIndex + 1} of {flashcards.length}
                      </span>
                      <div className="w-48 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-container rounded-full transition-all duration-300"
                          style={{
                            width: `${((currentCardIndex + 1) / flashcards.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <button
                      onClick={handleNextCard}
                      className="p-4 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined block">arrow_forward_ios</span>
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined">flip</span>
                      Flip Card
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Decks Section */}
            <section className="pb-8">
              <div className="flex items-center justify-between mb-8 border-b border-outline-variant pb-4">
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  Your Decks
                </h2>
                <button className="text-primary font-bold hover:underline">View All</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Deck 1 */}
                <div className="deck-card-hover bg-white p-6 rounded-2xl border border-outline-variant transition-all flex flex-col cursor-pointer shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-xl">
                      <span className="material-symbols-outlined text-primary">code</span>
                    </div>
                    <span className="px-3 py-1 bg-surface-container-high rounded-full text-label-sm font-bold text-on-surface-variant">
                      24 CARDS
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
                    React Basics
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed">
                    Master JSX, props, state, and the basic component lifecycle.
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <button
                      onClick={() => handleStudyDeck(0)}
                      className="px-6 py-2.5 bg-primary-container text-on-primary-container rounded-xl font-bold hover:brightness-110 transition-all active:scale-95"
                    >
                      Study Now
                    </button>
                    <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                      <span className="material-symbols-outlined block">more_vert</span>
                    </button>
                  </div>
                </div>

                {/* Deck 2 */}
                <div className="deck-card-hover bg-white p-6 rounded-2xl border border-outline-variant transition-all flex flex-col cursor-pointer shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-secondary-fixed flex items-center justify-center rounded-xl">
                      <span className="material-symbols-outlined text-secondary">palette</span>
                    </div>
                    <span className="px-3 py-1 bg-surface-container-high rounded-full text-label-sm font-bold text-on-surface-variant">
                      18 CARDS
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
                    Tailwind Utilities
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed">
                    Quick recall for flexbox, grid, and spacing shorthand classes.
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <button
                      onClick={() => handleStudyDeck(1)}
                      className="px-6 py-2.5 bg-primary-container text-on-primary-container rounded-xl font-bold hover:brightness-110 transition-all active:scale-95"
                    >
                      Study Now
                    </button>
                    <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                      <span className="material-symbols-outlined block">more_vert</span>
                    </button>
                  </div>
                </div>

                {/* Deck 3 */}
                <div className="deck-card-hover bg-white p-6 rounded-2xl border border-outline-variant transition-all flex flex-col cursor-pointer shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-tertiary-fixed flex items-center justify-center rounded-xl">
                      <span className="material-symbols-outlined text-tertiary">account_tree</span>
                    </div>
                    <span className="px-3 py-1 bg-surface-container-high rounded-full text-label-sm font-bold text-on-surface-variant">
                      30 CARDS
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
                    Data Structures
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed">
                    Review Big O, linked lists, binary trees, and sorting algorithms.
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <button
                      onClick={() => handleStudyDeck(3)}
                      className="px-6 py-2.5 bg-primary-container text-on-primary-container rounded-xl font-bold hover:brightness-110 transition-all active:scale-95"
                    >
                      Study Now
                    </button>
                    <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                      <span className="material-symbols-outlined block">more_vert</span>
                    </button>
                  </div>
                </div>

                {/* Create New Deck */}
                <div className="group border-2 border-dashed border-outline-variant p-6 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[240px]">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-4 group-hover:bg-primary-fixed transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors block">
                      add
                    </span>
                  </div>
                  <span className="font-headline-md text-on-surface-variant group-hover:text-primary transition-colors font-bold">
                    Create New Deck
                  </span>
                </div>
              </div>
            </section>
          </div>
        </main>
      ) : activeTab === 'research' ? (
        // ================= AI RESEARCH VIEW =================
        <main className="h-[calc(100vh-64px)] flex overflow-hidden w-full">
          {/* Conversation & Findings Area */}
          <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
            {/* Chat Scrollable Container */}
            <div className="flex-1 overflow-y-auto chat-scroll px-8 py-6 space-y-6">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  } transition-all duration-300`}
                >
                  {msg.sender === 'user' ? (
                    <div className="max-w-[80%] bg-primary-container text-on-primary-container p-4 rounded-2xl rounded-tr-none shadow-sm">
                      <p className="text-body-md font-body-md leading-relaxed">{msg.text}</p>
                    </div>
                  ) : (
                    <div className="max-w-[90%] bg-white border border-outline-variant p-6 rounded-2xl rounded-tl-none shadow-sm space-y-4 w-full">
                      {msg.text && (
                        <p className="text-body-md text-on-surface leading-relaxed">{msg.text}</p>
                      )}
                      {msg.findings && (
                        <>
                          <div className="flex items-center gap-3 text-primary mb-2">
                            <span className="material-symbols-outlined block" style={{ fontVariationSettings: "'FILL' 1" }}>
                              auto_awesome
                            </span>
                            <span className="text-label-md font-label-md uppercase tracking-widest font-bold">
                              Recent Findings
                            </span>
                          </div>
                          <div className="prose prose-slate max-w-none space-y-3">
                            <p className="text-body-lg font-body-lg text-on-surface leading-relaxed font-semibold">
                              {msg.findings.summary}
                            </p>
                            {msg.findings.bullets && msg.findings.bullets.length > 0 && (
                              <ul className="space-y-2 list-disc list-inside text-on-surface-variant font-body-md pl-2">
                                {msg.findings.bullets.map((bullet, bIdx) => {
                                  const splitPoint = bullet.indexOf(':');
                                  if (splitPoint !== -1) {
                                    const title = bullet.slice(0, splitPoint + 1);
                                    const text = bullet.slice(splitPoint + 1);
                                    return (
                                      <li key={bIdx} className="leading-relaxed">
                                        <strong className="text-on-surface">{title}</strong>
                                        {text}
                                      </li>
                                    );
                                  }
                                  return (
                                    <li key={bIdx} className="leading-relaxed">
                                      {bullet}
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                            <div className="pt-4 border-t border-surface-container-high flex flex-wrap gap-2">
                              {msg.findings.citations && msg.findings.citations.map((cit, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="px-2 py-1 bg-surface-container-low text-primary text-[10px] font-bold rounded-md border border-outline-variant uppercase tracking-wider"
                                >
                                  {cit}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-outline-variant px-6 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-on-surface-variant text-body-md">
                    <span className="animate-bounce block h-2 w-2 bg-primary rounded-full"></span>
                    <span className="animate-bounce block h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.2s' }}></span>
                    <span className="animate-bounce block h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.4s' }}></span>
                    <span className="ml-2 font-medium">Researching and analyzing via Multi-Agent pipeline...</span>
                  </div>
                </div>
              )}

              <div className="h-32" />
              <div ref={chatEndRef} />
            </div>

            {/* Bottom Search Input */}
            <div className="absolute bottom-0 left-0 right-0 p-6 glass-panel z-10">
              <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative group">
                <input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-full bg-white border border-outline-variant focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-6 py-4 pr-36 text-body-md transition-all shadow-sm outline-none font-body-md"
                  placeholder="Ask AI to research, analyze, or summarize..."
                  type="text"
                />
                <div className="absolute right-2 top-2 flex gap-2">
                  <button
                    type="button"
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined block">attach_file</span>
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-lg font-label-md flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 font-semibold"
                  >
                    <span className="material-symbols-outlined text-[18px] block">search</span>
                    Ask AI
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar: Recent Research (Desktop-only) */}
          <aside className="w-[320px] border-l border-outline-variant bg-surface flex flex-col hidden lg:flex">
            <div className="p-6 border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Recent Research
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll">
              {history.length > 0 ? (
                history.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectHistoryItem(item)}
                    className="p-4 bg-white rounded-xl border border-outline-variant hover:shadow-md transition-all cursor-pointer group active:scale-[0.98] duration-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="p-1.5 bg-secondary-container text-primary rounded-lg">
                        <span className="material-symbols-outlined text-[20px] block">psychology</span>
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant opacity-60">
                        {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h4 className="font-label-md text-on-surface line-clamp-1 mb-1 group-hover:text-primary transition-colors font-bold text-left">
                      {item.topic}
                    </h4>
                    <p className="text-label-sm text-on-surface-variant line-clamp-2 text-left leading-relaxed">
                      {(() => {
                        try {
                          return JSON.parse(item.content).summary;
                        } catch (e) {
                          return item.content;
                        }
                      })()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-on-surface-variant opacity-60 text-body-md">
                  No recent research queries found. Type a query below to generate research.
                </div>
              )}

              {/* New Query Trigger */}
              <button
                onClick={() => setChatMessages([])}
                className="w-full py-3 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant hover:border-primary hover:text-primary transition-all font-label-md flex items-center justify-center gap-2 font-semibold active:scale-95 duration-100"
              >
                <span className="material-symbols-outlined block">add_circle</span>
                New Query
              </button>
            </div>

            {/* Visualization Graphic Placeholder */}
            <div className="p-4 mt-auto">
              <div className="relative h-48 w-full rounded-xl overflow-hidden border border-outline-variant">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0GITecCfLMkdv7yn9tQhrj-qeQ7THTa25ru-0mgAzPEfW1yzINvdM49-uzyuIspxxvDcVcJzH0DqPN_fgCBShkqRbpDyg-_8SoRiVUBz9WXVq68Dh3Ld_FlmMAzxsD-cmOBv6QA-JpkrQiY9c7YdEzgahlWhkJ8G0MnGME79j-cvvGTu4GB8LVWRbJ1W3hqLuho6uYayfqUCHQ1Haid-t7BQoYy_jRHlDxbFYaZlyjYTWWQcrELoC1dinZF6shUPhWBrvuZKtKg47')`,
                  }}
                  title="3D abstract node network graph representing high-speed AI processing"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white text-label-sm font-bold tracking-wider">
                    Research Insights 2024
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </main>
      ) : (
        // ================= AI QUIZ VIEW =================
        <QuizGenerator />
      )}
    </div>
  );
};
