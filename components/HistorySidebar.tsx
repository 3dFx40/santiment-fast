
import React, { useState } from 'react';
import { HistoryItem, FavoriteItem } from '../types';
import { HistoryIcon, TrashIcon, TextIcon, StarFilledIcon } from './icons';
import { Translation } from '../constants/translations';

interface HistorySidebarProps {
  history: HistoryItem[];
  favorites: FavoriteItem[];
  onSelectHistory: (query: string) => void;
  onSelectFavorite: (favorite: FavoriteItem) => void;
  onClearHistory: () => void;
  onClearFavorites: () => void;
  t: Translation;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, favorites, onSelectHistory, onSelectFavorite, onClearHistory, onClearFavorites, t }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');

  return (
    <aside className="md:w-64 lg:w-72 flex-shrink-0 bg-gray-900/50 rounded-lg p-4 shadow-lg border border-gray-800 self-start">
      <div className="flex border-b border-gray-800 mb-4">
        <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-center w-1/2 gap-2 py-2 text-sm font-medium transition-colors ${activeTab === 'history' ? 'border-b-2 border-green-400 text-green-400' : 'text-gray-400 hover:text-white'}`}
        >
            <HistoryIcon className="w-5 h-5" />
            {t.sidebar.history}
        </button>
        <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center justify-center w-1/2 gap-2 py-2 text-sm font-medium transition-colors ${activeTab === 'favorites' ? 'border-b-2 border-green-400 text-green-400' : 'text-gray-400 hover:text-white'}`}
        >
            <StarFilledIcon className="w-5 h-5" />
            {t.sidebar.favorites}
        </button>
      </div>
      
      <div className="flex items-center justify-end mb-2">
        {activeTab === 'history' && history.length > 0 && (
          <button onClick={onClearHistory} className="text-gray-500 hover:text-red-400 transition-colors p-1 text-xs flex items-center gap-1" title={t.sidebar.clearAll}>
            <TrashIcon className="w-4 h-4" /> {t.sidebar.clearAll}
          </button>
        )}
        {activeTab === 'favorites' && favorites.length > 0 && (
            <button onClick={onClearFavorites} className="text-gray-500 hover:text-red-400 transition-colors p-1 text-xs flex items-center gap-1" title={t.sidebar.clearAll}>
                <TrashIcon className="w-4 h-4" /> {t.sidebar.clearAll}
            </button>
        )}
      </div>

      <div className="overflow-y-auto max-h-[60vh]">
        {activeTab === 'history' && (
          history.length > 0 ? (
            <ul className="space-y-2">
              {history.map((item) => (
                <li key={item.id}>
                  <button onClick={() => onSelectHistory(item.query)} className="w-full ltr:text-left rtl:text-right flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500">
                    <div className="flex-shrink-0"><TextIcon className="w-5 h-5 text-gray-500" /></div>
                    <span className="truncate text-sm text-gray-300">{item.query}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : <div className="text-center text-gray-600 text-sm py-8"><p>{t.sidebar.emptyHistory}</p></div>
        )}
        {activeTab === 'favorites' && (
          favorites.length > 0 ? (
            <ul className="space-y-2">
              {favorites.map((item) => (
                <li key={item.id}>
                  <button onClick={() => onSelectFavorite(item)} className="w-full ltr:text-left rtl:text-right flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500">
                    <div className="flex-shrink-0"><TextIcon className="w-5 h-5 text-gray-500" /></div>
                    <span className="truncate text-sm text-gray-300">{item.query}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : <div className="text-center text-gray-600 text-sm py-8"><p>{t.sidebar.emptyFavorites}</p></div>
        )}
      </div>
    </aside>
  );
};

export default HistorySidebar;
