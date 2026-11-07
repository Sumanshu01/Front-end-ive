import { LevelId } from '../data/levels';

export interface DetectiveUser {
  name: string;
  uid: string;
  mobile: string;
  email: string;
  semester: number; // 1 to 8
  password: string;
  registeredAt: string;
}

export interface LevelScoreRecord {
  levelId: LevelId;
  bestScore: number;
  bugsFound: number;
  totalBugs: number;
  timeRemaining: number;
  clicksRemaining: number;
  completed: boolean;
  updatedAt: string; // ISO timestamp of when the level was played
}

export type UserScoresMap = Record<string, Partial<Record<LevelId, LevelScoreRecord>>>;

const USERS_STORAGE_KEY = 'frontendive_users_v1';
const SESSION_STORAGE_KEY = 'frontendive_session_uid_v1';
const SCORES_STORAGE_KEY = 'frontendive_scores_v1';

export function getRegisteredUsers(): DetectiveUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DetectiveUser[];
  } catch {
    return [];
  }
}

export function saveRegisteredUsers(users: DetectiveUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore storage errors
  }
}

export function getCurrentSessionUser(): DetectiveUser | null {
  try {
    const uid = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!uid) return null;
    const users = getRegisteredUsers();
    return users.find((u) => u.uid.toUpperCase() === uid.toUpperCase()) || null;
  } catch {
    return null;
  }
}

export function setCurrentSessionUid(uid: string | null): void {
  try {
    if (!uid) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      localStorage.setItem(SESSION_STORAGE_KEY, uid.toUpperCase());
    }
  } catch {
    // ignore
  }
}

export function getAllUserScores(): UserScoresMap {
  try {
    const raw = localStorage.getItem(SCORES_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UserScoresMap;
  } catch {
    return {};
  }
}

export function saveUserLevelScore(uid: string, record: LevelScoreRecord): UserScoresMap {
  const key = (uid || 'GUEST').toUpperCase();
  const all = getAllUserScores();
  const userScores = all[key] || {};
  const existing = userScores[record.levelId];

  if (!existing || record.bestScore >= existing.bestScore || (record.completed && !existing.completed)) {
    userScores[record.levelId] = {
      ...record,
      bestScore: existing ? Math.max(existing.bestScore, record.bestScore) : record.bestScore,
      completed: existing ? existing.completed || record.completed : record.completed,
      updatedAt: record.updatedAt,
    };
  } else {
    // Still update the latest date played even if the previous bestScore was higher
    userScores[record.levelId] = {
      ...existing,
      updatedAt: record.updatedAt,
    };
  }

  all[key] = userScores;
  try {
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
  return all;
}
