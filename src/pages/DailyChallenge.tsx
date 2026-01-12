import { useState, useEffect } from 'react';
import { questions } from '../data/questions';
import { getTodayQuestionIndex } from '../utils/storage';
import { useUserData } from '../hooks/useUserData';
import type { Choice } from '../types';

export const DailyChallenge = () => {
  const { userData, loading, answeredToday, addAnswerHistory } = useUserData();
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showResult, setShowResult] = useState(false);

  const questionIndex = getTodayQuestionIndex();
  const question = questions[questionIndex];

  // 今日既に回答済みの場合、結果を表示
  useEffect(() => {
    if (answeredToday && userData) {
      const todayAnswer = userData.history.find(
        h => h.questionId === question.id && h.answeredAt.startsWith(new Date().toISOString().split('T')[0])
      );
      if (todayAnswer) {
        const choice = question.choices.find(c => c.id === todayAnswer.selectedChoiceId);
        if (choice) {
          setSelectedChoice(choice);
          setShowResult(true);
        }
      }
    }
  }, [answeredToday, userData, question]);

  const handleSelectChoice = (choice: Choice) => {
    if (showResult) return;

    setSelectedChoice(choice);
    setShowResult(true);

    addAnswerHistory({
      questionId: question.id,
      selectedChoiceId: choice.id,
      isCorrect: choice.isCorrect,
      answeredAt: new Date().toISOString(),
    });
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      priority: '優先順位判断',
      scope: 'スコープ管理',
      technical: '技術判断',
      stakeholder: 'ステークホルダー管理',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Stats Bar */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-lg p-4 shadow-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {userData?.currentStreak || 0}
          </div>
          <div className="text-xs text-gray-500">連続日数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {userData?.history.length || 0}
          </div>
          <div className="text-xs text-gray-500">回答数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {userData && userData.history.length > 0
              ? Math.round(
                  (userData.history.filter(h => h.isCorrect).length /
                    userData.history.length) *
                    100
                )
              : 0}
            %
          </div>
          <div className="text-xs text-gray-500">正答率</div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Category Badge */}
        <div className="bg-primary-50 px-4 py-2 flex items-center gap-2">
          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
            {getCategoryLabel(question.category)}
          </span>
          <span className="text-gray-500 text-xs">今日の問題</span>
        </div>

        {/* Scenario */}
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-800 leading-relaxed mb-6">
            {question.scenario}
          </h2>

          {/* Choices */}
          <div className="space-y-3">
            {question.choices.map((choice) => {
              let bgColor = 'bg-gray-50 hover:bg-gray-100';
              let borderColor = 'border-gray-200';
              let textColor = 'text-gray-700';

              if (showResult && selectedChoice) {
                if (choice.isCorrect) {
                  bgColor = 'bg-green-50';
                  borderColor = 'border-green-500';
                  textColor = 'text-green-700';
                } else if (choice.id === selectedChoice.id && !choice.isCorrect) {
                  bgColor = 'bg-red-50';
                  borderColor = 'border-red-500';
                  textColor = 'text-red-700';
                }
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 ${bgColor} ${borderColor} ${textColor} transition-all ${
                    !showResult ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span className="font-bold mr-2">{choice.id}.</span>
                  {choice.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result */}
        {showResult && selectedChoice && (
          <div className={`p-4 ${selectedChoice.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`text-lg font-bold mb-2 ${selectedChoice.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {selectedChoice.isCorrect ? '🎉 正解！' : '😢 不正解...'}
            </div>
            <p className="text-gray-700 leading-relaxed">
              {selectedChoice.explanation}
            </p>
            {!selectedChoice.isCorrect && (
              <p className="text-green-700 mt-3 leading-relaxed">
                <span className="font-bold">正解の解説: </span>
                {question.choices.find(c => c.isCorrect)?.explanation}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Next Question Info */}
      {showResult && (
        <div className="mt-6 text-center text-gray-500 text-sm">
          次の問題は明日公開されます
        </div>
      )}
    </div>
  );
};
