import React from 'react';
import { Plane, Globe } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export const Header: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600">
          <Plane className="h-8 w-8" />
          <span className="text-xl font-bold text-slate-900">SkySearch</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-blue-600">{t.header.explore}</a>
          <a href="#" className="hover:text-blue-600">{t.header.flights}</a>
          <a href="#" className="hover:text-blue-600">{t.header.hotels}</a>
          <a href="#" className="hover:text-blue-600">{t.header.packages}</a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 py-2">
              <Globe className="h-4 w-4" />
              <span className="uppercase">{language}</span>
            </button>
            <div className="absolute right-0 top-full pt-0 w-32 hidden group-hover:block">
              <div className="bg-white rounded-md shadow-lg py-1 border border-slate-200">
                <button onClick={() => setLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">English</button>
                <button onClick={() => setLanguage('it')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Italiano</button>
                <button onClick={() => setLanguage('fr')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Français</button>
              </div>
            </div>
          </div>
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900">{t.header.signIn}</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
            {t.header.signUp}
          </button>
        </div>
      </div>
    </header>
  );
};