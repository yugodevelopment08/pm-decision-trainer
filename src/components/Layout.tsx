import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-600 text-white shadow-md">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">PM Decision Trainer</h1>
          <p className="text-primary-100 text-sm">毎日5分のPMスキルトレーニング</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-lg mx-auto flex">
          <Link
            to="/"
            className={`flex-1 py-3 text-center ${
              location.pathname === '/'
                ? 'text-primary-600 border-t-2 border-primary-600'
                : 'text-gray-500'
            }`}
          >
            <div className="text-2xl">📝</div>
            <div className="text-xs">今日の問題</div>
          </Link>
          <Link
            to="/history"
            className={`flex-1 py-3 text-center ${
              location.pathname === '/history'
                ? 'text-primary-600 border-t-2 border-primary-600'
                : 'text-gray-500'
            }`}
          >
            <div className="text-2xl">📊</div>
            <div className="text-xs">学習履歴</div>
          </Link>
        </div>
      </nav>
    </div>
  );
};
