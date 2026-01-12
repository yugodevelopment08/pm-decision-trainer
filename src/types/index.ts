// 問題のカテゴリ
export type QuestionCategory =
  | 'priority'        // 優先順位判断
  | 'scope'           // スコープ管理
  | 'technical'       // 技術判断
  | 'stakeholder';    // ステークホルダー管理

// 難易度
export type Difficulty = 'junior' | 'mid' | 'senior';

// 選択肢
export interface Choice {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
  explanation: string;
}

// 問題データ
export interface Question {
  id: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  scenario: string;
  choices: Choice[];
}

// 回答履歴
export interface AnswerHistory {
  questionId: string;
  selectedChoiceId: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  answeredAt: string; // ISO date string
}

// ユーザーデータ
export interface UserData {
  history: AnswerHistory[];
  currentStreak: number;
  lastAnsweredDate: string | null;
}
