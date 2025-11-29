
import React, { useState, useCallback, useEffect } from 'react';
import { Chat } from '@google/genai';
import InputController from './components/InputController';
import ResultCard from './components/ResultCard';
import { analyzeQuery, ai } from './services/geminiService';
import { AnalysisResult, HistoryItem, FavoriteItem, ChatMessage, User, Language } from './types';
import { LogoIcon, UserIcon, LoginIcon, LogoutIcon, SettingsIcon, GlobeIcon, ChartBarIcon, LightBulbIcon } from './components/icons';
import HistorySidebar from './components/HistorySidebar';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import { translations } from './constants/translations';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  
  // Settings State
  const [fontScale, setFontScale] = useState(1);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const [language, setLanguage] = useState<Language>('he');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const t = translations[language];

  useEffect(() => {
    document.body.style.fontSize = `${fontScale * 17}px`;
    return () => { document.body.style.fontSize = ''; };
  }, [fontScale]);

  // Load User & Language from LocalStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('trendFinderUser');
    if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Error parsing user", e);
        }
    }

    const storedLang = localStorage.getItem('trendFinderLang') as Language;
    if (storedLang && ['he', 'en', 'ru'].includes(storedLang)) {
        setLanguage(storedLang);
    }
  }, []);

  // Update HTML direction and Lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    localStorage.setItem('trendFinderLang', language);
  }, [language]);

  // Load History/Favorites based on User state
  useEffect(() => {
    const storagePrefix = user ? `user_${user.id}_` : 'guest_';
    
    try {
      const storedHistory = localStorage.getItem(`${storagePrefix}trendFinderHistory`);
      if (storedHistory) setHistory(JSON.parse(storedHistory));
      else setHistory([]); // Clear if no history for this context

      const storedFavorites = localStorage.getItem(`${storagePrefix}trendFinderFavorites`);
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      else setFavorites([]); // Clear if no favorites for this context
      
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
  }, [user]);

  const updateHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    const storagePrefix = user ? `user_${user.id}_` : 'guest_';
    localStorage.setItem(`${storagePrefix}trendFinderHistory`, JSON.stringify(newHistory));
  };

  const updateFavorites = (newFavorites: FavoriteItem[]) => {
    setFavorites(newFavorites);
    const storagePrefix = user ? `user_${user.id}_` : 'guest_';
    localStorage.setItem(`${storagePrefix}trendFinderFavorites`, JSON.stringify(newFavorites));
  };

  const handleLogin = (loggedInUser: User) => {
      setUser(loggedInUser);
      localStorage.setItem('trendFinderUser', JSON.stringify(loggedInUser));
      setResult(null);
      setCurrentQuery('');
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('trendFinderUser');
      setResult(null);
      setCurrentQuery('');
  };
  
  const handleAnalysis = useCallback(async (text: string, image?: string) => {
    if (!text && !image) {
      setError(t.input.errorEmpty);
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);
    setConversation([]);
    setChatSession(null);
    
    const displayQuery = text || (image ? "Image Analysis" : "");
    setCurrentQuery(displayQuery);

    try {
      const analysisResult = await analyzeQuery(text, image, language);
      setResult(analysisResult);
      
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        query: displayQuery,
        timestamp: Date.now(),
      };
      updateHistory([newHistoryItem, ...history.filter(h => h.query !== newHistoryItem.query).slice(0, 19)]);
      
      const targetLanguage = language === 'he' ? 'Hebrew' : language === 'ru' ? 'Russian' : 'English';

      const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          history: [
              { role: 'user', parts: [{ text: `Analyze the topic: "${text}" ${image ? 'and the provided image' : ''}. Respond in ${targetLanguage}` }] },
              { role: 'model', parts: [{ text: JSON.stringify(analysisResult) }] }
          ],
          config: {
              systemInstruction: `You are an expert analyst of online trends and public sentiment. The user has just received an analysis of the online discourse regarding a specific topic. Answer their follow-up questions by focusing on public opinion, recent news, and community discussions based on the initial analysis. ALWAYS respond in ${targetLanguage}.`
          }
      });
      setChatSession(chat);

    } catch (err) {
      console.error(err);
      setError(t.input.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  }, [history, user, language, t]);

  const handleSendMessage = async (message: string) => {
    if (!chatSession || isReplying) return;

    setIsReplying(true);
    const updatedConversation: ChatMessage[] = [
      ...conversation,
      { role: 'user', content: message },
      { role: 'model', content: '', isLoading: true },
    ];
    setConversation(updatedConversation);

    try {
      const response = await chatSession.sendMessage({ message });
      const modelResponseText = response.text;
      
      setConversation([
        ...conversation,
        { role: 'user', content: message },
        { role: 'model', content: modelResponseText },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setConversation([
        ...conversation,
        { role: 'user', content: message },
        { role: 'model', content: t.result.chat.error },
      ]);
    } finally {
      setIsReplying(false);
    }
  };

  const handleSelectHistory = (query: string) => handleAnalysis(query);
  
  const handleSelectFavorite = (favorite: FavoriteItem) => {
      setResult(favorite.result);
      setCurrentQuery(favorite.query);
      setError(null);
      setConversation([]);
      
      const targetLanguage = language === 'he' ? 'Hebrew' : language === 'ru' ? 'Russian' : 'English';
      
      const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          history: [
            { role: 'user', parts: [{ text: `Analyze this topic: ${favorite.query}. Respond in ${targetLanguage}` }] },
            { role: 'model', parts: [{ text: JSON.stringify(favorite.result) }] }
          ],
          config: {
              systemInstruction: `You are an expert analyst of online trends and public sentiment. The user has just received an analysis of the online discourse regarding a specific topic. Answer their follow-up questions by focusing on public opinion, recent news, and community discussions based on the initial analysis. ALWAYS respond in ${targetLanguage}.`
          }
      });
      setChatSession(chat);
  };
  
  const handleToggleFavorite = useCallback(() => {
    if (!result || !currentQuery) return;
    
    const isFavorited = favorites.some(fav => fav.query === currentQuery && fav.result.summary === result.summary);

    if (isFavorited) {
      updateFavorites(favorites.filter(fav => fav.query !== currentQuery));
    } else {
      const newFavorite: FavoriteItem = {
        id: Date.now().toString(),
        query: currentQuery,
        result: result,
        timestamp: Date.now()
      };
      updateFavorites([newFavorite, ...favorites]);
    }
  }, [result, currentQuery, favorites, user]);

  const handleClearHistory = () => updateHistory([]);
  const handleClearFavorites = () => updateFavorites([]);
  
  const isCurrentResultFavorited = result ? favorites.some(fav => fav.result.summary === result.summary) : false;

  // Data Export/Import
  const handleExportData = () => {
    const dataToExport = {
      user: user,
      history: history,
      favorites: favorites,
      settings: { language, readingSpeed, fontScale }
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trend-finder-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(t.settingsModal.exportSuccess);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('trendFinderUser', JSON.stringify(data.user));
        }
        
        // We set state directly, and the useEffects will sync to localStorage based on the loaded user
        if (data.history) setHistory(data.history);
        if (data.favorites) setFavorites(data.favorites);
        
        if (data.settings) {
          if (data.settings.language) setLanguage(data.settings.language);
          if (data.settings.readingSpeed) setReadingSpeed(data.settings.readingSpeed);
          if (data.settings.fontScale) setFontScale(data.settings.fontScale);
        }
        
        alert(t.settingsModal.importSuccess);
        setIsSettingsOpen(false); // Close modal on success
      } catch (err) {
        console.error("Import error", err);
        alert(t.settingsModal.importError);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`min-h-screen bg-black text-gray-300 p-4 sm:p-6 lg:p-8`}>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin}
        t={t}
      />
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLanguage={language}
        onLanguageChange={setLanguage}
        readingSpeed={readingSpeed}
        onReadingSpeedChange={setReadingSpeed}
        fontSize={fontScale}
        onFontSizeChange={setFontScale}
        t={t}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />
      
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex-1 hidden sm:block"></div>

          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-4 mb-2">
              <LogoIcon className="w-12 h-12 text-green-400"/>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 to-green-500 text-transparent bg-clip-text">
                {t.appTitle}
              </h1>
            </div>
            <p className="text-lg text-gray-500">
              {t.appDesc}
            </p>
          </div>
          
          <div className="flex-1 flex justify-end items-center gap-4">
             <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                title={t.settings}
             >
                 <SettingsIcon className="w-6 h-6" />
             </button>

             {user ? (
                 <div className="flex items-center gap-3 bg-gray-900/80 px-4 py-2 rounded-full border border-gray-800">
                     <img 
                        src={user.avatar} 
                        alt="User" 
                        className="w-8 h-8 rounded-full border border-green-500" 
                     />
                     <div className="text-left hidden md:block">
                         <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                     </div>
                     <button 
                        onClick={handleLogout} 
                        className="text-gray-400 hover:text-red-400 transition-colors mr-2"
                        title={t.logout}
                     >
                         <LogoutIcon className="w-5 h-5" />
                     </button>
                 </div>
             ) : (
                 <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-full transition-all border border-gray-700 shadow-lg hover:shadow-green-900/20"
                 >
                    <UserIcon className="w-5 h-5 text-green-400" />
                    <span>{t.login}</span>
                 </button>
             )}
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
           <HistorySidebar 
             history={history} 
             favorites={favorites}
             onSelectHistory={handleSelectHistory} 
             onSelectFavorite={handleSelectFavorite}
             onClearHistory={handleClearHistory}
             onClearFavorites={handleClearFavorites}
             t={t}
           />
           <main className="flex-grow">
              <InputController 
                onAnalyze={(text, image) => handleAnalysis(text, image)} 
                isLoading={isLoading} 
                initialQuery={currentQuery}
                t={t}
                language={language}
              />
              
              {!result && !isLoading && (
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                      <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-800 text-center hover:border-green-500/50 transition-colors">
                          <div className="bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <GlobeIcon className="w-8 h-8 text-green-400" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-200 mb-2">{t.features.items[0].title}</h3>
                          <p className="text-gray-400">{t.features.items[0].desc}</p>
                      </div>
                       <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-800 text-center hover:border-green-500/50 transition-colors">
                          <div className="bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <ChartBarIcon className="w-8 h-8 text-blue-400" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-200 mb-2">{t.features.items[1].title}</h3>
                          <p className="text-gray-400">{t.features.items[1].desc}</p>
                      </div>
                       <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-800 text-center hover:border-green-500/50 transition-colors">
                          <div className="bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <LightBulbIcon className="w-8 h-8 text-purple-400" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-200 mb-2">{t.features.items[2].title}</h3>
                          <p className="text-gray-400">{t.features.items[2].desc}</p>
                      </div>
                  </div>
              )}

              {!user && !result && !isLoading && history.length === 0 && (
                  <div className="mt-8 p-6 bg-blue-900/20 border border-blue-900/50 rounded-lg flex items-center gap-4">
                      <div className="bg-blue-600/20 p-3 rounded-full">
                          <LoginIcon className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-blue-100">{t.loginPrompt.title}</h3>
                          <p className="text-blue-300 text-sm">{t.loginPrompt.desc}</p>
                          <button onClick={() => setIsAuthModalOpen(true)} className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-bold underline">{t.loginPrompt.cta}</button>
                      </div>
                  </div>
              )}

              <div className="mt-8">
                <ResultCard 
                  result={result} 
                  isLoading={isLoading} 
                  error={error} 
                  onKeywordClick={(keyword) => handleAnalysis(keyword)}
                  isFavorited={isCurrentResultFavorited}
                  onToggleFavorite={handleToggleFavorite}
                  conversation={conversation}
                  onSendMessage={handleSendMessage}
                  isReplying={isReplying}
                  query={currentQuery}
                  t={t}
                  readingSpeed={readingSpeed}
                />
              </div>
           </main>
        </div>

        <footer className="text-center mt-12 text-gray-600 text-sm">
          <p>{t.footer}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
