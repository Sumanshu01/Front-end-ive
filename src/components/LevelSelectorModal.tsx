import React from 'react';
import { LEVELS, LevelId } from '../data/levels';
import {
  DetectiveUser,
  UserScoresMap,
  getRegisteredUsers,
} from '../types/auth';

interface LevelSelectorModalProps {
  currentUser: DetectiveUser | null;
  allScores: UserScoresMap;
  initialTab?: 'levels' | 'scoreboard';
  onSelectLevel: (levelId: LevelId) => void;
  onOpenAuth: () => void;
  onClose: () => void;
}

export const LevelSelectorModal: React.FC<LevelSelectorModalProps> = ({
  currentUser,
  allScores,
  initialTab = 'levels',
  onSelectLevel,
  onOpenAuth,
  onClose,
}) => {
  const [tab, setTab] = React.useState<'levels' | 'scoreboard'>(initialTab);
  const userKey = (currentUser?.uid || 'GUEST').toUpperCase();
  const currentUserScores = allScores[userKey] || {};

  // Compute Leaderboard rows
  const registeredUsers = getRegisteredUsers();
  const leaderboardRows = registeredUsers
    .map((u) => {
      const uScores = allScores[u.uid.toUpperCase()] || {};
      let totalPoints = 0;
      let levelsSolved = 0;
      LEVELS.forEach((lvl) => {
        const rec = uScores[lvl.id];
        if (rec) {
          totalPoints += rec.bestScore;
          if (rec.completed) levelsSolved += 1;
        }
      });
      return {
        user: u,
        totalPoints,
        levelsSolved,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/45 backdrop-blur-sm flex items-start justify-center pt-20 pb-10 px-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#f8f7f4] border border-black/15 rounded-3xl overflow-hidden text-stone-900 shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-lime-500" />

        {/* Header - Cleanly aligned and never clipped */}
        <div className="p-5 sm:p-6 border-b border-black/10 flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/compass-logo.jpeg"
              alt="NexaSoul"
              className="w-11 h-11 rounded-full object-cover border border-black/15 shadow-sm shrink-0"
            />
            <div>
              <h2
                className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Frontendive® Case Files &amp; Scoreboard
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                5 Difficulty Tiers • Maximum 6 UI Errors Per Screen • Limited Time &amp; Clicks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('levels')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                tab === 'levels'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              5 Levels
            </button>
            <button
              type="button"
              onClick={() => setTab('scoreboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                tab === 'scoreboard'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              Scoreboard
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {tab === 'levels' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LEVELS.map((lvl) => {
                const record = currentUserScores[lvl.id];
                return (
                  <div
                    key={lvl.id}
                    className="bg-white border border-stone-200 hover:border-stone-400 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-sm hover:shadow-md group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold text-stone-950 border border-black/10"
                          style={{ backgroundColor: lvl.badgeColor }}
                        >
                          {lvl.index}. {lvl.label}
                        </span>
                        {record?.completed && (
                          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                            ✓ SOLVED ({record.bestScore} pts)
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold mt-3 text-stone-900 group-hover:text-sky-700 transition-colors">
                        {lvl.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">{lvl.subtitle}</p>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center bg-stone-50 rounded-xl p-2.5 border border-stone-200/80 text-xs font-mono">
                        <div>
                          <div className="text-[10px] text-stone-500">UI BUGS</div>
                          <div className="font-bold text-sky-700">{lvl.bugs.length}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500">CLICKS</div>
                          <div className="font-bold text-stone-900">{lvl.maxClicks}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500">TIME</div>
                          <div className="font-bold text-emerald-700">{lvl.timeLimitSeconds}s</div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectLevel(lvl.id)}
                      className="mt-5 w-full py-2.5 rounded-xl bg-stone-900 text-white hover:bg-sky-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {currentUser
                        ? `Launch ${lvl.label} Investigation →`
                        : `🔒 Login / Register to Play ${lvl.label} →`}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <div>
                  <div className="text-sm font-bold text-stone-900">
                    NexaSoul Detective Leaderboard
                  </div>
                  <div className="text-xs text-stone-500">
                    Ranked by cumulative score across Demo, Easy, Medium, Hard &amp; Nightmare
                  </div>
                </div>
                {!currentUser && (
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 cursor-pointer"
                  >
                    Register UID to Join →
                  </button>
                )}
              </div>

              {leaderboardRows.length === 0 ? (
                <div className="text-center py-10 text-sm text-stone-500 bg-white rounded-2xl border border-stone-200">
                  No registered detectives have recorded scores yet. Register your UID and complete
                  a level to claim the #1 spot!
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-2xl border border-stone-200">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 uppercase">
                        <th className="py-3 px-4">Rank</th>
                        <th className="py-3 px-4">Detective Name</th>
                        <th className="py-3 px-4">UID</th>
                        <th className="py-3 px-4">Semester</th>
                        <th className="py-3 px-4">Cases Solved</th>
                        <th className="py-3 px-4 text-right">Total Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {leaderboardRows.map((row, idx) => (
                        <tr
                          key={row.user.uid}
                          className={
                            currentUser?.uid === row.user.uid ? 'bg-sky-50 font-semibold' : ''
                          }
                        >
                          <td className="py-3 px-4 font-bold text-stone-900">#{idx + 1}</td>
                          <td className="py-3 px-4 font-sans font-semibold text-stone-900">
                            {row.user.name}
                          </td>
                          <td className="py-3 px-4 text-sky-700">{row.user.uid}</td>
                          <td className="py-3 px-4 text-stone-600">Sem {row.user.semester}</td>
                          <td className="py-3 px-4 text-stone-600">{row.levelsSolved} / 5</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-700">
                            {row.totalPoints} PTS
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
