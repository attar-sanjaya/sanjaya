import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell, X, Clock } from 'lucide-react';

interface CalendarAppProps {
  onToggleExpand?: (expanded: boolean) => void;
  activeEvent?: any;
  calendarEvents?: any[];
  onAddEvent?: (eventData: any) => void;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const CalendarApp: React.FC<CalendarAppProps> = ({ onToggleExpand, activeEvent, calendarEvents = [], onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'form'|'agenda'>('form');
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('');

  const y = currentDate.getFullYear(), m = currentDate.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstDay = new Date(y, m, 1).getDay();
  const today = new Date();

  const fmtDate = (d: number) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const eventsFor = (d: number) => calendarEvents.filter(ev => ev.date === fmtDate(d));

  useEffect(() => {
    if (!activeEvent) return;
    if (activeEvent.date) {
      const [ey, em, ed] = activeEvent.date.split('-');
      const dt = new Date(+ey, +em - 1, +ed);
      setCurrentDate(dt);
      setSelectedDate(dt.getDate());
    }
    if (activeEvent.isAiGenerated) {
      setIsExpanded(true); setViewMode('agenda'); onToggleExpand?.(true); return;
    }
    if (activeEvent.title) setTitle(activeEvent.title);
    if (activeEvent.time) setStartTime(activeEvent.time);
    if (activeEvent.reminderTime) { setPushEnabled(true); setReminderTime(activeEvent.reminderTime); }
    setIsExpanded(true); setViewMode('form'); onToggleExpand?.(true);
  }, [activeEvent]);

  const expand = (date?: number, forceForm?: boolean) => {
    if (date !== undefined) {
      setSelectedDate(date);
      setViewMode(eventsFor(date).length > 0 && !forceForm ? 'agenda' : 'form');
    }
    const next = date !== undefined ? true : !isExpanded;
    setIsExpanded(next);
    onToggleExpand?.(next);
  };

  const handleSave = async () => {
    if (!title || selectedDate === null) return;
    setIsLoading(true);
    onAddEvent?.({ title, date: fmtDate(selectedDate), time: startTime, endTime, notes, reminderTime: pushEnabled ? reminderTime : undefined });
    await new Promise(r => setTimeout(r, 600));
    setIsLoading(false);
    setTitle(''); setStartTime(''); setEndTime(''); setNotes(''); setPushEnabled(false); setReminderTime('');
    setViewMode('agenda');
  };

  // ─── Shared styles ───
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8, padding: '5px 8px', fontSize: 11, color: 'rgb(220,230,255)',
    fontFamily: 'Space Grotesk', outline: 'none', transition: 'border-color 200ms ease',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'rgba(220,230,255,0.3)', marginBottom: 3, display: 'block',
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>

      {/* ── Calendar Grid ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', padding: 10,
        width: isExpanded ? '50%' : '100%', transition: 'width 300ms ease',
        borderRight: isExpanded ? '1px solid rgba(255,255,255,0.06)' : 'none',
        flexShrink: 0, position: 'relative',
      }}>
        {/* Month nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span className="panel-label">{MONTHS[m]} {y}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[['left', () => setCurrentDate(new Date(y, m-1, 1))], ['right', () => setCurrentDate(new Date(y, m+1, 1))]].map(([dir, fn]) => (
              <button key={dir as string} onClick={fn as any} style={{
                width: 22, height: 22, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.04)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(220,230,255,0.4)', transition: '200ms ease',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--c-brand)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(220,230,255,0.4)'}
              >
                {dir === 'left' ? <ChevronLeft size={11} /> : <ChevronRight size={11} />}
              </button>
            ))}
          </div>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(220,230,255,0.2)', padding: '2px 0' }}>{d}</div>
          ))}
        </div>

        {/* Date cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, flex: 1 }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`b${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(date => {
            const isToday = date === today.getDate() && m === today.getMonth() && y === today.getFullYear();
            const isPast = new Date(y, m, date) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isSel = selectedDate === date && isExpanded;
            const hasEv = eventsFor(date).length > 0;
            return (
              <div
                key={date}
                onClick={() => !isPast && expand(date)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  aspectRatio: '1', borderRadius: '50%', fontSize: 10, fontWeight: isSel || isToday ? 700 : 400,
                  cursor: isPast ? 'not-allowed' : 'pointer',
                  opacity: isPast ? 0.2 : 1,
                  position: 'relative',
                  transition: 'all 200ms ease',
                  ...(isSel ? {
                    background: 'var(--c-brand)', color: '#0a0e1a',
                    boxShadow: '0 0 14px rgba(0,200,180,0.5)',
                  } : isToday ? {
                    border: '1px solid rgba(0,200,180,0.5)', color: 'var(--c-brand)',
                  } : {
                    color: 'rgba(220,230,255,0.6)',
                  }),
                }}
                onMouseEnter={e => { if (!isPast && !isSel) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = ''; }}
              >
                {date}
                {hasEv && !isSel && (
                  <span style={{
                    position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
                    width: 4, height: 4, borderRadius: '50%',
                    background: 'var(--c-brand)', boxShadow: '0 0 6px rgba(0,200,180,0.6)',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Add button */}
        {!isExpanded && (
          <button
            onClick={() => expand(today.getDate(), true)}
            style={{
              position: 'absolute', bottom: 12, right: 12,
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--c-brand)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0a0e1a', boxShadow: '0 4px 16px rgba(0,200,180,0.4)',
              transition: '200ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,200,180,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,200,180,0.4)'; }}
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* ── Right Panel ── */}
      <div style={{
        flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        opacity: isExpanded ? 1 : 0,
        width: isExpanded ? '50%' : 0,
        transition: 'opacity 300ms ease, width 300ms ease',
        padding: isExpanded ? 10 : 0,
      }}>
        {/* Panel header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span className="panel-label">
            {viewMode === 'form' ? `New · ${selectedDate} ${MONTHS[m]}` : `Agenda · ${selectedDate} ${MONTHS[m]}`}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {viewMode === 'agenda' && (
              <button onClick={() => setViewMode('form')} style={{ width: 20, height: 20, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-brand)' }}>
                <Plus size={12} strokeWidth={3} />
              </button>
            )}
            <button onClick={() => setIsExpanded(false)} style={{ width: 20, height: 20, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(220,230,255,0.25)', transition: '200ms ease' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(239,68,68,0.8)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(220,230,255,0.25)'}
            >
              <X size={10} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="corvus-scroll" style={{ flex: 1, overflowY: 'auto' }}>
          {viewMode === 'agenda' ? (
            selectedDate && eventsFor(selectedDate).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {eventsFor(selectedDate).map((ev, idx) => (
                  <div key={ev.id || idx} style={{
                    background: 'rgba(0,200,180,0.06)', border: '1px solid rgba(0,200,180,0.12)',
                    borderRadius: 10, padding: '8px 10px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: ev.notes ? 4 : 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(220,230,255,0.9)' }}>{ev.title}</span>
                      {ev.time && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--c-brand)', background: 'rgba(0,200,180,0.1)', padding: '2px 6px', borderRadius: 99, fontFamily: 'Space Mono' }}>{ev.time}</span>}
                    </div>
                    {ev.notes && <p style={{ fontSize: 10, color: 'rgba(220,230,255,0.5)', lineHeight: 1.5, margin: 0 }}>{ev.notes}</p>}
                    {ev.reminderTime && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                        <Bell size={9} style={{ color: 'var(--c-brand)' }} />
                        <span style={{ fontSize: 9, color: 'rgba(0,200,180,0.8)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Reminder: {ev.reminderTime}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <span className="panel-label">No events</span>
              </div>
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Title */}
              <div>
                <label style={labelStyle}>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title..." style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--c-border-active)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                />
              </div>
              {/* Times */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[['Start', startTime, setStartTime], ['End', endTime, setEndTime]].map(([label, val, setter]) => (
                  <div key={label as string}>
                    <label style={labelStyle}>{label as string}</label>
                    <input type="time" value={val as string} onChange={e => (setter as any)(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}
                      onFocus={e => e.target.style.borderColor = 'var(--c-border-active)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                    />
                  </div>
                ))}
              </div>
              {/* Notes */}
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional notes..." style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--c-border-active)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                />
              </div>
              {/* Reminder toggle */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Bell size={11} style={{ color: pushEnabled ? 'var(--c-brand)' : 'rgba(220,230,255,0.2)' }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(220,230,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Push Reminder</span>
                  </div>
                  <button onClick={() => setPushEnabled(!pushEnabled)} style={{
                    width: 28, height: 15, borderRadius: 99, border: 'none', cursor: 'pointer', padding: 2,
                    background: pushEnabled ? 'var(--c-brand)' : 'rgba(255,255,255,0.1)', transition: '200ms ease',
                    display: 'flex', alignItems: 'center',
                  }}>
                    <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#fff', display: 'block', transform: pushEnabled ? 'translateX(13px)' : 'translateX(0)', transition: '200ms ease' }} />
                  </button>
                </div>
                {pushEnabled && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <Clock size={9} style={{ color: 'rgba(0,200,180,0.6)' }} />
                    <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} style={{ ...inputStyle, flex: 1, colorScheme: 'dark', color: 'var(--c-brand)' }} />
                  </div>
                )}
              </div>

              {/* Save */}
              <button
                onClick={handleSave} disabled={isLoading || !title}
                style={{
                  background: isLoading || !title ? 'rgba(0,200,180,0.3)' : 'var(--c-brand)',
                  color: '#0a0e1a', fontWeight: 700, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '8px 0', borderRadius: 8, border: 'none', cursor: isLoading || !title ? 'not-allowed' : 'pointer',
                  width: '100%', transition: '200ms ease',
                  boxShadow: isLoading || !title ? 'none' : '0 4px 16px rgba(0,200,180,0.3)',
                }}
                onMouseEnter={e => { if (!isLoading && title) e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,200,180,0.5)'; }}
                onMouseLeave={e => e.currentTarget.style.boxShadow = isLoading || !title ? 'none' : '0 4px 16px rgba(0,200,180,0.3)'}
              >
                {isLoading ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
