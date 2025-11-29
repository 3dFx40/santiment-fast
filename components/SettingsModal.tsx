
import React, { useRef } from 'react';
import { XIcon, SpeedIcon, TextSizeIcon, DownloadIcon, UploadIcon, ChartBarIcon } from './icons';
import { Language } from '../types';
import { Translation } from '../constants/translations';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLanguage: Language;
    onLanguageChange: (lang: Language) => void;
    readingSpeed: number;
    onReadingSpeedChange: (speed: number) => void;
    fontSize: number;
    onFontSizeChange: (size: number) => void;
    t: Translation;
    onExportData?: () => void;
    onImportData?: (file: File) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    currentLanguage, 
    onLanguageChange, 
    readingSpeed, 
    onReadingSpeedChange,
    fontSize,
    onFontSizeChange,
    t,
    onExportData,
    onImportData
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'he', label: 'עברית', flag: '🇮🇱' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'ru', label: 'Русский', flag: '🇷🇺' }
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onImportData) {
            onImportData(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors rtl:right-auto rtl:left-4 ltr:right-4 ltr:left-auto"
                    style={{ left: document.dir === 'rtl' ? '1rem' : 'auto', right: document.dir === 'rtl' ? 'auto' : '1rem' }}
                >
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {t.settingsModal.title}
                    </h2>
                </div>

                <div className="space-y-6">
                    {/* Language Section */}
                    <div>
                        <h3 className="text-green-400 font-semibold mb-3">{t.settingsModal.language}</h3>
                        <div className="space-y-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => onLanguageChange(lang.code)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                                        currentLanguage === lang.code 
                                        ? 'bg-green-900/40 border-green-500 text-green-400' 
                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{lang.flag}</span>
                                        <span className="font-medium">{lang.label}</span>
                                    </div>
                                    {currentLanguage === lang.code && (
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-800 w-full"></div>

                    {/* Reading Speed Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 text-green-400 font-semibold">
                            <SpeedIcon className="w-5 h-5" />
                            <h3>{t.settingsModal.readingSpeed}</h3>
                        </div>
                        <div className="flex bg-gray-800 p-1 rounded-lg">
                            <button
                                onClick={() => onReadingSpeedChange(0.75)}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                                    readingSpeed === 0.75 
                                    ? 'bg-green-600 text-white shadow-lg' 
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {t.settingsModal.speedSlow}
                            </button>
                            <button
                                onClick={() => onReadingSpeedChange(1)}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                                    readingSpeed === 1 
                                    ? 'bg-green-600 text-white shadow-lg' 
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {t.settingsModal.speedNormal}
                            </button>
                            <button
                                onClick={() => onReadingSpeedChange(1.25)}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                                    readingSpeed === 1.25 
                                    ? 'bg-green-600 text-white shadow-lg' 
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {t.settingsModal.speedFast}
                            </button>
                        </div>
                    </div>

                    {/* Font Size Section */}
                    <div>
                         <div className="flex items-center gap-2 mb-3 text-green-400 font-semibold">
                            <TextSizeIcon className="w-5 h-5" />
                            <h3>{t.settingsModal.fontSize}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">A</span>
                            <input 
                                type="range" 
                                min="0.8" 
                                max="1.5" 
                                step="0.1" 
                                value={fontSize}
                                onChange={(e) => onFontSizeChange(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                            <span className="text-xl text-white font-bold">A</span>
                        </div>
                    </div>

                    {onExportData && onImportData && (
                        <>
                            <div className="h-px bg-gray-800 w-full"></div>
                            
                            {/* Data Management Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-green-400 font-semibold">
                                    <ChartBarIcon className="w-5 h-5" />
                                    <h3>{t.settingsModal.dataManagement}</h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={onExportData}
                                        className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-gray-700"
                                    >
                                        <DownloadIcon className="w-5 h-5 text-green-400" />
                                        <span>{t.settingsModal.exportData}</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-gray-700"
                                    >
                                        <UploadIcon className="w-5 h-5 text-blue-400" />
                                        <span>{t.settingsModal.importData}</span>
                                    </button>
                                    <input 
                                        type="file" 
                                        accept=".json" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
