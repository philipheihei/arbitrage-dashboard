import { Language } from '../types';
import { translations, Translations } from '../i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: Translations;
}

export default function Header({ language, onLanguageChange, t }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">{t.title}</h1>
            <p className="text-xs text-slate-400 leading-tight">{t.subtitle}</p>
          </div>
        </div>

        {/* Language toggle */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              language === 'en'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('zh')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              language === 'zh'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            繁中
          </button>
        </div>
      </div>
    </header>
  );
}

// Re-export so App can use it without importing translations separately
export { translations };
