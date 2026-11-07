import React, { useEffect, useState } from 'react';
import { BugSpec, LevelConfig, LEVELS, LevelId } from '../data/levels';
import { DetectiveUser, LevelScoreRecord } from '../types/auth';
import { MockLevelStages } from './MockLevelStages';

interface GameArenaProps {
  level: LevelConfig;
  currentUser: DetectiveUser | null;
  onSelectLevel: (levelId: LevelId) => void;
  onExitToHero: () => void;
  onOpenAuth: () => void;
  onSaveScore: (record: LevelScoreRecord) => void;
}

interface MissRipple {
  id: number;
  x: number;
  y: number;
}

export const GameArena: React.FC<GameArenaProps> = ({
  level,
  currentUser,
  onSelectLevel,
  onExitToHero,
  onOpenAuth,
  onSaveScore,
}) => {
  const [foundBugIds, setFoundBugIds] = useState<string[]>([]);
  const [clicksLeft, setClicksLeft] = useState<number>(level.maxClicks);
  const [timeLeft, setTimeLeft] = useState<number>(level.timeLimitSeconds);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [activeBugToast, setActiveBugToast] = useState<BugSpec | null>(null);
  const [hintBugId, setHintBugId] = useState<string | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);
  const [missRipples, setMissRipples] = useState<MissRipple[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost-clicks' | 'lost-time'>(
    'playing'
  );

  // Reset level state when level changes
  useEffect(() => {
    setFoundBugIds([]);
    setClicksLeft(level.maxClicks);
    setTimeLeft(level.timeLimitSeconds);
    setScore(0);
    setStreak(0);
    setActiveBugToast(null);
    setHintBugId(null);
    setHintText(null);
    setMissRipples([]);
    setGameState('playing');
  }, [level]);

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setGameState('lost-time');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gameState]);

  // Save score when game ends
  useEffect(() => {
    if (gameState === 'playing') return;

    const completed = gameState === 'won';
    const clickBonus = completed ? clicksLeft * level.clickBonusPoints : 0;
    const timeBonus = completed ? timeLeft * level.timeBonusPoints : 0;
    const finalScore = score + clickBonus + timeBonus;

    onSaveScore({
      levelId: level.id,
      bestScore: finalScore,
      bugsFound: foundBugIds.length,
      totalBugs: level.bugs.length,
      timeRemaining: timeLeft,
      clicksRemaining: clicksLeft,
      completed,
      updatedAt: new Date().toISOString(),
    });
  }, [gameState]);

  const handleBugClick = (bugId: string, _e: React.MouseEvent) => {
    if (gameState !== 'playing') return;

    // Ignore if already found
    if (foundBugIds.includes(bugId)) {
      const existingBug = level.bugs.find((b) => b.id === bugId) || null;
      setActiveBugToast(existingBug);
      return;
    }

    const nextClicks = clicksLeft - 1;
    setClicksLeft(nextClicks);

    const newStreak = streak + 1;
    setStreak(newStreak);
    const multiplier = newStreak >= 3 ? 1.5 : newStreak === 2 ? 1.25 : 1;
    const earned = Math.round(level.basePointsPerBug * multiplier);

    const nextFound = [...foundBugIds, bugId];
    setFoundBugIds(nextFound);
    setScore((prev) => prev + earned);

    const bugObj = level.bugs.find((b) => b.id === bugId) || null;
    setActiveBugToast(bugObj);

    if (hintBugId === bugId) {
      setHintBugId(null);
      setHintText(null);
    }

    if (nextFound.length >= level.bugs.length) {
      setGameState('won');
    } else if (nextClicks <= 0) {
      setGameState('lost-clicks');
    }
  };

  const handleViewportMissClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now() + Math.random();

    setMissRipples((prev) => [...prev, { id: rippleId, x, y }]);
    window.setTimeout(() => {
      setMissRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 650);

    setStreak(0);
    const nextClicks = clicksLeft - 1;
    setClicksLeft(nextClicks);

    if (nextClicks <= 0) {
      setGameState('lost-clicks');
    }
  };

  const handleUseRadarHint = () => {
    if (gameState !== 'playing') return;
    const unfound = level.bugs.find((b) => !foundBugIds.includes(b.id));
    if (!unfound) return;

    setHintBugId(unfound.id);
    setHintText(unfound.hint);
    if (level.id !== 'demo') {
      setScore((prev) => Math.max(0, prev - 50));
    }
  };

  const handleResetLevel = () => {
    setFoundBugIds([]);
    setClicksLeft(level.maxClicks);
    setTimeLeft(level.timeLimitSeconds);
    setScore(0);
    setStreak(0);
    setActiveBugToast(null);
    setHintBugId(null);
    setHintText(null);
    setGameState('playing');
  };

  const nextLevel = LEVELS.find((l) => l.index === level.index + 1) || null;
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const clickBonus = gameState === 'won' ? clicksLeft * level.clickBonusPoints : 0;
  const timeBonus = gameState === 'won' ? timeLeft * level.timeBonusPoints : 0;
  const totalFinalScore = score + clickBonus + timeBonus;

  return (
    <div className="min-h-screen bg-[#f4f3ef] text-stone-900 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Top Detective Control Bar (Bright Light Theme) */}
        <div className="bg-white border border-black/10 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExitToHero}
              className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              ← Home
            </button>

            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-stone-950 border border-black/10"
                style={{ backgroundColor: level.badgeColor }}
              >
                {level.label}
              </span>
              <span className="font-bold text-base sm:text-lg text-stone-900">{level.title}</span>
            </div>

            {/* Level Switcher Pills */}
            <div className="flex flex-wrap items-center gap-1.5 ml-0 sm:ml-2 pl-0 sm:pl-3 sm:border-l border-stone-200">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onSelectLevel(lvl.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    lvl.id === level.id
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Telemetry Counters: Bugs, Clicks, Time, Points */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Bugs Found */}
            <div className="px-3.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-2">
              <span className="text-xs text-stone-600">UI Bugs:</span>
              <span className="font-mono font-bold text-sm text-sky-700">
                {foundBugIds.length} / {level.bugs.length}
              </span>
            </div>

            {/* Clicks Remaining */}
            <div
              className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 ${
                clicksLeft <= 2
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            >
              <span className="text-xs text-stone-500">Clicks Left:</span>
              <span className="font-mono font-bold text-sm">{clicksLeft}</span>
            </div>

            {/* Timer */}
            <div
              className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 ${
                timeLeft <= 15
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            >
              <span className="text-xs text-stone-500">Time:</span>
              <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
            </div>

            {/* Points */}
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <span className="text-xs text-stone-600">Points:</span>
              <span className="font-mono font-bold text-sm text-emerald-700">{score}</span>
              {streak >= 2 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">
                  {streak}x
                </span>
              )}
            </div>

            {/* Radar Hint Button */}
            <button
              type="button"
              onClick={handleUseRadarHint}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              📡 Hint {level.id === 'demo' ? '(Free)' : '(-50 pts)'}
            </button>

            <button
              type="button"
              onClick={handleResetLevel}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
            >
              ↻ Reset
            </button>
          </div>
        </div>

        {/* Briefing & Active Hint Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-black/10 rounded-xl px-4 py-3 text-xs shadow-sm">
          <div className="text-stone-700">
            <strong className="text-sky-700 font-mono mr-2">{level.caseCode}:</strong>
            {level.briefing}
          </div>
          {hintText && (
            <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 font-medium shrink-0">
              💡 Hint: {hintText}
            </div>
          )}
        </div>

        {/* Main Split Layout: Mock Browser Stage (Left 8 cols) + Forensics DevTools (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Simulated Browser Viewport (Light Chrome) */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-stone-300 shadow-lg bg-white">
            {/* Browser Top Chrome */}
            <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 max-w-md bg-white border border-stone-200 rounded-lg px-3 py-1 text-xs font-mono text-stone-600 truncate text-center">
                🔒 {level.mockUrl}
              </div>
              <div className="text-[11px] font-mono font-bold text-sky-700">
                INSPECTOR: ON
              </div>
            </div>

            {/* Interactive Mock Website Canvas */}
            <div
              onClick={handleViewportMissClick}
              className="relative cursor-crosshair overflow-hidden"
            >
              <MockLevelStages
                levelId={level.id}
                foundBugIds={foundBugIds}
                hintBugId={hintBugId}
                onBugClick={handleBugClick}
              />

              {/* Miss Click Ripples */}
              {missRipples.map((r) => (
                <div
                  key={r.id}
                  style={{ left: r.x, top: r.y }}
                  className="pointer-events-none absolute z-50 animate-miss-ripple"
                >
                  <div className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-mono font-bold text-[11px] shadow-lg border border-white whitespace-nowrap">
                    ✕ Miss! -1 Click
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: NexaSoul DevTools Forensics Log (Light Theme) */}
          <div className="lg:col-span-4 bg-white border border-black/10 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/compass-logo.jpeg"
                  alt="NexaSoul"
                  className="w-6 h-6 rounded-full object-cover border border-black/15"
                />
                <span className="font-mono font-bold text-sm text-stone-900">
                  NEXASOUL DEVTOOLS // AUDIT
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-sky-700">
                {foundBugIds.length}/{level.bugs.length} Solved
              </span>
            </div>

            {/* Active Selected Bug Forensics Card */}
            {activeBugToast ? (
              <div className="p-4 rounded-xl bg-stone-50 border border-sky-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    {activeBugToast.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700">
                    +{level.basePointsPerBug} Base Pts
                  </span>
                </div>
                <div className="font-bold text-sm text-stone-900">
                  Bug #{activeBugToast.number}: {activeBugToast.title}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {activeBugToast.description}
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono font-bold text-rose-700 uppercase">
                    ✕ Broken Code:
                  </div>
                  <pre className="p-2 rounded bg-rose-50 border border-rose-200 text-[11px] font-mono text-rose-900 overflow-x-auto">
                    {activeBugToast.brokenCode}
                  </pre>
                  <div className="text-[10px] font-mono font-bold text-emerald-700 uppercase pt-1">
                    ✓ Fixed Code:
                  </div>
                  <pre className="p-2 rounded bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-900 overflow-x-auto">
                    {activeBugToast.fixedCode}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 leading-relaxed">
                Click directly on any visual UI defect inside the browser viewport on the left to
                capture it and inspect its broken CSS/JSX code here.
              </div>
            )}

            {/* Bug Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                Case Bug Checklist (Max 6)
              </div>
              {level.bugs.map((bug) => {
                const isSolved = foundBugIds.includes(bug.id);
                return (
                  <button
                    key={bug.id}
                    type="button"
                    onClick={() => isSolved && setActiveBugToast(bug)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      isSolved
                        ? 'bg-sky-50 border-sky-300 text-stone-900 cursor-pointer hover:bg-sky-100'
                        : 'bg-stone-50 border-stone-200 text-stone-400 cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                          isSolved
                            ? 'bg-sky-600 text-white'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {isSolved ? '✓' : bug.number}
                      </span>
                      <span className="truncate font-medium">
                        {isSolved ? bug.title : `Unidentified UI Error #${bug.number}`}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono ml-2 shrink-0">
                      {isSolved ? 'INSPECT' : bug.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Win / Loss Modal Overlay (Light Theme, Top-Safe Alignment) */}
      {gameState !== 'playing' && (
        <div className="fixed inset-0 z-50 bg-stone-900/45 backdrop-blur-sm flex items-start justify-center pt-20 pb-10 px-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-black/15 rounded-3xl p-6 sm:p-8 text-stone-900 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                  gameState === 'won'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {gameState === 'won'
                  ? 'CASE SOLVED // ALL BUGS SQUASHED'
                  : gameState === 'lost-clicks'
                  ? 'OUT OF CLICKS // AUDIT TERMINATED'
                  : 'TIME EXPIRED // DEPLOYMENT FAILED'}
              </span>
              <img
                src="/assets/nexasoul-logo.png"
                alt="NexaSoul"
                className="h-6 object-contain"
              />
            </div>

            <div>
              <h3
                className="text-2xl font-bold text-stone-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {gameState === 'won'
                  ? `Flawless Audit on ${level.title}!`
                  : `Investigation Incomplete (${foundBugIds.length}/${level.bugs.length} Bugs)`}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {currentUser
                  ? `Logged under Detective ${currentUser.name} (UID: ${currentUser.uid} • Sem ${currentUser.semester})`
                  : 'Playing as Guest Detective — Register your UID to save your official rank!'}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-stone-600">
                <span>Bugs Identified ({foundBugIds.length}/{level.bugs.length}):</span>
                <span className="font-bold text-stone-900">{score} pts</span>
              </div>
              <div className="flex justify-between text-sky-700">
                <span>Click Accuracy Bonus ({clicksLeft} clicks left):</span>
                <span className="font-bold">+{clickBonus} pts</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Speed Bonus ({timeLeft}s remaining):</span>
                <span className="font-bold">+{timeBonus} pts</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
                <span>TOTAL CASE SCORE:</span>
                <span className="text-emerald-700">{totalFinalScore} PTS</span>
              </div>
            </div>

            {!currentUser && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
              >
                🔐 Register / Login with UID to Claim Score
              </button>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={handleResetLevel}
                className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                ↻ Replay {level.label}
              </button>

              {nextLevel && (
                <button
                  type="button"
                  onClick={() => onSelectLevel(nextLevel.id)}
                  className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-sky-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Next Level: {nextLevel.label} →
                </button>
              )}

              <button
                type="button"
                onClick={onExitToHero}
                className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs text-stone-700 font-medium cursor-pointer"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
