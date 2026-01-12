import type { UserData, AnswerHistory } from '../types';

const STORAGE_KEY = 'pm-decision-trainer-data';

const getDefaultUserData = (): UserData => ({
  history: [],
  currentStreak: 0,
  lastAnsweredDate: null,
});

export const getUserData = (): UserData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getDefaultUserData();
    return JSON.parse(data);
  } catch {
    return getDefaultUserData();
  }
};

export const saveUserData = (data: UserData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addAnswerHistory = (answer: AnswerHistory): UserData => {
  const userData = getUserData();
  const today = new Date().toISOString().split('T')[0];

  // 連続日数を更新
  if (userData.lastAnsweredDate) {
    const lastDate = new Date(userData.lastAnsweredDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      userData.currentStreak += 1;
    } else if (diffDays > 1) {
      userData.currentStreak = 1;
    }
    // diffDays === 0 の場合は同じ日なのでストリークは変更しない
  } else {
    userData.currentStreak = 1;
  }

  userData.history.push(answer);
  userData.lastAnsweredDate = today;
  saveUserData(userData);
  return userData;
};

export const hasAnsweredToday = (): boolean => {
  const userData = getUserData();
  if (!userData.lastAnsweredDate) return false;

  const today = new Date().toISOString().split('T')[0];
  return userData.lastAnsweredDate === today;
};

export const getTodayQuestionIndex = (): number => {
  // 日付ベースで問題を決定（シンプルに日付を問題数で割った余り）
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % 5; // 5問をローテーション
};
