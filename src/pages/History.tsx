import { useMemo } from 'react';
import { useUserData } from '../hooks/useUserData';

export const History = () => {
  const { userData, loading } = useUserData();

  // カレンダーデータを生成（過去30日分）
  const calendarData = useMemo(() => {
    const days: { date: string; hasActivity: boolean; isCorrect?: boolean }[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayHistory = userData?.history.find(h =>
        h.answeredAt.startsWith(dateStr)
      );

      days.push({
        date: dateStr,
        hasActivity: !!dayHistory,
        isCorrect: dayHistory?.isCorrect,
      });
    }

    return days;
  }, [userData]);

  // 週ごとにグループ化
  const weeks = useMemo(() => {
    const result: typeof calendarData[] = [];
    for (let i = 0; i < calendarData.length; i += 7) {
      result.push(calendarData.slice(i, i + 7));
    }
    return result;
  }, [calendarData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  const totalAnswered = userData?.history.length || 0;
  const correctAnswers = userData?.history.filter(h => h.isCorrect).length || 0;
  const correctRate = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  return (
    <div className="pb-24">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary-600">
            {userData?.currentStreak || 0}
          </div>
          <div className="text-sm text-gray-500">連続学習日数</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary-600">
            {correctRate}%
          </div>
          <div className="text-sm text-gray-500">正答率</div>
        </div>
      </div>

      {/* Activity Calendar */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">学習カレンダー</h3>
        <div className="text-xs text-gray-500 mb-2">過去30日間</div>
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.map((day) => {
                let bgColor = 'bg-gray-100';
                if (day.hasActivity) {
                  bgColor = day.isCorrect ? 'bg-green-500' : 'bg-red-400';
                }
                return (
                  <div
                    key={day.date}
                    className={`w-8 h-8 rounded ${bgColor} flex items-center justify-center`}
                    title={`${day.date}${day.hasActivity ? (day.isCorrect ? ' - 正解' : ' - 不正解') : ''}`}
                  >
                    {day.hasActivity && (
                      <span className="text-white text-xs">
                        {day.isCorrect ? '○' : '×'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gray-100"></div>
            <span>未回答</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span>正解</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-400"></div>
            <span>不正解</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">学習統計</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">総回答数</span>
            <span className="font-bold text-gray-800">{totalAnswered}問</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">正解数</span>
            <span className="font-bold text-green-600">{correctAnswers}問</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">不正解数</span>
            <span className="font-bold text-red-500">{totalAnswered - correctAnswers}問</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">正答率</span>
              <span className="font-bold text-primary-600">{correctRate}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${correctRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
