import React, { useEffect, useRef, useState } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import { LEVELS, LevelId } from '../data/levels';
import { DetectiveUser } from '../types/auth';

interface HeroLandingProps {
  currentUser: DetectiveUser | null;
  onStartLevel: (levelId: LevelId) => void;
  onOpenLevelSelector: () => void;
  onOpenAuth: () => void;
  onOpenManual: () => void;
  onOpenNexaSoul: () => void;
}

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4';

const SENSITIVITY = 0.8;

export const HeroLanding: React.FC<HeroLandingProps> = ({
  currentUser,
  onStartLevel,
  onOpenLevelSelector,
  onOpenAuth,
  onOpenManual,
  onOpenNexaSoul,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const { displayed, done } = useTypewriter(
    'Sharp eyes tend to find us. Spot up to 6 UI errors per screen before your time or clicks run out.',
    38,
    600
  );

  // Pills become visible 400ms after page load, independent of typewriter
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => window.clearTimeout(timer);
  }, []);

  // Mouse-scrub controlled background video
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      if (!video || !video.duration || Number.isNaN(video.duration)) {
        prevXRef.current = e.clientX;
        return;
      }

      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        targetTimeRef.current = video.currentTime || 0;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      const clamped = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeOffset));
      targetTimeRef.current = clamped;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleVideoSeeked = () => {
    const video = videoRef.current;
    if (!video) {
      isSeekingRef.current = false;
      return;
    }
    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  const handleCopyWebsite = () => {
    navigator.clipboard.writeText('https://nexasoul.vercel.app').catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const whitePills = [
    { label: 'Play Demo Level', action: () => onStartLevel('demo') },
    { label: 'Select Level (5 Modes)', action: onOpenLevelSelector },
    { label: 'Detective Login / Register', action: onOpenAuth },
    { label: 'How to Inspect Bugs', action: onOpenManual },
  ];

  return (
    <div className="relative w-full">
      {/* BACKGROUND VIDEO (mouse-scrub controlled) */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        onSeeked={handleVideoSeeked}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          objectFit: 'cover',
          objectPosition: '70% center',
          width: '100%',
          height: '100%',
        }}
      />

      {/* HERO SECTION (z-index: 1) - pt-24 sm:pt-28 prevents any overlap with the fixed Navbar */}
      <section
        style={{ zIndex: 1 }}
        className="relative min-h-screen flex flex-col justify-end md:justify-center pt-24 sm:pt-28 pb-12 px-5 sm:px-8 md:px-10 overflow-hidden"
      >
        <div className="max-w-xl relative z-10">
          {/* 1. Blurred intro label (Adapted for Frontendive by NexaSoul) */}
          <div
            className="pointer-events-none select-none mb-4 sm:mb-5"
            style={{
              fontSize: 'clamp(18px, 3.6vw, 25px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#000',
              filter: 'blur(3.5px)',
            }}
          >
            Hey Detective, welcome to FRONTENDIVE,
            <br />
            NexaSoul&apos;s Interactive Frontend Bug-Hunting Game
          </div>

          {/* 2. Typewriter text */}
          <p
            className="text-black mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 3.6vw, 25px)',
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: '64px',
            }}
          >
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
            )}
          </p>

          {/* 3. Action pill buttons */}
          <div
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
            className="flex flex-wrap gap-y-1"
          >
            {whitePills.map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={pill.action}
                className="inline-flex items-center justify-center bg-white text-black border border-black/15 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.35em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer shadow-sm"
              >
                {pill.label}
              </button>
            ))}

            {/* 1 outline pill button */}
            <button
              type="button"
              onClick={handleCopyWebsite}
              className="inline-flex items-center justify-center text-black bg-white/60 backdrop-blur-sm border border-black/40 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.35em] mx-[0.2em] mb-[0.4em] whitespace-nowrap gap-2 sm:gap-3 hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <span>
                NexaSoul Portal:{' '}
                <span className="underline underline-offset-2 font-medium">
                  {copied ? 'Copied nexasoul.vercel.app!' : 'nexasoul.vercel.app'}
                </span>
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="4"
                  width="6.5"
                  height="6.5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M8 2.5V2C8 1.44772 7.55228 1 7 1H2C1.44772 1 1 1.44772 1 2V7C1 7.55228 1.44772 8 2 8H2.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </button>
          </div>

          {/* Light Frosted-Glass Quick Level Card (No heavy dark colors) */}
          <div
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.55s ease, transform 0.55s ease',
            }}
            className="mt-4 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-black/15 text-stone-900 shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/nexasoul-logo.png"
                  alt="NexaSoul"
                  className="h-5 object-contain"
                />
                <span className="text-xs uppercase tracking-wider text-stone-700 font-semibold">
                  5 Detective Levels (Max 6 UI Errors / Screen)
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenNexaSoul}
                className="text-xs font-semibold text-sky-700 hover:underline"
              >
                About NexaSoul ↗
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onStartLevel(lvl.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-black hover:text-white text-stone-900 border border-black/10 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20"
                    style={{ backgroundColor: lvl.badgeColor }}
                  />
                  <span>{lvl.label}</span>
                  <span className="text-[10px] opacity-65">({lvl.bugs.length} bugs)</span>
                </button>
              ))}
            </div>

            {currentUser ? (
              <div className="mt-3 pt-2.5 border-t border-black/10 flex items-center justify-between text-xs text-stone-700">
                <span>
                  Detective: <strong className="text-black">{currentUser.name}</strong> ({currentUser.uid} • Sem {currentUser.semester})
                </span>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="text-sky-700 font-semibold hover:underline"
                >
                  Account
                </button>
              </div>
            ) : (
              <div className="mt-3 pt-2.5 border-t border-black/10 flex items-center justify-between text-xs text-amber-900">
                <span>🔒 <strong>Login / Registration Required:</strong> Sign in with your UID to unlock gameplay!</span>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="text-black font-semibold underline underline-offset-2 hover:opacity-70"
                >
                  Register / Login →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
