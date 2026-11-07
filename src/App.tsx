import React, { useEffect, useState } from 'react';
import { LEVELS, LevelId } from './data/levels';
import {
  DetectiveUser,
  LevelScoreRecord,
  UserScoresMap,
  getAllUserScores,
  getCurrentSessionUser,
  saveUserLevelScore,
  setCurrentSessionUid,
} from './types/auth';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { GameArena } from './components/GameArena';
import { AuthPage } from './components/AuthPage';
import { LevelSelectorModal } from './components/LevelSelectorModal';
import { HowToPlayModal, NexaSoulModal } from './components/InfoModals';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';

function isUrlAdmin(): boolean {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || hash === '#admin';
}

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<DetectiveUser | null>(() =>
    getCurrentSessionUser()
  );
  const [allScores, setAllScores] = useState<UserScoresMap>(() => getAllUserScores());

  const [activeView, setActiveView] = useState<'hero' | 'game' | 'admin'>(() =>
    isUrlAdmin() ? 'admin' : 'hero'
  );
  const [selectedLevelId, setSelectedLevelId] = useState<LevelId>('demo');
  const [pendingLevelId, setPendingLevelId] = useState<LevelId | null>(null);
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [levelModalTab, setLevelModalTab] = useState<'levels' | 'scoreboard' | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showNexaSoulModal, setShowNexaSoulModal] = useState(false);

  // Sync URL /admin route on browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      if (isUrlAdmin()) {
        setActiveView('admin');
      } else {
        setActiveView('hero');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToHome = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setActiveView('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    if (window.location.pathname !== '/admin') {
      window.history.pushState({}, '', '/admin');
    }
    setActiveView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeLevel = LEVELS.find((l) => l.id === selectedLevelId) || LEVELS[0];

  // Strict Auth Gate: No participant can play any level without Registering / Logging in first
  const handleStartLevel = (levelId: LevelId) => {
    if (!currentUser) {
      const targetLevel = LEVELS.find((l) => l.id === levelId);
      setPendingLevelId(levelId);
      setLevelModalTab(null);
      setShowManualModal(false);
      setShowNexaSoulModal(false);
      setAuthPromptMessage(
        `Registration / Login is required to play ${
          targetLevel ? `Level ${targetLevel.index} (${targetLevel.label})` : 'Frontendive®'
        }. Please register or sign in with your UID below to start!`
      );
      setShowAuthModal(true);
      return;
    }

    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setSelectedLevelId(levelId);
    setPendingLevelId(null);
    setAuthPromptMessage(null);
    setLevelModalTab(null);
    setShowManualModal(false);
    setShowNexaSoulModal(false);
    setActiveView('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveScore = (record: LevelScoreRecord) => {
    if (!currentUser) return;
    const updated = saveUserLevelScore(currentUser.uid, record);
    setAllScores(updated);
  };

  const handleLogout = () => {
    setCurrentSessionUid(null);
    setCurrentUser(null);
    if (activeView === 'game') {
      setActiveView('hero');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      {/* Fixed Navbar (z-index: 20) */}
      <Navbar
        currentUser={currentUser}
        onNavigateHome={navigateToHome}
        onOpenLevels={() => setLevelModalTab('levels')}
        onOpenManual={() => setShowManualModal(true)}
        onOpenScoreboard={() => setLevelModalTab('scoreboard')}
        onOpenNexaSoul={() => setShowNexaSoulModal(true)}
        onOpenAuth={() => {
          setAuthPromptMessage(null);
          setShowAuthModal(true);
        }}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {activeView === 'admin' ? (
          <AdminPortal onExitAdmin={navigateToHome} />
        ) : activeView === 'game' && currentUser ? (
          <GameArena
            level={activeLevel}
            currentUser={currentUser}
            onSelectLevel={handleStartLevel}
            onExitToHero={navigateToHome}
            onOpenAuth={() => {
              setAuthPromptMessage(null);
              setShowAuthModal(true);
            }}
            onSaveScore={handleSaveScore}
          />
        ) : (
          <HeroLanding
            currentUser={currentUser}
            onStartLevel={handleStartLevel}
            onOpenLevelSelector={() => setLevelModalTab('levels')}
            onOpenAuth={() => {
              setAuthPromptMessage(null);
              setShowAuthModal(true);
            }}
            onOpenManual={() => setShowManualModal(true)}
            onOpenNexaSoul={() => setShowNexaSoulModal(true)}
          />
        )}
      </main>

      {/* Official NexaSoul Footer */}
      <Footer
        onSelectLevel={handleStartLevel}
        onOpenAuth={() => {
          setAuthPromptMessage(null);
          setShowAuthModal(true);
        }}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Registration / Login Modal */}
      {showAuthModal && (
        <AuthPage
          currentUser={currentUser}
          authPromptMessage={authPromptMessage}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
            setAuthPromptMessage(null);
            if (pendingLevelId) {
              if (window.location.pathname !== '/') {
                window.history.pushState({}, '', '/');
              }
              setSelectedLevelId(pendingLevelId);
              setPendingLevelId(null);
              setActiveView('game');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          onLogout={handleLogout}
          onClose={() => {
            setShowAuthModal(false);
            setPendingLevelId(null);
            setAuthPromptMessage(null);
          }}
        />
      )}

      {/* Level Selector & Scoreboard Modal */}
      {levelModalTab !== null && (
        <LevelSelectorModal
          currentUser={currentUser}
          allScores={allScores}
          initialTab={levelModalTab}
          onSelectLevel={handleStartLevel}
          onOpenAuth={() => {
            setLevelModalTab(null);
            setAuthPromptMessage(null);
            setShowAuthModal(true);
          }}
          onClose={() => setLevelModalTab(null)}
        />
      )}

      {/* How To Play Field Manual Modal */}
      {showManualModal && (
        <HowToPlayModal
          onClose={() => setShowManualModal(false)}
          onStartDemo={() => handleStartLevel('demo')}
        />
      )}

      {/* NexaSoul Club Showcase Modal */}
      {showNexaSoulModal && (
        <NexaSoulModal
          onClose={() => setShowNexaSoulModal(false)}
          onSelectLevel={handleStartLevel}
        />
      )}
    </div>
  );
};

export default App;
