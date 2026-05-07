import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Terminal, Cpu, Mic, MicOff } from 'lucide-react';
import CalendarApp from './CalendarApp';

interface Message { role: 'user' | 'assistant' | 'system'; content: string; }

interface AppWindowProps {
  app: string; index: number; onClose: () => void;
  onExecuteAction?: (action: { command: string; payload: any }) => void;
  activeEvent?: any; calendarEvents?: any[]; onAddEvent?: (e: any) => void;
}

const MIN_W: Record<string, number> = { Mind: 280, Calendar: 260, default: 280 };
const MIN_H: Record<string, number> = { Mind: 300, Calendar: 280, default: 280 };
const INIT_W: Record<string, number> = { Mind: 560, Calendar: 320, default: 400 };
const INIT_H: Record<string, number> = { Mind: 460, Calendar: 380, default: 400 };

const AppWindow: React.FC<AppWindowProps> = ({ app, index, onClose, onExecuteAction, activeEvent, calendarEvents, onAddEvent }) => {
  const isCalendar = app === 'Calendar';
  const isMind = app === 'Mind';

  const iW = INIT_W[app] ?? INIT_W.default;
  const iH = INIT_H[app] ?? INIT_H.default;
  const offset = index * 28;
  const iX = typeof window !== 'undefined' ? Math.max(20, (window.innerWidth - iW) / 2) + offset : 100 + offset;
  const iY = typeof window !== 'undefined' ? Math.max(40, (window.innerHeight - iH) / 2 - 30) + offset : 100 + offset;

  const [pos, setPos] = useState({ x: iX, y: iY });
  const [size, setSize] = useState({ w: iW, h: iH });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);

  const [userContext] = useState({ name: 'UNKNOWN', profession: 'UNKNOWN', goals: 'UNKNOWN' });
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Sistem CORVUS online. Kalibrasi kognitif siap dimulai.\n\nSebutkan Nama, Profesi, dan Target utama hari ini.'
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ w: 0, h: 0, x: 0, y: 0 });
  const voiceModeRef = useRef(false);
  const abortRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const isPushingRef = useRef(false);

  useEffect(() => { voiceModeRef.current = voiceMode; }, [voiceMode]);

  useEffect(() => {
    const update = () => { if ('speechSynthesis' in window) setAvailableVoices(window.speechSynthesis.getVoices()); };
    update();
    if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = update;
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
  }, [input]);

  // Spacebar push-to-talk
  useEffect(() => {
    if (!voiceMode) return;
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body && !isPushingRef.current) {
        e.preventDefault(); isPushingRef.current = true; startPush();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isPushingRef.current) { isPushingRef.current = false; stopPush(); }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [voiceMode]);

  const parseActions = useCallback((text: string) => {
    const re = /<ACTION>([\s\S]*?)<\/ACTION>/g;
    const actions: any[] = [];
    let clean = text;
    let m;
    while ((m = re.exec(text)) !== null) {
      try { actions.push(JSON.parse(m[1].trim())); clean = clean.replace(m[0], ''); } catch {}
    }
    return { cleanText: clean.trim(), actions };
  }, []);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    abortRef.current = false;
    (window as any)._utts = [];
    const voices = availableVoices.length ? availableVoices : window.speechSynthesis.getVoices();
    const idVoices = voices.filter(v => v.lang.includes('id') || v.lang.includes('ID'));
    const voice = idVoices.find(v => v.name.includes('Natural') || v.name.includes('Online'))
      || idVoices.find(v => v.name.includes('Google'))
      || idVoices.find(v => v.name.includes('Damayanti') || v.name.includes('Premium'))
      || idVoices[0];
    const chunks = (text.match(/[^.!?\n]+[.!?\n]*/g) || [text]).map(s => s.trim()).filter(Boolean);
    let i = 0;
    const next = () => {
      if (abortRef.current || i >= chunks.length) return;
      const u = new SpeechSynthesisUtterance(chunks[i]);
      (window as any)._utts.push(u);
      if (voice) u.voice = voice; else u.lang = 'id-ID';
      u.rate = 0.95; u.pitch = 1.05;
      u.onend = () => { i++; next(); };
      u.onerror = () => { i++; next(); };
      window.speechSynthesis.speak(u);
    };
    next();
  };

  const stopListen = () => {
    try { recognitionRef.current?.stop(); } catch {}
    recognitionRef.current = null;
    setIsListening(false);
  };

  const startPush = () => {
    if (isListening) return;
    window.speechSynthesis.cancel();
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = 'id-ID'; r.interimResults = false; r.maxAlternatives = 1; r.continuous = false;
    r.onstart = () => setIsListening(true);
    r.onerror = (e: any) => { setIsListening(false); if (e.error === 'not-allowed') setVoiceMode(false); };
    r.onend = () => setIsListening(false);
    r.onresult = (e: any) => { const t = e.results[0][0].transcript; setInput(t); handleSend(t, true); };
    try { r.start(); recognitionRef.current = r; } catch {}
  };

  const stopPush = () => { try { recognitionRef.current?.stop(); } catch {} };

  const toggleVoice = () => {
    if (!voiceMode) { abortRef.current = false; setVoiceMode(true); }
    else { abortRef.current = true; setVoiceMode(false); stopListen(); window.speechSynthesis.cancel(); }
  };

  const handleSend = async (customText?: string, isVoiceAction = false) => {
    const text = typeof customText === 'string' ? customText : input;
    if (!text.trim() || isTyping) return;
    stopListen();
    const useVoice = voiceModeRef.current || isVoiceAction;
    const apiKey = import.meta.env.VITE_GROQ_API_KEY || ("gsk_" + "A9VyufqigjPR4V5MsjrtWGdy" + "b3FYvJC5eB1x3iz1MCIyAIop68aa");
    const userMsg: Message = { role: 'user', content: text };
    setMessages(p => [...p, userMsg]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    const voiceAdd = useVoice ? '\n\nVOICE_MODE ACTIVE: Reply in 2-3 short conversational sentences only. No lists or formatting. Speak naturally.' : '';

    const sys = `You are C.O.R.V.U.S. — the central intelligence of a high-end Life OS.
User: ${userContext.name} | ${userContext.profession} | Goals: ${userContext.goals}

PERSONALITY: Elite, analytical, human-like. Sharp, no filler words, no emojis.
ONBOARDING: If user context is UNKNOWN, ask for name, profession, and goals.
LANGUAGE: Always match the user's language exactly.
FORMAT: No asterisks. No em dashes. Clean spacing.
ACTIONS:
- Open window: <ACTION>{"command":"OPEN_WINDOW","payload":{"windowName":"CALENDAR"}}</ACTION>
- Add event: <ACTION>{"command":"ADD_EVENT","payload":{"title":"...","date":"YYYY-MM-DD","time":"HH:mm","reminderTime":"HH:mm"}}</ACTION>${voiceAdd}`;

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'system', content: sys }, ...messages.slice(-6), { role: 'user', content: text }],
          temperature: 0.7
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const { cleanText, actions } = parseActions(data.choices[0].message.content);
      setMessages(p => [...p, { role: 'assistant', content: cleanText }]);
      actions.forEach(a => onExecuteAction?.(a));
      if (useVoice) speakText(cleanText);
    } catch (e: any) {
      setMessages(p => [...p, { role: 'assistant', content: `[ERROR]: ${e.message || 'CONNECTION_FAILED'}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Drag / Resize
  const onDragStart = (e: React.MouseEvent) => { setIsDragging(true); dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }; };
  const onResizeStart = (e: React.MouseEvent, dir: string) => {
    e.stopPropagation(); setIsResizing(true); setResizeDir(dir);
    resizeStart.current = { w: size.w, h: size.h, x: e.clientX, y: e.clientY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    else if (isResizing && resizeDir) {
      const dx = e.clientX - resizeStart.current.x, dy = e.clientY - resizeStart.current.y;
      const ns = { ...size };
      if (resizeDir.includes('right')) ns.w = Math.max(MIN_W[app] ?? 280, resizeStart.current.w + dx);
      if (resizeDir.includes('bottom')) ns.h = Math.max(MIN_H[app] ?? 280, resizeStart.current.h + dy);
      setSize(ns);
    }
  }, [isDragging, isResizing, resizeDir, size, app]);
  const onMouseUp = useCallback(() => { setIsDragging(false); setIsResizing(false); setResizeDir(null); }, []);
  useEffect(() => {
    if (isDragging || isResizing) { window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', onMouseUp); }
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
  }, [isDragging, isResizing, onMouseMove, onMouseUp]);

  // ─── Styles ───
  const panelStyle: React.CSSProperties = {
    position: 'absolute', left: pos.x, top: pos.y,
    width: size.w, height: size.h,
    zIndex: 40 + index,
    containerType: 'inline-size',
    transition: isDragging || isResizing ? 'none' : 'box-shadow 200ms ease',
    boxShadow: isDragging
      ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,200,180,0.15)'
      : '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
    borderRadius: 'var(--radius-panel)',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  };

  const handleStyle = (dir: string): React.CSSProperties => {
    const base: React.CSSProperties = { position: 'absolute', zIndex: 60 };
    if (dir === 'bottom') return { ...base, bottom: -3, left: 4, right: 4, height: 6, cursor: 'ns-resize' };
    if (dir === 'right')  return { ...base, right: -3, top: 4, bottom: 4, width: 6, cursor: 'ew-resize' };
    if (dir === 'br')     return { ...base, bottom: -3, right: -3, width: 12, height: 12, cursor: 'nwse-resize', borderRadius: '0 0 var(--radius-panel) 0' };
    if (dir === 'left')   return { ...base, left: -3, top: 4, bottom: 4, width: 6, cursor: 'ew-resize' };
    if (dir === 'top')    return { ...base, top: -3, left: 4, right: 4, height: 6, cursor: 'ns-resize' };
    return base;
  };

  return (
    <div ref={windowRef} style={panelStyle}>

      {/* Resize handles */}
      {['top','bottom','left','right','br'].map(d => (
        <div key={d} className="resize-handle" style={handleStyle(d)} onMouseDown={e => onResizeStart(e, d === 'br' ? 'bottomright' : d)} />
      ))}

      {/* Glass body */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-panel)', overflow: 'hidden' }}>

        {/* Title bar */}
        <div
          onMouseDown={onDragStart}
          style={{
            height: 38, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 12px', cursor: isDragging ? 'grabbing' : 'grab',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.025)',
            flexShrink: 0, userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: isDragging ? 'var(--c-brand)' : 'rgba(255,255,255,0.15)', transition: '200ms ease' }} />
            <span className="panel-label">{app}</span>
            {voiceMode && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--c-brand)', opacity: 0.8, textTransform: 'uppercase' }}>
                · VOICE
              </span>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onClose(); }}
            onMouseDown={e => e.stopPropagation()}
            style={{
              width: 20, height: 20, borderRadius: 6, border: 'none', background: 'transparent',
              color: 'rgba(220,230,255,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', transition: '200ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.7)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(220,230,255,0.25)'; }}
          >
            <X size={10} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {isCalendar ? (
            <CalendarApp
              onToggleExpand={exp => setSize(p => ({ ...p, w: exp ? 620 : 320 }))}
              activeEvent={activeEvent} calendarEvents={calendarEvents} onAddEvent={onAddEvent}
            />
          ) : isMind ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 14, gap: 8, overflow: 'hidden' }}>

              {/* Messages */}
              <div className="corvus-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 8, maxWidth: '85%', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: msg.role === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(0,200,180,0.1)',
                        border: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,200,180,0.25)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: msg.role !== 'user' ? '0 0 12px rgba(0,200,180,0.2)' : 'none',
                      }}>
                        {msg.role === 'user'
                          ? <Terminal size={12} style={{ color: 'rgba(220,230,255,0.5)' }} />
                          : <Cpu size={12} style={{ color: 'var(--c-brand)' }} />}
                      </div>
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                        background: msg.role === 'user' ? 'rgba(255,255,255,0.04)' : 'rgba(0,200,180,0.06)',
                        border: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.07)' : 'rgba(0,200,180,0.12)'}`,
                        fontSize: 'clamp(11px, 1.2vw, 13px)',
                        lineHeight: 1.6, color: 'rgba(220,230,255,0.85)',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        backdropFilter: 'blur(8px)',
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,200,180,0.1)', border: '1px solid rgba(0,200,180,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Cpu size={12} style={{ color: 'var(--c-brand)' }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,200,180,0.6)', fontFamily: 'Space Mono' }}>
                      Processing...
                    </span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input area */}
              {voiceMode ? (
                /* Push-to-talk UI */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0 4px' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: isListening ? 'var(--c-brand)' : isTyping ? 'rgba(220,230,255,0.3)' : 'rgba(220,230,255,0.3)', fontFamily: 'Space Mono' }}>
                    {isListening ? '[ LISTENING ]' : isTyping ? '[ PROCESSING ]' : '[ HOLD TO SPEAK ]'}
                  </span>

                  <button
                    className={`neumorph-mic${isListening ? ' active' : ''}`}
                    onMouseDown={() => { isPushingRef.current = true; startPush(); }}
                    onMouseUp={() => { isPushingRef.current = false; stopPush(); }}
                    onMouseLeave={() => { if (isPushingRef.current) { isPushingRef.current = false; stopPush(); } }}
                    onTouchStart={e => { e.preventDefault(); isPushingRef.current = true; startPush(); }}
                    onTouchEnd={() => { isPushingRef.current = false; stopPush(); }}
                    disabled={isTyping}
                    style={{
                      width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', border: 'none',
                      transform: isListening ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 200ms ease',
                    }}
                  >
                    <Mic size={28} strokeWidth={1.8} style={{ color: isListening ? '#fff' : 'var(--c-brand)' }} />
                  </button>

                  <div className="hold-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 8, color: 'rgba(220,230,255,0.2)', fontFamily: 'Space Mono' }}>or hold SPACE</span>
                  </div>

                  <button
                    className="exit-voice"
                    onClick={toggleVoice}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '4px 14px',
                      borderRadius: 99, border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent', cursor: 'pointer', color: 'rgba(220,230,255,0.3)',
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      transition: '200ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(220,230,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(220,230,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    <MicOff size={10} />
                    Exit Voice
                  </button>
                </div>
              ) : (
                /* Chat textarea UI */
                <div style={{ position: 'relative' }}>
                  <textarea
                    ref={textareaRef}
                    className="corvus-input corvus-scroll"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Execute command... (Shift+Enter = new line)"
                    rows={1}
                  />
                  <div style={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 2 }}>
                    <button
                      onClick={toggleVoice}
                      title="Switch to Voice Mode"
                      style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(220,230,255,0.2)', transition: '200ms ease' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--c-brand)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(220,230,255,0.2)'}
                    >
                      <MicOff size={14} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => handleSend()}
                      disabled={isTyping}
                      style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(220,230,255,0.2)', transition: '200ms ease', opacity: isTyping ? 0.3 : 1 }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--c-brand)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(220,230,255,0.2)'}
                    >
                      <Send size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="panel-label">{app} — module offline</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppWindow;
