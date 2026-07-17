import React from 'react';

interface SidebarProps {
  activeTab: 'flashcards' | 'research' | 'quiz';
  setActiveTab: (tab: 'flashcards' | 'research' | 'quiz') => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-[280px] bg-surface border-r border-outline-variant flex flex-col gap-2 p-4 z-50 transition-transform duration-300 md:translate-x-0 md:static md:shadow-none ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="px-4 py-6 mb-4 flex justify-between items-center">
          <span className="font-headline-md text-headline-md font-bold text-primary">
            Productivity Pro
          </span>
          <button
            className="md:hidden p-2 hover:bg-surface-container-high rounded-full transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {/* FlashCards Link */}
          <button
            onClick={() => {
              setActiveTab('flashcards');
              onClose();
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 active:scale-95 text-left w-full ${
              activeTab === 'flashcards'
                ? 'text-primary bg-secondary-container font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: activeTab === 'flashcards' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              style
            </span>
            <span className="text-body-md font-body-md">FlashCards</span>
          </button>

          {/* AI Research Link */}
          <button
            onClick={() => {
              setActiveTab('research');
              onClose();
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 active:scale-95 text-left w-full ${
              activeTab === 'research'
                ? 'text-primary bg-secondary-container font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: activeTab === 'research' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              science
            </span>
            <span className="text-body-md font-body-md">AI Research</span>
          </button>

          {/* Quiz Generator Link */}
          <button
            onClick={() => {
              setActiveTab('quiz');
              onClose();
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 active:scale-95 text-left w-full ${
              activeTab === 'quiz'
                ? 'text-primary bg-secondary-container font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: activeTab === 'quiz' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              quiz
            </span>
            <span className="text-body-md font-body-md">Quiz Generator</span>
          </button>
        </nav>

        {/* Dynamic Progress/Storage Widget at Bottom */}
        <div className="mt-auto pt-4">
          {activeTab === 'flashcards' ? (
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <p className="text-label-sm text-on-surface-variant mb-2 font-semibold tracking-wider">
                DAILY PROGRESS
              </p>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary-container w-[64%] rounded-full transition-all duration-500"></div>
              </div>
              <p className="text-label-sm text-on-surface-variant mt-2">
                64% of goal reached
              </p>
            </div>
          ) : activeTab === 'research' ? (
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col gap-2">
              <p className="text-label-md font-label-md uppercase tracking-wider opacity-60">
                Storage
              </p>
              <div className="h-1 bg-outline-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[75%] rounded-full transition-all duration-500"></div>
              </div>
              <p className="text-label-sm font-label-sm text-on-surface-variant">
                75% capacity used
              </p>
            </div>
          ) : (
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col gap-2">
              <p className="text-label-md font-label-md uppercase tracking-wider opacity-60">
                Quiz Stats
              </p>
              <div className="h-1 bg-outline-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[100%] rounded-full"></div>
              </div>
              <p className="text-label-sm font-label-sm text-on-surface-variant">
                Ready to start quiz
              </p>
            </div>
          )}
          <div className="mt-4 pt-2 border-t border-outline-variant">
            <p className="px-4 text-label-sm font-label-sm text-outline">
              v1.0.4 Premium
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
