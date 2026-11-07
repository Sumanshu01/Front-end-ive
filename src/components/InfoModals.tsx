import React from 'react';
import { LevelId } from '../data/levels';

interface ManualModalProps {
  onClose: () => void;
  onStartDemo: () => void;
}

export const HowToPlayModal: React.FC<ManualModalProps> = ({ onClose, onStartDemo }) => {
  return (
    <div className="fixed inset-0 z-50 bg-stone-900/45 backdrop-blur-sm flex items-start justify-center pt-20 pb-10 px-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#f8f7f4] border border-black/15 rounded-3xl overflow-hidden text-stone-900 shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-lime-500" />
        <div className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div className="flex items-center gap-3">
              <img
                src="/assets/compass-logo.jpeg"
                alt="NexaSoul"
                className="w-10 h-10 rounded-full object-cover border border-black/15"
              />
              <div>
                <h2
                  className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  How Frontendive® Works
                </h2>
                <p className="text-xs text-stone-500">
                  Official NexaSoul Frontend Detective Field Manual
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-stone-200/80 hover:bg-stone-300 text-stone-800 text-xs font-medium cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1.5">
              <div className="text-sky-700 font-mono font-bold">01 // CLICK ON UI ERRORS</div>
              <p className="text-stone-600 leading-relaxed">
                Each screen simulates a live website with 4 to 6 real-world frontend bugs (broken
                CSS layouts, z-index collisions, contrast failures, template leaks, overflow). Click
                directly on any buggy element to capture it!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1.5">
              <div className="text-emerald-700 font-mono font-bold">02 // LIMITED CLICKS &amp; TIME</div>
              <p className="text-stone-600 leading-relaxed">
                Every click inside the viewport counts. Clicking on normal UI deducts 1 click and
                resets your streak multiplier. Unused clicks and remaining seconds grant bonus
                points!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1.5">
              <div className="text-amber-700 font-mono font-bold">03 // 5 DIFFICULTY TIERS</div>
              <p className="text-stone-600 leading-relaxed">
                Progress through <strong>DEMO</strong>, <strong>EASY</strong>,{' '}
                <strong>MEDIUM</strong>, <strong>HARD</strong>, and <strong>NIGHTMARE</strong>. Each
                level contains a maximum of 6 handcrafted frontend errors.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1.5">
              <div className="text-purple-700 font-mono font-bold">
                04 // DEVTOOLS CODE FORENSICS
              </div>
              <p className="text-stone-600 leading-relaxed">
                Whenever you identify a UI error, the NexaSoul DevTools panel reveals the exact
                broken JSX/CSS snippet alongside the production fix so you sharpen real engineering
                skills.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onStartDemo}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Launch Demo Level →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NexaSoulModalProps {
  onClose: () => void;
  onSelectLevel: (levelId: LevelId) => void;
}

export const NexaSoulModal: React.FC<NexaSoulModalProps> = ({ onClose, onSelectLevel }) => {
  return (
    <div className="fixed inset-0 z-50 bg-stone-900/45 backdrop-blur-sm flex items-start justify-center pt-20 pb-10 px-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#f8f7f4] border border-black/15 rounded-3xl overflow-hidden text-stone-900 shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-lime-500" />
        <div className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-black/10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-700">
              CODE. CONNECT. CONQUER — &lt;/&gt;
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-stone-200/80 hover:bg-stone-300 text-stone-800 text-xs font-medium cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          {/* Both Official Logos Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <img
                src="/assets/compass-logo.jpeg"
                alt="NexaSoul Compass Emblem"
                className="w-32 h-32 rounded-2xl object-cover border border-black/15 shadow-md"
              />
              <span className="text-[11px] font-mono text-stone-500 mt-2">
                NexaSoul Compass Emblem
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 w-full flex items-center justify-center">
                <img
                  src="/assets/nexasoul-logo.png"
                  alt="NexaSoul Official Logo"
                  className="max-h-24 object-contain"
                />
              </div>
              <span className="text-[11px] font-mono text-stone-500 mt-2">
                NexaSoul Official 3D Wordmark
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3
              className="text-2xl font-bold text-stone-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              NexaSoul — Frontend × Full Stack Development Club
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              <strong>FRONTENDIVE</strong> is crafted by NexaSoul to challenge developers, designers,
              and engineers to spot subtle UI/UX and CSS implementation flaws under pressure.
            </p>
          </div>

          {/* Official Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a
              href="https://nexasoul.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-sky-500 flex items-center justify-between transition-colors shadow-sm"
            >
              <span className="text-stone-700">
                NEXASOUL WEBSITE:{' '}
                <strong className="text-sky-700 underline">nexasoul.vercel.app</strong>
              </span>
              <span className="text-sky-700 font-bold">↗</span>
            </a>

            <a
              href="https://linktr.ee/nexasoul_cu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 flex items-center justify-between transition-colors shadow-sm"
            >
              <span className="text-stone-700">
                Linktr.ee:{' '}
                <strong className="text-emerald-700 underline">linktr.ee/nexasoul_cu</strong>
              </span>
              <span className="text-emerald-700 font-bold">↗</span>
            </a>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectLevel('nightmare');
              }}
              className="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-rose-600 transition-colors cursor-pointer"
            >
              🔥 Try Level 5: NexaSoul AI OS (Nightmare)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
