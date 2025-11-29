
import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon, XIcon, MicIcon } from './icons';
import { Translation } from '../constants/translations';
import { Language } from '../types';

interface InputControllerProps {
  onAnalyze: (text: string, image?: string) => void;
  isLoading: boolean;
  initialQuery?: string;
  t: Translation;
  language: Language;
}

const InputController: React.FC<InputControllerProps> = ({ onAnalyze, isLoading, initialQuery, t, language }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialQuery !== undefined) {
      setText(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = () => {
    // Remove data URI prefix if present before sending
    const imageBase64 = selectedImage ? selectedImage.split(',')[1] : undefined;
    onAnalyze(text, imageBase64);
  };
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      // Typically stop is automatic, but we can prevent new clicks
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'he' ? 'he-IL' : language === 'ru' ? 'ru-RU' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const isSubmitDisabled = isLoading || (!text.trim() && !selectedImage);

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 shadow-lg border border-gray-800 relative">
      <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isListening ? t.input.listening : t.input.placeholder}
          className={`w-full p-3 bg-black border border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow resize-none ${selectedImage ? 'h-20' : 'h-28'} ${isListening ? 'border-green-500 bg-green-900/10' : ''}`}
          disabled={isLoading || isListening}
      />
      
      {selectedImage && (
          <div className="mt-3 relative inline-block">
              <img src={selectedImage} alt="Selected" className="h-20 w-auto rounded border border-gray-700" />
              <button 
                onClick={() => { setSelectedImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                  <XIcon className="w-3 h-3" />
              </button>
          </div>
      )}

      <div className="flex items-center justify-between mt-4 gap-3">
         <div className="flex items-center gap-2">
             <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleImageSelect}
             />
             <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-full transition-all ${selectedImage ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                title="Upload image"
                disabled={isLoading || isListening}
             >
                <ImageIcon className="w-5 h-5" />
             </button>
             
             <button
                onClick={handleMicClick}
                className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                title="Voice Search"
                disabled={isLoading}
             >
                <MicIcon className="w-5 h-5" />
             </button>
         </div>

         <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex-grow bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-green-500/30 disabled:shadow-none"
         >
            {isLoading ? t.input.processing : t.input.analyzeBtn}
         </button>
      </div>

    </div>
  );
};

export default InputController;
