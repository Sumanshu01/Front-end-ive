import React from 'react';
import { LevelId, LEVELS } from '../data/levels';

interface FooterProps {
  onSelectLevel: (levelId: LevelId) => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectLevel,
  onOpenAuth,
  onOpenAdmin,
}) => {
  return (
    <footer className="relative z-10 bg-[#f4f3ef]/95 backdrop-blur-md text-stone-900 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-9">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Col 1: NexaSoul Logos & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/compass-logo.jpeg"
                alt="NexaSoul Compass Emblem"
                className="w-11 h-11 rounded-full object-cover border border-black/15 shadow-sm"
              />
              <img
                src="/assets/nexasoul-logo.png"
                alt="NexaSoul Wordmark"
                className="h-9 object-contain bg-white px-2.5 py-1 rounded-xl border border-black/10 shadow-sm"
              />
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm leading-relaxed">
              <strong className="text-stone-900">FRONTENDIVE® BY NEXASOUL</strong> — Frontend × Full
              Stack Development Club. Code. Connect. Conquer.
            </p>
          </div>

          {/* Col 2: Quick Level Jump */}
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 mb-3">
              5 Investigation Levels
            </div>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onSelectLevel(lvl.id)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-900 hover:text-white border border-black/10 text-stone-800 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  {lvl.index}. {lvl.label}
                </button>
              ))}
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Detective Login / Register
              </button>
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenAdmin();
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Admin Portal (/admin)
              </a>
            </div>
          </div>

          {/* Col 3: Official NexaSoul Links */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 mb-2">
              Official NexaSoul Links
            </div>
            <div className="flex flex-col gap-2 text-xs sm:text-sm">
              <a
                href="https://nexasoul.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 border border-black/10 hover:border-sky-400 transition-all shadow-sm group"
              >
                <span className="text-stone-700 group-hover:text-stone-900">
                  NEXASOUL WEBSITE:{' '}
                  <strong className="text-sky-700 underline underline-offset-2">
                    nexasoul.vercel.app
                  </strong>
                </span>
                <span className="text-sky-700 font-bold">↗</span>
              </a>

              <a
                href="https://linktr.ee/nexasoul_cu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-black/10 hover:border-emerald-400 transition-all shadow-sm group"
              >
                <span className="text-stone-700 group-hover:text-stone-900">
                  Linktr.ee:{' '}
                  <strong className="text-emerald-700 underline underline-offset-2">
                    https://linktr.ee/nexasoul_cu
                  </strong>
                </span>
                <span className="text-emerald-700 font-bold">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-7 pt-5 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="space-y-1 text-center sm:text-left">
            <div>
              © {new Date().getFullYear()} Frontendive® by NexaSoul — Frontend × Full Stack Development Club.
            </div>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <a
              href="https://nexasoul.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900 transition-colors"
            >
              nexasoul.vercel.app
            </a>
            <span>•</span>
            <a
              href="https://linktr.ee/nexasoul_cu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900 transition-colors"
            >
              linktr.ee/nexasoul_cu
            </a>
            <span>•</span>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                onOpenAdmin();
              }}
              className="hover:text-stone-900 transition-colors font-mono"
            >
              /admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
