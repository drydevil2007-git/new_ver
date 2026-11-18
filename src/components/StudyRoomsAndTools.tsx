import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Users,
  Play,
  Pause,
  RotateCcw,
  Plus,
  CheckSquare,
  Square,
  Trash2,
  Send,
  Volume2,
  VolumeX,
  Calculator,
  Award,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Edit3,
} from 'lucide-react';
import { Lang } from '../types/app';
import { RichMathText } from './MathRenderer';

interface StudyRoomsAndToolsProps {
  lang: Lang;
}

interface RoomMember {
  clientId: string;
  name: string;
  major: string;
}

interface StudyGoal {
  id: string;
  text: string;
  author: string;
  completed: boolean;
}

interface RoomChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface StudyRoomState {
  id: string;
  nameFa: string;
  nameEn: string;
  topicFa: string;
  topicEn: string;
  pomodoro: {
    phase: 'focus' | 'break';
    durationSec: number;
    remainingSec: number;
    isRunning: boolean;
    updatedBy: string;
  };
  goals: StudyGoal[];
  scratchpad: {
    content: string;
    lastEditedBy: string;
    updatedAt: string;
  };
  chat: RoomChatMessage[];
  members: RoomMember[];
}

interface GpaCourseRow {
  id: string;
  name: string;
  credits: number;
  grade: number;
}

