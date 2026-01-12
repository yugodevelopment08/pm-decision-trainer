import { useState, useEffect, useCallback } from 'react';
import type { UserData, AnswerHistory } from '../types';
import { getUserData, addAnswerHistory as addAnswer, hasAnsweredToday } from '../utils/storage';

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answeredToday, setAnsweredToday] = useState(false);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
    setAnsweredToday(hasAnsweredToday());
    setLoading(false);
  }, []);

  const addAnswerHistory = useCallback((answer: AnswerHistory) => {
    const updatedData = addAnswer(answer);
    setUserData(updatedData);
    setAnsweredToday(true);
  }, []);

  const getCorrectRate = useCallback((): number => {
    if (!userData || userData.history.length === 0) return 0;
    const correct = userData.history.filter(h => h.isCorrect).length;
    return Math.round((correct / userData.history.length) * 100);
  }, [userData]);

  return {
    userData,
    loading,
    answeredToday,
    addAnswerHistory,
    getCorrectRate,
  };
};
