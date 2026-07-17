import React from 'react';

interface NavbarProps {
  activeTab: 'flashcards' | 'research' | 'quiz';
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onMenuClick }) => {
  return (
    <header className="flex justify-between items-center h-16 px-6 bg-surface border-b border-outline-variant z-40 w-full sticky top-0">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:opacity-80 md:hidden"
        >
          <span className="material-symbols-outlined block">menu</span>
        </button>
        {/* Desktop Title */}
        <h1 className="font-headline-md text-headline-md text-primary font-bold">
          {activeTab === 'flashcards'
            ? 'FlashCards'
            : activeTab === 'research'
            ? 'AI Research Assistant'
            : 'Quiz Generator'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {activeTab === 'flashcards' || activeTab === 'quiz' ? (
          <>
            {/* Search Icon */}
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:opacity-80 text-on-surface-variant">
              <span className="material-symbols-outlined block">search</span>
            </button>
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-label-md text-label-md text-on-surface">Alex Rivera</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Pro Member</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary-fixed overflow-hidden bg-surface-container shadow-sm cursor-pointer hover:opacity-90 active:opacity-80">
                <img
                  className="w-full h-full object-cover"
                  alt="Alex Rivera headshot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3pPuJJ6UbZ9PHTlGK4romBnuJmh4rmB7VQIyJfyAQ96_O9ZATHYbAnODOlv-Dzlmwm96YOpQum7x2a5s6c-UZWJUwDlSFC1iO7cTcORZNYX8-ly9q1bdod8O3WZR0MnghOo-hqBgTtpBfM5D4GRV2g_wkBMNikVHO9HdJHuAJWDybl6qfYsfVtRR6AloDryt3joChPSqKrYQnJBXpCgsX71rYtohq67obK0As_uwsFSXjO9FbLnp-5YBi-7_xZgCtFkmC0Hts4RE_"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Notification Icon */}
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined block">notifications</span>
            </button>
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-label-md text-label-md text-on-surface">Dr. Sarah Chen</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Principal Researcher</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold overflow-hidden cursor-pointer active:opacity-80 border-2 border-surface shadow-sm">
                <img
                  className="w-full h-full object-cover"
                  alt="Sarah Chen headshot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgrspI9406J12VP0hjKrWdOcy1zIPglnkU9M25bzhCwwZH9gh2tiu4Wr12xgICzLLpyCaGbCCyidv9bTwMo99Vx5GLqCL7kLH0o4HHQS4vtT2LW1e_5V78NxX1-GeZlB8n8f_FdAsmxvpoSdyfPXqx7wGITSJvO1wKWJ13hmOW7RwbvT0mq3H4rHemj5pi6OAMRBaBanByUdG0DDDYjOIOIcL13QzB_Fu18qe1vENt6xM6lfuyv_1l6XdTC21ViM_AvcJEzb9ajPKr"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
