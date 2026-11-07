import React, { useState } from 'react';
import { LEVELS, LevelId } from '../data/levels';
import {
  DetectiveUser,
  UserScoresMap,
  getAllUserScores,
  getRegisteredUsers,
} from '../types/auth';

interface AdminPortalProps {
  onExitAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExitAdmin }) => {
  const [users, setUsers] = useState<DetectiveUser[]>(() => getRegisteredUsers());
  const [scores, setScores] = useState<UserScoresMap>(() => getAllUserScores());

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'participants'>('leaderboard');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'all' | LevelId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<number | 'all'>('all');

  const handleRefresh = () => {
    setUsers(getRegisteredUsers());
    setScores(getAllUserScores());
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Not played yet';
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Filter users by search & semester
  const filteredUsers = users.filter((u) => {
    if (semesterFilter !== 'all' && u.semester !== semesterFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.uid.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.mobile.toLowerCase().includes(q)
    );
  });

  // Compute participant rows with full level breakdown & latest date played
  const participantAnalytics = filteredUsers.map((u) => {
    const uScores = scores[u.uid.toUpperCase()] || {};
    let totalScore = 0;
    let levelsPlayedCount = 0;
    let levelsSolvedCount = 0;
    let latestPlayedIso: string | undefined;

    LEVELS.forEach((lvl) => {
      const rec = uScores[lvl.id];
      if (rec) {
        levelsPlayedCount += 1;
        totalScore += rec.bestScore;
        if (rec.completed) levelsSolvedCount += 1;
        if (
          rec.updatedAt &&
          (!latestPlayedIso || new Date(rec.updatedAt) > new Date(latestPlayedIso))
        ) {
          latestPlayedIso = rec.updatedAt;
        }
      }
    });

    return {
      user: u,
      uScores,
      totalScore,
      levelsPlayedCount,
      levelsSolvedCount,
      latestPlayedIso,
    };
  });

  // Overall Leaderboard sorted by totalScore
  const overallLeaderboard = [...participantAnalytics].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  // Specific Level Leaderboard sorted by score on that level
  const specificLevelConfig =
    selectedLevelFilter === 'all'
      ? null
      : LEVELS.find((l) => l.id === selectedLevelFilter) || null;

  const specificLevelLeaderboard =
    selectedLevelFilter === 'all'
      ? []
      : participantAnalytics
          .map((item) => ({
            user: item.user,
            record: item.uScores[selectedLevelFilter],
          }))
          .filter((entry) => entry.record !== undefined)
          .sort((a, b) => (b.record?.bestScore || 0) - (a.record?.bestScore || 0));

  // KPI calculations across all registered users
  const totalParticipants = users.length;
  const activePlayersCount = users.filter((u) => {
    const uScores = scores[u.uid.toUpperCase()];
    return uScores && Object.keys(uScores).length > 0;
  }).length;
  const totalSolvedCases = users.reduce((acc, u) => {
    const uScores = scores[u.uid.toUpperCase()] || {};
    return (
      acc +
      LEVELS.reduce((sum, lvl) => sum + (uScores[lvl.id]?.completed ? 1 : 0), 0)
    );
  }, 0);
  const topOverallScore =
    overallLeaderboard.length > 0 ? overallLeaderboard[0].totalScore : 0;

  // CSV Export Helper
  const handleExportCsv = () => {
    let csvContent = '';
    if (activeTab === 'participants') {
      csvContent +=
        'Name,UID,Semester,Mobile,Email,Registered Date,Levels Played,Levels Solved,Total Score,Last Date Played\n';
      participantAnalytics.forEach((p) => {
        csvContent += `"${p.user.name}","${p.user.uid}",${p.user.semester},"${p.user.mobile}","${p.user.email}","${formatDateTime(p.user.registeredAt)}",${p.levelsPlayedCount},${p.levelsSolvedCount},${p.totalScore},"${formatDateTime(p.latestPlayedIso)}"\n`;
      });
    } else if (selectedLevelFilter === 'all') {
      csvContent +=
        'Rank,Name,UID,Semester,Mobile,Email,DEMO Score,EASY Score,MEDIUM Score,HARD Score,NIGHTMARE Score,Total Score,Last Date Played\n';
      overallLeaderboard.forEach((row, idx) => {
        csvContent += `${idx + 1},"${row.user.name}","${row.user.uid}",${row.user.semester},"${row.user.mobile}","${row.user.email}",${row.uScores.demo?.bestScore ?? 0},${row.uScores.easy?.bestScore ?? 0},${row.uScores.medium?.bestScore ?? 0},${row.uScores.hard?.bestScore ?? 0},${row.uScores.nightmare?.bestScore ?? 0},${row.totalScore},"${formatDateTime(row.latestPlayedIso)}"\n`;
      });
    } else {
      csvContent += `Rank,Level,Name,UID,Semester,Mobile,Email,Bugs Found,Status,Clicks Left,Time Left (s),Score,Date Played\n`;
      specificLevelLeaderboard.forEach((row, idx) => {
        const rec = row.record!;
        csvContent += `${idx + 1},"${selectedLevelFilter.toUpperCase()}","${row.user.name}","${row.user.uid}",${row.user.semester},"${row.user.mobile}","${row.user.email}","${rec.bugsFound}/${rec.totalBugs}","${rec.completed ? 'SOLVED' : 'INCOMPLETE'}",${rec.clicksRemaining},${rec.timeRemaining},${rec.bestScore},"${formatDateTime(rec.updatedAt)}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frontendive-admin-${activeTab}-${selectedLevelFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f4f3ef] text-stone-900 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Admin Header Card */}
        <div className="bg-white border border-black/10 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src="/assets/compass-logo.jpeg"
              alt="NexaSoul Compass"
              className="w-14 h-14 rounded-2xl object-cover border border-black/15 shadow-sm shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <img
                  src="/assets/nexasoul-logo.png"
                  alt="NexaSoul"
                  className="h-6 object-contain"
                />
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  /admin • ORGANIZER CONSOLE
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Frontendive® Admin Portal
              </h1>
              <p className="text-xs sm:text-sm text-stone-500">
                Registered Participants Directory &amp; Level-Wise Leaderboard with Date Played
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              ↻ Refresh Data
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
            >
              ⬇ Export CSV
            </button>
            <button
              type="button"
              onClick={onExitAdmin}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-sky-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
            >
              ← Back to Game (/)
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Registered Participants
            </div>
            <div className="text-3xl font-bold text-stone-900 mt-1 font-mono">
              {totalParticipants}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Total accounts created with UID
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Active Players
            </div>
            <div className="text-3xl font-bold text-sky-700 mt-1 font-mono">
              {activePlayersCount}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Played at least 1 investigation level
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Total Cases Solved
            </div>
            <div className="text-3xl font-bold text-emerald-700 mt-1 font-mono">
              {totalSolvedCases}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              100% UI errors found in a level
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Top Cumulative Score
            </div>
            <div className="text-3xl font-bold text-amber-700 mt-1 font-mono">
              {topOverallScore} <span className="text-sm font-normal">PTS</span>
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {overallLeaderboard[0]
                ? `Leader: ${overallLeaderboard[0].user.name} (${overallLeaderboard[0].user.uid})`
                : 'No scores recorded yet'}
            </div>
          </div>
        </div>

        {/* Main Controls Bar: View Tabs + Search + Semester Filter */}
        <div className="bg-white border border-black/10 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Primary Tabs */}
          <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 self-start">
            <button
              type="button"
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🏆 Level-Wise Leaderboard ({selectedLevelFilter.toUpperCase()})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('participants')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'participants'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              👥 Registered Participants ({filteredUsers.length})
            </button>
          </div>

          {/* Search & Semester Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Name, UID, Mobile, Email..."
              className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 w-60 focus:outline-none focus:border-sky-600"
            />

            <select
              value={semesterFilter}
              onChange={(e) =>
                setSemesterFilter(
                  e.target.value === 'all' ? 'all' : Number(e.target.value)
                )
              }
              className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-sky-600"
            >
              <option value="all">All Semesters (1–8)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TAB 1: LEVEL-WISE LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white border border-black/10 rounded-3xl overflow-hidden shadow-sm">
            {/* Level Selector Sub-Bar */}
            <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-stone-500 mr-1">
                  Select Level:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedLevelFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedLevelFilter === 'all'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  All Levels (Overall)
                </button>
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedLevelFilter(lvl.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedLevelFilter === lvl.id
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: lvl.badgeColor }}
                    />
                    <span>
                      {lvl.index}. {lvl.label}
                    </span>
                  </button>
                ))}
              </div>

              {specificLevelConfig && (
                <div className="text-xs text-stone-500 font-mono">
                  {specificLevelConfig.title} • Max {specificLevelConfig.bugs.length} Bugs •{' '}
                  {specificLevelConfig.maxClicks} Clicks • {specificLevelConfig.timeLimitSeconds}s
                </div>
              )}
            </div>

            {/* Table Content */}
            {selectedLevelFilter === 'all' ? (
              // OVERALL LEADERBOARD (ALL 5 LEVELS + DATE PLAYED)
              overallLeaderboard.length === 0 ? (
                <div className="p-12 text-center text-sm text-stone-500">
                  No registered participants found matching your filter.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50/80 text-stone-500 font-mono uppercase">
                        <th className="py-3.5 px-4">Rank</th>
                        <th className="py-3.5 px-4">Participant</th>
                        <th className="py-3.5 px-4">UID</th>
                        <th className="py-3.5 px-4">Sem</th>
                        <th className="py-3.5 px-3 text-center">DEMO</th>
                        <th className="py-3.5 px-3 text-center">EASY</th>
                        <th className="py-3.5 px-3 text-center">MEDIUM</th>
                        <th className="py-3.5 px-3 text-center">HARD</th>
                        <th className="py-3.5 px-3 text-center">NIGHTMARE</th>
                        <th className="py-3.5 px-4 text-right">Total Score</th>
                        <th className="py-3.5 px-4">Last Date Played</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {overallLeaderboard.map((row, idx) => (
                        <tr key={row.user.uid} className="hover:bg-stone-50/80">
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                            #{idx + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900">{row.user.name}</div>
                            <div className="text-[11px] text-stone-500">{row.user.email}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-sky-700">
                            {row.user.uid}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-stone-600">
                            Sem {row.user.semester}
                          </td>
                          {LEVELS.map((lvl) => {
                            const rec = row.uScores[lvl.id];
                            return (
                              <td
                                key={lvl.id}
                                className="py-3.5 px-3 text-center font-mono"
                              >
                                {rec ? (
                                  <div>
                                    <span
                                      className={`font-bold ${
                                        rec.completed ? 'text-emerald-700' : 'text-amber-700'
                                      }`}
                                    >
                                      {rec.bestScore}
                                    </span>
                                    <div className="text-[10px] text-stone-400">
                                      {rec.bugsFound}/{rec.totalBugs} bugs
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-stone-300">—</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-emerald-700">
                            {row.totalScore} PTS
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">
                            {formatDateTime(row.latestPlayedIso)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : // SPECIFIC LEVEL LEADERBOARD
            specificLevelLeaderboard.length === 0 ? (
              <div className="p-12 text-center text-sm text-stone-500">
                No participants have played the{' '}
                <strong className="text-stone-800">
                  {selectedLevelFilter.toUpperCase()}
                </strong>{' '}
                level yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/80 text-stone-500 font-mono uppercase">
                      <th className="py-3.5 px-4">Rank</th>
                      <th className="py-3.5 px-4">Participant</th>
                      <th className="py-3.5 px-4">UID</th>
                      <th className="py-3.5 px-4">Sem</th>
                      <th className="py-3.5 px-4">Mobile</th>
                      <th className="py-3.5 px-4">Bugs Found</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Clicks / Time Left</th>
                      <th className="py-3.5 px-4 text-right">Level Score</th>
                      <th className="py-3.5 px-4">Date Played</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {specificLevelLeaderboard.map((entry, idx) => {
                      const rec = entry.record!;
                      return (
                        <tr key={entry.user.uid} className="hover:bg-stone-50/80">
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                            #{idx + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900">{entry.user.name}</div>
                            <div className="text-[11px] text-stone-500">{entry.user.email}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-sky-700">
                            {entry.user.uid}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-stone-600">
                            Sem {entry.user.semester}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-stone-600">
                            {entry.user.mobile}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                            {rec.bugsFound} / {rec.totalBugs}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                rec.completed
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {rec.completed ? '✓ SOLVED' : 'INCOMPLETE'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-stone-600">
                            {rec.clicksRemaining} clicks • {rec.timeRemaining}s
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-emerald-700">
                            {rec.bestScore} PTS
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">
                            {formatDateTime(rec.updatedAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL REGISTERED PARTICIPANTS */}
        {activeTab === 'participants' && (
          <div className="bg-white border border-black/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="text-sm font-bold text-stone-900">
                Registered Detectives Directory ({participantAnalytics.length})
              </div>
              <div className="text-xs text-stone-500">
                Includes registration details, semester, levels attempted, and date played
              </div>
            </div>

            {participantAnalytics.length === 0 ? (
              <div className="p-12 text-center text-sm text-stone-500">
                No registered participants found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/80 text-stone-500 font-mono uppercase">
                      <th className="py-3.5 px-4">#</th>
                      <th className="py-3.5 px-4">Full Name</th>
                      <th className="py-3.5 px-4">UID</th>
                      <th className="py-3.5 px-4">Semester</th>
                      <th className="py-3.5 px-4">Mobile Number</th>
                      <th className="py-3.5 px-4">Email ID</th>
                      <th className="py-3.5 px-4">Registered On</th>
                      <th className="py-3.5 px-4">Levels Played</th>
                      <th className="py-3.5 px-4">Last Date Played</th>
                      <th className="py-3.5 px-4 text-right">Total Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {participantAnalytics.map((item, idx) => (
                      <tr key={item.user.uid} className="hover:bg-stone-50/80">
                        <td className="py-3.5 px-4 font-mono text-stone-500">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          {item.user.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-sky-700">
                          {item.user.uid}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-stone-700">
                          Semester {item.user.semester}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-stone-700">
                          {item.user.mobile}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {item.user.email}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                          {formatDateTime(item.user.registeredAt)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {LEVELS.map((lvl) => {
                              const rec = item.uScores[lvl.id];
                              if (!rec) return null;
                              return (
                                <span
                                  key={lvl.id}
                                  title={`Played on ${formatDateTime(rec.updatedAt)} • Score: ${rec.bestScore}`}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                    rec.completed
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-stone-100 text-stone-700 border border-stone-300'
                                  }`}
                                >
                                  {lvl.label}: {rec.bestScore}
                                </span>
                              );
                            })}
                            {item.levelsPlayedCount === 0 && (
                              <span className="text-stone-400 italic">None</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">
                          {formatDateTime(item.latestPlayedIso)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                          {item.totalScore} PTS
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
  );
};

