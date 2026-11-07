import React, { useState } from 'react';
import { DetectiveUser } from '../types/auth';

interface NavbarProps {
  currentUser: DetectiveUser | null;
  onNavigateHome: () => void;
  onOpenLevels: () => void;
  onOpenManual: () => void;
  onOpenScoreboard: () => void;
  onOpenNexaSoul: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onNavigateHome,
  onOpenLevels,
  onOpenManual,
  onOpenScoreboard,
  onOpenNexaSoul,
  onOpenAuth,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Levels', action: onOpenLevels },
    { label: 'How to Play', action: onOpenManual },
    { label: 'Scoreboard', action: onOpenScoreboard },
    { label: 'NexaSoul', action: onOpenNexaSoul },
  ];

  const handleMobileAction = (fn: () => void) => {
    setMenuOpen(false);
    fn();
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-20 px-5 sm:px-8 h-16 sm:h-20 bg-white/75 backdrop-blur-md border-b border-black/10 flex flex-row justify-between items-center">
        {/* Logo (left) - Properly aligned in a single row */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex flex-row items-center gap-2.5 sm:gap-3 text-left focus:outline-none group shrink-0"
        >
          <img
            src="/assets/compass-logo.jpeg"
            alt="NexaSoul Compass"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-black/20 shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="flex items-center gap-1.5">
            <span
              className="text-[20px] sm:text-[25px] leading-none tracking-tight text-black"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Frontendive®
            </span>
            <span
              className="text-[22px] sm:text-[26px] leading-none text-black select-none"
              style={{ letterSpacing: '-0.02em' }}
            >
              ✳︎
            </span>
          </div>
          <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/5 text-black/75 border border-black/10">
            by NexaSoul
          </span>
        </button>

        {/* Desktop nav links (center, hidden below md) */}
        <nav className="hidden md:flex flex-row items-center text-[19px] lg:text-[22px] leading-none text-black">
          {navLinks.map((item, index) => (
            <React.Fragment key={item.label}>
              <button
                type="button"
                onClick={item.action}
                className="hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-0 p-0 text-[19px] lg:text-[22px] leading-none text-black"
              >
                {item.label}
              </button>
              {index < navLinks.length - 1 && <span className="select-none">,&nbsp;</span>}
            </React.Fragment>
          ))}
        </nav>

        {/* Desktop CTA (right, hidden below md) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href="#auth-portal"
            onClick={(e) => {
              e.preventDefault();
              onOpenAuth();
            }}
            className="text-[19px] lg:text-[22px] leading-none text-black underline underline-offset-4 hover:opacity-60 transition-opacity"
          >
            {currentUser ? `${currentUser.name} (${currentUser.uid})` : 'Login / Register'}
          </a>
        </div>

        {/* Mobile hamburger (visible below md) */}
        <button
          type="button"
          aria-label="Toggle Menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] p-2 focus:outline-none"
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay (z-index: 15) */}
      <div
        style={{
          zIndex: 15,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
        className="fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-7 transition-opacity duration-300 md:hidden"
      >
        <div className="flex items-center gap-3 mb-2">
          <img
            src="/assets/nexasoul-logo.png"
            alt="NexaSoul"
            className="h-10 object-contain"
          />
        </div>
        {navLinks.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleMobileAction(item.action)}
            className="text-[30px] font-medium text-black hover:opacity-60 transition-opacity text-left"
          >
            {item.label}
          </button>
        ))}
        <a
          href="#auth-portal"
          onClick={(e) => {
            e.preventDefault();
            handleMobileAction(onOpenAuth);
          }}
          className="text-[30px] font-medium text-black underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          {currentUser ? `${currentUser.name} (${currentUser.uid})` : 'Login / Register'}
        </a>
      </div>
    </>
  );
};