function formatClock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const StudyRoomsAndTools: React.FC<StudyRoomsAndToolsProps> = ({ lang }) => {
  const [subTab, setSubTab] = useState<'rooms' | 'ambient' | 'gpa'>('rooms');

  // ==========================================================================
  // 1. Collaborative Virtual Study Rooms (Real WebSocket + Server State)
  // ==========================================================================
  const [roomsList, setRoomsList] = useState<StudyRoomState[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>('room-calculus');
  const [roomState, setRoomState] = useState<StudyRoomState | null>(null);
  const [studentName, setStudentName] = useState<string>(() =>
    lang === 'fa' ? 'آرمان حسینی' : 'Arman Hosseini'
  );
  const [studentMajor, setStudentMajor] = useState<string>(() =>
    lang === 'fa' ? 'مهندسی برق' : 'Electrical Eng.'
  );
  const [newRoomName, setNewRoomName] = useState('');
  const [newGoalText, setNewGoalText] = useState('');
  const [chatText, setChatText] = useState('');
  const [padPreview, setPadPreview] = useState(false);

  const clientIdRef = useRef<string>(`stu-${Math.random().toString(36).slice(2, 8)}`);
  const wsRef = useRef<WebSocket | null>(null);
  const scratchpadTimerRef = useRef<number | null>(null);

  const fetchRooms = async () => {
    try {
      const resp = await fetch('/api/rooms');
      const data = await resp.json();
      if (Array.isArray(data.rooms)) setRoomsList(data.rooms);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/study-room?roomId=${encodeURIComponent(
      activeRoomId
    )}&clientId=${encodeURIComponent(clientIdRef.current)}&name=${encodeURIComponent(
      studentName
    )}&major=${encodeURIComponent(studentMajor)}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'room:init' && msg.room) {
          setRoomState(msg.room);
        } else if (msg.type === 'timer:sync' && msg.pomodoro) {
          setRoomState((prev) => (prev ? { ...prev, pomodoro: msg.pomodoro } : prev));
        } else if (msg.type === 'goals:sync' && msg.goals) {
          setRoomState((prev) => (prev ? { ...prev, goals: msg.goals } : prev));
        } else if (msg.type === 'scratchpad:sync' && msg.scratchpad) {
          setRoomState((prev) => (prev ? { ...prev, scratchpad: msg.scratchpad } : prev));
        } else if (msg.type === 'chat:sync' && msg.chat) {
          setRoomState((prev) => (prev ? { ...prev, chat: msg.chat } : prev));
        } else if (msg.type === 'presence:sync' && msg.members) {
          setRoomState((prev) => (prev ? { ...prev, members: msg.members } : prev));
        }
      } catch {
        // ignore
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [activeRoomId, studentName, studentMajor]);

  const sendRoomEvent = (payload: Record<string, unknown>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    try {
      const resp = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameFa: newRoomName.trim() }),
      });
      const data = await resp.json();
      if (data.room) {
        setRoomsList((prev) => [...prev, data.room]);
        setActiveRoomId(data.room.id);
        setNewRoomName('');
      }
    } catch {
      // ignore
    }
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const goal: StudyGoal = {
      id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      text: newGoalText.trim(),
      author: studentName,
      completed: false,
    };
    sendRoomEvent({ type: 'goal:create', goal });
    setNewGoalText('');
  };

  const handleScratchpadChange = (val: string) => {
    setRoomState((prev) =>
      prev
        ? {
            ...prev,
            scratchpad: { ...prev.scratchpad, content: val, lastEditedBy: studentName },
          }
        : prev
    );
    if (scratchpadTimerRef.current) window.clearTimeout(scratchpadTimerRef.current);
    scratchpadTimerRef.current = window.setTimeout(() => {
      sendRoomEvent({ type: 'scratchpad:update', content: val });
    }, 180);
  };

  const handleSendRoomChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    sendRoomEvent({
      type: 'chat:send',
      message: {
        id: `c-${Date.now()}`,
        sender: studentName,
        text: chatText.trim(),
        timestamp: new Date().toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    });
    setChatText('');
  };

  // ==========================================================================
  // 2. Ambient Soundscape Synthesizer + Personal Focus Timer (Web Audio API)
  // ==========================================================================
  const [rainVol, setRainVol] = useState(0);
  const [libraryVol, setLibraryVol] = useState(0);
  const [alphaVol, setAlphaVol] = useState(0);
  const audioEngineRef = useRef<{
    ctx: AudioContext;
    rainGain: GainNode;
    libGain: GainNode;
    alphaGain: GainNode;
  } | null>(null);

  const ensureAudioEngine = () => {
    if (audioEngineRef.current) {
      if (audioEngineRef.current.ctx.state === 'suspended') {
        audioEngineRef.current.ctx.resume();
      }
      return audioEngineRef.current;
    }

    const ctx = new AudioContext();
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.03 * white) / 1.03;
      lastOut = output[i];
    }

    // Rain (bandpassed white-pink noise)
    const rainSrc = ctx.createBufferSource();
    rainSrc.buffer = noiseBuffer;
    rainSrc.loop = true;
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.value = 1200;
    rainFilter.Q.value = 0.6;
    const rainGain = ctx.createGain();
    rainGain.gain.value = 0;
    rainSrc.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(ctx.destination);
    rainSrc.start();

    // Library warm brown noise
    const libSrc = ctx.createBufferSource();
    libSrc.buffer = noiseBuffer;
    libSrc.loop = true;
    const libFilter = ctx.createBiquadFilter();
    libFilter.type = 'lowpass';
    libFilter.frequency.value = 320;
    const libGain = ctx.createGain();
    libGain.gain.value = 0;
    libSrc.connect(libFilter);
    libFilter.connect(libGain);
    libGain.connect(ctx.destination);
    libSrc.start();

    // Binaural Alpha Focus (200Hz L / 210Hz R subtle pure sine)
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    oscL.frequency.value = 200;
    oscR.frequency.value = 210;
    const alphaGain = ctx.createGain();
    alphaGain.gain.value = 0;
    oscL.connect(alphaGain);
    oscR.connect(alphaGain);
    alphaGain.connect(ctx.destination);
    oscL.start();
    oscR.start();

    audioEngineRef.current = { ctx, rainGain, libGain, alphaGain };
    return audioEngineRef.current;
  };

  useEffect(() => {
    if (!audioEngineRef.current && rainVol === 0 && libraryVol === 0 && alphaVol === 0) return;
    const eng = ensureAudioEngine();
    eng.rainGain.gain.setTargetAtTime(rainVol / 180, eng.ctx.currentTime, 0.08);
    eng.libGain.gain.setTargetAtTime(libraryVol / 120, eng.ctx.currentTime, 0.08);
    eng.alphaGain.gain.setTargetAtTime(alphaVol / 1200, eng.ctx.currentTime, 0.08);
  }, [rainVol, libraryVol, alphaVol]);

  useEffect(() => {
    return () => {
      try {
        audioEngineRef.current?.ctx.close();
      } catch {
        // ignore
      }
    };
  }, []);

  // ==========================================================================
  // 3. University GPA (معدل) Calculator (0-20 Iranian & 4.0 Scale)
  // ==========================================================================
  const [gpaCourses, setGpaCourses] = useState<GpaCourseRow[]>([
    { id: 'c1', name: 'معادلات دیفرانسیل', credits: 3, grade: 18.25 },
    { id: 'c2', name: 'مدارهای الکتریکی ۱', credits: 3, grade: 17.5 },
    { id: 'c3', name: 'ساختمان داده‌ها', credits: 3, grade: 19.0 },
    { id: 'c4', name: 'آزمایشگاه فیزیک ۲', credits: 1, grade: 18.5 },
  ]);
  const [prevCredits, setPrevCredits] = useState(42);
  const [prevGpa, setPrevGpa] = useState(16.8);

  const gpaStats = useMemo(() => {
    let termCredits = 0;
    let termWeighted = 0;
    gpaCourses.forEach((c) => {
      const cr = Math.max(0, Number(c.credits) || 0);
      const gr = Math.min(20, Math.max(0, Number(c.grade) || 0));
      termCredits += cr;
      termWeighted += cr * gr;
    });
    const termGpa = termCredits > 0 ? termWeighted / termCredits : 0;
    const totalCredits = termCredits + Math.max(0, prevCredits);
    const cumulativeGpa =
      totalCredits > 0 ? (termWeighted + Math.max(0, prevCredits) * Math.min(20, Math.max(0, prevGpa))) / totalCredits : 0;
    const gpa4 = Math.min(4, Math.max(0, (cumulativeGpa / 20) * 4));
    return { termCredits, termGpa, totalCredits, cumulativeGpa, gpa4 };
  }, [gpaCourses, prevCredits, prevGpa]);

  const standing = useMemo(() => {
    if (gpaStats.termGpa >= 17) {
      return {
        label: lang === 'fa' ? 'ممتاز (الف)' : "Dean's Honor (A)",
        style: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        Icon: Award,
      };
    }
    if (gpaStats.termGpa >= 12) {
      return {
        label: lang === 'fa' ? 'وضعیت عادی و قبولی' : 'Good Academic Standing',
        style: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
        Icon: CheckCircle2,
      };
    }
    return {
      label: lang === 'fa' ? 'هشدار مشروطی (زیر ۱۲)' : 'Probation Alert (< 12)',
      style: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      Icon: AlertTriangle,
    };
  }, [gpaStats.termGpa, lang]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {lang === 'fa' ? 'اتاق مطالعه اشتراکی و ابزارهای تمرکز' : 'Collaborative Study Rooms & Focus Tools'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'fa'
              ? 'مطالعه هم‌زمان با پومودوروی اشتراکی، صدای محیطی تمرکز و محاسبه‌گر دقیق معدل دانشگاهی'
              : 'Real-time shared study rooms, procedural ambient soundscapes, and university GPA calculator'}
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 self-start overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setSubTab('rooms')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
              subTab === 'rooms'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{lang === 'fa' ? 'اتاق‌های مطالعه زنده' : 'Study Rooms'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('ambient')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
              subTab === 'ambient'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{lang === 'fa' ? 'صدای محیطی تمرکز' : 'Ambient Focus'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('gpa')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
              subTab === 'gpa'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{lang === 'fa' ? 'محاسبه‌گر معدل' : 'GPA Calculator'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: Collaborative Virtual Study Rooms                              */}
      {/* ===================================================================== */}
      {subTab === 'rooms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar: Rooms + Student Identity + Presence */}
          <div className="lg:col-span-4 space-y-5">
            <div className="glass-surface rounded-3xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {lang === 'fa' ? 'نام شما در اتاق' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {lang === 'fa' ? 'رشته تحصیلی' : 'Major'}
                  </label>
                  <input
                    type="text"
                    value={studentMajor}
                    onChange={(e) => setStudentMajor(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {lang === 'fa' ? 'انتخاب تالار مطالعه' : 'Active Study Rooms'}
                </div>
                <div className="space-y-1.5">
                  {roomsList.map((r) => {
                    const selected = r.id === activeRoomId;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setActiveRoomId(r.id)}
                        className={`w-full text-start p-3 rounded-xl border transition-colors cursor-pointer ${
                          selected
                            ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40'
                            : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-sky-300'
                        }`}
                      >
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {lang === 'fa' ? r.nameFa : r.nameEn}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {lang === 'fa' ? r.topicFa : r.topicEn}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleCreateRoom} className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder={lang === 'fa' ? 'ساخت اتاق جدید...' : 'Create new room...'}
                  className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'ساخت' : 'Create'}</span>
                </button>
              </form>
            </div>

            {/* Online Room Members */}
            <div className="glass-surface rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {lang === 'fa' ? 'افراد حاضر در اتاق' : 'Active Members'}
                </h4>
                <span className="text-xs font-mono tabular-nums text-sky-600 dark:text-sky-400">
                  {roomState?.members.length ?? 1}
                </span>
              </div>
              <div className="space-y-2">
                {(roomState?.members || []).map((m) => (
                  <div key={m.clientId} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/60 dark:border-slate-800/60 last:border-0">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{m.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">{m.major}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Collaborative Workspace */}
          <div className="lg:col-span-8 space-y-5">
            {/* Shared Server-Synced Pomodoro Timer */}
            <div className="glass-surface rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {roomState?.pomodoro.phase === 'break'
                    ? lang === 'fa' ? 'استراحت کوتاه گروهی' : 'Shared Short Break'
                    : lang === 'fa' ? 'جلسه تمرکز عمیق گروهی' : 'Shared Focus Session'}
                  {' · '}
                  {lang === 'fa' ? `به‌روزرسانی توسط ${roomState?.pomodoro.updatedBy || 'سیستم'}` : `Synced by ${roomState?.pomodoro.updatedBy || 'Server'}`}
                </div>
                <div className="text-4xl sm:text-5xl font-bold font-mono tabular-nums text-slate-900 dark:text-white tracking-tight">
                  {formatClock(roomState?.pomodoro.remainingSec ?? 1500)}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    sendRoomEvent({
                      type: 'timer:action',
                      action: roomState?.pomodoro.isRunning ? 'pause' : 'start',
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold cursor-pointer"
                >
                  {roomState?.pomodoro.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{roomState?.pomodoro.isRunning ? (lang === 'fa' ? 'توقف' : 'Pause') : (lang === 'fa' ? 'شروع همگانی' : 'Start Sync')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendRoomEvent({ type: 'timer:action', action: 'reset' })}
                  className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title={lang === 'fa' ? 'بازنشانی' : 'Reset'}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    sendRoomEvent({
                      type: 'timer:action',
                      action: 'set_phase',
                      phase: roomState?.pomodoro.phase === 'focus' ? 'break' : 'focus',
                    })
                  }
                  className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {roomState?.pomodoro.phase === 'focus'
                    ? lang === 'fa' ? 'تغییر به استراحت ۵د' : 'Switch to 5m Break'
                    : lang === 'fa' ? 'تغییر به تمرکز ۲۵د' : 'Switch to 25m Focus'}
                </button>
              </div>
            </div>

            {/* Shared Goals + Collaborative Scratchpad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Shared Daily Goals */}
              <div className="glass-surface rounded-3xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {lang === 'fa' ? 'اهداف مشترک امروز' : 'Shared Daily Goals'}
                  </h4>
                  <div className="space-y-2 max-h-[240px] overflow-y-auto">
                    {(roomState?.goals || []).map((g) => (
                      <div
                        key={g.id}
                        className="flex items-start justify-between gap-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-2.5"
                      >
                        <button
                          type="button"
                          onClick={() => sendRoomEvent({ type: 'goal:toggle', goalId: g.id })}
                          className="flex items-start gap-2 text-start cursor-pointer"
                        >
                          {g.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div
                              className={`text-xs sm:text-sm ${
                                g.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                              }`}
                            >
                              {g.text}
                            </div>
                            <div className="text-[11px] text-slate-400">{g.author}</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => sendRoomEvent({ type: 'goal:delete', goalId: g.id })}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddGoal} className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <input
                    type="text"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder={lang === 'fa' ? 'افزودن هدف مطالعاتی...' : 'Add shared study goal...'}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold cursor-pointer"
                  >
                    {lang === 'fa' ? 'ثبت' : 'Add'}
                  </button>
                </form>
              </div>

              {/* Collaborative Scratchpad (Supports LaTeX preview) */}
              <div className="glass-surface rounded-3xl p-5 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {lang === 'fa' ? 'تخته یادداشت مشترک (LaTeX)' : 'Collaborative Scratchpad'}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lang === 'fa'
                        ? `آخرین ویرایش: ${roomState?.scratchpad.lastEditedBy || '—'}`
                        : `Last edit: ${roomState?.scratchpad.lastEditedBy || '—'}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPadPreview((p) => !p)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    {padPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{padPreview ? (lang === 'fa' ? 'ویرایش' : 'Edit') : (lang === 'fa' ? 'رندر فرمول' : 'Preview')}</span>
                  </button>
                </div>

                {padPreview ? (
                  <div className="min-h-[210px] max-h-[250px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-900/75 p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                    <RichMathText text={roomState?.scratchpad.content || ''} />
                  </div>
                ) : (
                  <textarea
                    rows={8}
                    value={roomState?.scratchpad.content || ''}
                    onChange={(e) => handleScratchpadChange(e.target.value)}
                    className="w-full min-h-[210px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 p-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                )}
              </div>
            </div>

            {/* Room Quick Chat */}
            <div className="glass-surface rounded-3xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'گفتگوی سریع اعضای اتاق' : 'Room Study Chat'}
              </h4>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {(roomState?.chat || []).map((c) => (
                  <div key={c.id} className="text-xs sm:text-sm flex items-baseline gap-2">
                    <span className="font-bold text-sky-700 dark:text-sky-400 shrink-0">{c.sender}:</span>
                    <span className="text-slate-800 dark:text-slate-100 flex-1">{c.text}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{c.timestamp}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendRoomChat} className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder={lang === 'fa' ? 'پیام برای هم‌اتاقی‌ها...' : 'Message study partners...'}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'ارسال' : 'Send'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: Ambient Soundscape Mixer (Web Audio API)                       */}
      {/* ===================================================================== */}
      {subTab === 'ambient' && (
        <div className="glass-surface rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'ترکیب‌کننده صدای محیطی برای تمرکز عمیق' : 'Procedural Ambient Soundscape Mixer'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {lang === 'fa'
                  ? 'صدای باران، سکوت گرم کتابخانه و امواج آلفای ۱۰ هرتز با موتور صوتی مرورگر بدون نیاز به اینترنت.'
                  : 'Real-time synthesized rain, warm library brown noise, and 10Hz alpha focus waves.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setRainVol(0);
                setLibraryVol(0);
                setAlphaVol(0);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <VolumeX className="w-4 h-4" />
              <span>{lang === 'fa' ? 'بی‌صدا کردن همه' : 'Mute All'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: lang === 'fa' ? 'باران ملایم آزمایشگاه' : 'Soft Studio Rain',
                desc: lang === 'fa' ? 'فیلتر باندگذر ۱۲۰۰ هرتز برای حذف نویز حواس‌پرتی' : 'Bandpass acoustic rain masking distractions',
                value: rainVol,
                onChange: setRainVol,
              },
              {
                title: lang === 'fa' ? 'فضای کتابخانه دانشگاه' : 'University Library Ambience',
                desc: lang === 'fa' ? 'نویز قهوه‌ای گرم و آرام‌بخش برای مطالعه طولانی' : 'Warm low-pass brown noise for deep reading',
                value: libraryVol,
                onChange: setLibraryVol,
              },
              {
                title: lang === 'fa' ? 'فرکانس تمرکز آلفا (10Hz)' : '10Hz Alpha Focus Wave',
                desc: lang === 'fa' ? 'تفاوت فاز ۲۰۰ و ۲۱۰ هرتز برای حل مسائل ریاضی' : '200/210Hz binaural tone for analytical focus',
                value: alphaVol,
                onChange: setAlphaVol,
              },
            ].map((ch, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ch.title}</h4>
                  <span className="font-mono text-xs tabular-nums text-sky-600 dark:text-sky-400">{ch.value}%</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{ch.desc}</p>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={ch.value}
                  onChange={(e) => ch.onChange(Number(e.target.value))}
                  aria-label={ch.title}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: University GPA (معدل) Calculator                               */}
      {/* ===================================================================== */}
      {subTab === 'gpa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 glass-surface rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'دروس ترم جاری (مقیاس ۰ تا ۲۰)' : 'Current Semester Courses (0–20 Scale)'}
              </h3>
              <button
                type="button"
                onClick={() =>
                  setGpaCourses((prev) => [
                    ...prev,
                    { id: `c-${Date.now()}`, name: lang === 'fa' ? 'درس جدید' : 'New Course', credits: 3, grade: 16 },
                  ])
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'افزودن درس' : 'Add Course'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {gpaCourses.map((row) => (
                <div key={row.id} className="grid grid-cols-12 gap-2.5 items-center">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      setGpaCourses((prev) => prev.map((r) => (r.id === row.id ? { ...r, name: e.target.value } : r)))
                    }
                    className="col-span-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={row.credits}
                    onChange={(e) =>
                      setGpaCourses((prev) =>
                        prev.map((r) => (r.id === row.id ? { ...r, credits: Number(e.target.value) } : r))
                      )
                    }
                    aria-label={lang === 'fa' ? 'تعداد واحد' : 'Credits'}
                    className="col-span-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-2.5 py-2 text-xs sm:text-sm font-mono tabular-nums text-center text-slate-900 dark:text-white"
                  />
                  <input
                    type="number"
                    min={0}
                    max={20}
                    step={0.25}
                    value={row.grade}
                    onChange={(e) =>
                      setGpaCourses((prev) =>
                        prev.map((r) => (r.id === row.id ? { ...r, grade: Number(e.target.value) } : r))
                      )
                    }
                    aria-label={lang === 'fa' ? 'نمره' : 'Grade'}
                    className="col-span-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-2.5 py-2 text-xs sm:text-sm font-mono tabular-nums text-center text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setGpaCourses((prev) => prev.filter((r) => r.id !== row.id))}
                    className="col-span-1 flex justify-center text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 glass-surface rounded-3xl p-6 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'کارنامه و معدل کل' : 'GPA & Standing Summary'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'واحدهای گذرانده قبلی' : 'Previous Credits'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={prevCredits}
                  onChange={(e) => setPrevCredits(Number(e.target.value))}
                  className="w-full mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'معدل کل قبلی' : 'Previous GPA'}
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.01}
                  value={prevGpa}
                  onChange={(e) => setPrevGpa(Number(e.target.value))}
                  className="w-full mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300">{lang === 'fa' ? 'معدل این ترم' : 'Term GPA'}</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400">
                  {gpaStats.termGpa.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300">{lang === 'fa' ? 'معدل کل تجمعی' : 'Cumulative GPA'}</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {gpaStats.cumulativeGpa.toFixed(2)} / 20
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300">{lang === 'fa' ? 'معادل بین‌المللی (۴.۰)' : '4.0 Scale Equivalent'}</span>
                <span className="text-sm font-bold font-mono tabular-nums text-slate-700 dark:text-slate-200">
                  {gpaStats.gpa4.toFixed(2)} / 4.00
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold ${standing.style}`}>
              <standing.Icon className="w-4 h-4 shrink-0" />
              <span>{standing.label}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
