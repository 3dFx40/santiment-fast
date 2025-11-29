
import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, SentimentAnalysis, ChatMessage } from '../types';
import LoadingIndicator from './LoadingIndicator';
import { PositiveIcon, NegativeIcon, NeutralIcon, LinkIcon, SpeakerIcon, StopIcon, StarIcon, StarFilledIcon, ShareIcon, SendIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { textToSpeech } from '../services/geminiService';
import { Translation } from '../constants/translations';

// Audio decoding helpers (Keep existing logic)
function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

const SentimentDisplay: React.FC<{ sentiment: SentimentAnalysis; t: Translation }> = ({ sentiment, t }) => {
  const sentimentMap = {
    POSITIVE: { text: t.result.sentiments.POSITIVE, icon: <PositiveIcon className="w-6 h-6 text-green-400" />, color: 'text-green-400', bgColor: 'bg-green-500' },
    NEGATIVE: { text: t.result.sentiments.NEGATIVE, icon: <NegativeIcon className="w-6 h-6 text-red-400" />, color: 'text-red-400', bgColor: 'bg-red-500' },
    NEUTRAL: { text: t.result.sentiments.NEUTRAL, icon: <NeutralIcon className="w-6 h-6 text-yellow-400" />, color: 'text-yellow-400', bgColor: 'bg-yellow-500' },
  };

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  if (!sentiment || !sentiment.score) return <div className="text-gray-400">{t.result.sentiments.unknown}</div>;
  const current = sentimentMap[sentiment.score.toUpperCase() as keyof typeof sentimentMap];
  if (!current) return <div className="text-gray-400">{sentiment.score}</div>;
  const details = sentiment.details;

  const quotes = sentiment.example_quotes && sentiment.example_quotes.length > 0 
    ? sentiment.example_quotes 
    : (sentiment as any).example_quote 
      ? [(sentiment as any).example_quote] 
      : [];

  const handleNext = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePrev = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const isRTL = document.dir === 'rtl';

  return (
    <div>
        <div className="flex items-center gap-2 mb-3">
            {current.icon}
            <span className={`font-semibold ${current.color}`}>{current.text}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
            <div className="flex h-2.5 rounded-full">
                <div className={sentimentMap.POSITIVE.bgColor} style={{ width: `${details?.positive_percentage || 0}%` }}></div>
                <div className={sentimentMap.NEGATIVE.bgColor} style={{ width: `${details?.negative_percentage || 0}%` }}></div>
                <div className={sentimentMap.NEUTRAL.bgColor} style={{ width: `${details?.neutral_percentage || 0}%` }}></div>
            </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-4">
            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mx-1.5"></div>{t.result.sentiments.POSITIVE} ({details?.positive_percentage || 0}%)</span>
            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mx-1.5"></div>{t.result.sentiments.NEGATIVE} ({details?.negative_percentage || 0}%)</span>
            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-yellow-500 mx-1.5"></div>{t.result.sentiments.NEUTRAL} ({details?.neutral_percentage || 0}%)</span>
        </div>
        
        {quotes.length > 0 && (
            <div className="relative mt-4">
                <div className="flex items-start gap-2">
                    {quotes.length > 1 && (
                        <button onClick={handlePrev} className="mt-1 text-gray-500 hover:text-green-400 transition-colors">
                           {isRTL ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
                        </button>
                    )}
                    <blockquote className="flex-grow ltr:border-l-4 rtl:border-r-4 border-gray-600 px-4 italic text-gray-400 text-sm min-h-[4.5em]">
                        "{quotes[currentQuoteIndex]}"
                    </blockquote>
                     {quotes.length > 1 && (
                        <button onClick={handleNext} className="mt-1 text-gray-500 hover:text-green-400 transition-colors">
                            {isRTL ? <ChevronLeftIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                        </button>
                    )}
                </div>
                 {quotes.length > 1 && (
                    <div className="flex justify-center gap-1 mt-2">
                        {quotes.map((_, idx) => (
                            <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentQuoteIndex ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                        ))}
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

const WordCloud: React.FC<{ keywords: string[], onKeywordClick: (keyword: string) => void }> = ({ keywords, onKeywordClick }) => {
    const getFontSize = (index: number) => {
        if (index === 0) return 'text-lg';
        if (index < 3) return 'text-base';
        return 'text-sm';
    };
    return (
        <div className="flex flex-wrap gap-2 items-center">
            {keywords.map((keyword, index) => (
                <button 
                    key={index} 
                    onClick={() => onKeywordClick(keyword)}
                    className={`bg-gray-800 text-green-300 font-medium me-2 px-3 py-1 rounded-full hover:bg-green-900 hover:text-white transition-all duration-200 ${getFontSize(index)}`}
                >
                    {keyword}
                </button>
            ))}
        </div>
    );
};

const ChatInterface: React.FC<{ conversation: ChatMessage[], onSendMessage: (message: string) => void, isReplying: boolean, t: Translation }> = ({ conversation, onSendMessage, isReplying, t }) => {
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    const handleSend = () => {
        if (input.trim() && !isReplying) {
            onSendMessage(input);
            setInput('');
        }
    };
    
    return (
        <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-lg font-semibold text-green-400 mb-3">{t.result.chat.title}</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
                {conversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-green-800/50 text-gray-200' : 'bg-gray-800 text-gray-300'}`}>
                            {msg.isLoading ? <div className="animate-pulse">...</div> : <p className="whitespace-pre-wrap">{msg.content}</p>}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t.result.chat.placeholder}
                    className="flex-grow p-2 bg-black border border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
                    disabled={isReplying}
                />
                <button onClick={handleSend} disabled={!input.trim() || isReplying} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-bold p-3 rounded-md transition-colors flex items-center justify-center">
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

interface ResultCardProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onKeywordClick: (keyword: string) => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  conversation: ChatMessage[];
  onSendMessage: (message: string) => void;
  isReplying: boolean;
  query: string;
  t: Translation;
  readingSpeed?: number;
}

const ResultCard: React.FC<ResultCardProps> = (props) => {
  const { result, isLoading, error, onKeywordClick, isFavorited, onToggleFavorite, conversation, onSendMessage, isReplying, query, t, readingSpeed = 1 } = props;
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isSpeakingRef = useRef(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakError, setSpeakError] = useState<string | null>(null);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);

  useEffect(() => {
    setIsSourcesOpen(false);
  }, [result]);

  const handleStopSpeak = () => {
      isSpeakingRef.current = false;
      if (audioSourceRef.current) {
          try {
              audioSourceRef.current.stop();
          } catch(e) {
              // Ignore
          }
          audioSourceRef.current = null;
      }
      setIsSpeaking(false);
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
        handleStopSpeak();
        return;
    }
    
    if (!text) return;
    
    setIsSpeaking(true);
    isSpeakingRef.current = true;
    setSpeakError(null);
    
    try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioContext = audioContextRef.current;
        
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const audioB64 = await textToSpeech(text);
        
        if (!isSpeakingRef.current) {
            return;
        }

        const audioBytes = decode(audioB64);
        const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        
        // Apply reading speed
        source.playbackRate.value = readingSpeed;
        
        source.connect(audioContext.destination);
        
        audioSourceRef.current = source;
        
        source.onended = () => {
            setIsSpeaking(false);
            isSpeakingRef.current = false;
            audioSourceRef.current = null;
        };
        
        source.start();
    } catch (err) {
        console.error("Failed to play audio:", err);
        setSpeakError("Error playing audio");
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        audioSourceRef.current = null;
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const shareText = `${t.result.summary} for "${query}":\n\n${result.summary}\n${t.result.sentimentTitle}: ${result.sentiment.score}`;
    try {
        if (navigator.share) {
            await navigator.share({
                title: `${t.appTitle}: ${query}`,
                text: shareText,
            });
        } else {
            await navigator.clipboard.writeText(shareText);
            alert(t.result.shareSuccess);
        }
    } catch (err) {
        console.error("Share failed:", err);
        alert(t.result.shareFail);
    }
  };

  if (isLoading) return <LoadingIndicator t={t} />;
  if (error) return <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert"><p>{error}</p></div>;
  if (!result) return <div className="text-center text-gray-600 p-8 border-2 border-dashed border-gray-800 rounded-lg"><p>{t.result.waiting}</p></div>;

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 shadow-lg border border-gray-800 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-green-400">{t.result.summary}</h2>
                <div className="flex items-center gap-1">
                    <button onClick={handleShare} className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-green-400 transition-colors" title="Share"><ShareIcon className="w-5 h-5" /></button>
                    <button onClick={onToggleFavorite} className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-green-400 transition-colors" title={isFavorited ? "Remove Favorite" : "Add Favorite"}>{isFavorited ? <StarFilledIcon className="w-6 h-6 text-yellow-400" /> : <StarIcon className="w-6 h-6" />}</button>
                    <button 
                        onClick={() => handleSpeak(result.summary)} 
                        disabled={!result.summary} 
                        className={`p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`} 
                        title={isSpeaking ? "Stop" : "Read Summary"}
                    >
                        {isSpeaking ? <StopIcon className="w-6 h-6 text-red-400" /> : <SpeakerIcon className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            {speakError && <p className="text-red-400 text-sm mb-2">{speakError}</p>}
            <p className="text-gray-300 leading-relaxed">{result.summary}</p>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-3">{t.result.sentimentTitle}</h3>
            <SentimentDisplay sentiment={result.sentiment} t={t} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">{t.result.relatedTopics}</h3>
            <WordCloud keywords={result.related_keywords} onKeywordClick={onKeywordClick} />
          </div>
        </div>
      </div>

      {result.sources?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-800">
           <button 
            onClick={() => setIsSourcesOpen(!isSourcesOpen)}
            className="w-full flex justify-between items-center text-lg font-semibold text-green-400 mb-3 ltr:text-left rtl:text-right"
            aria-expanded={isSourcesOpen}
            aria-controls="sources-list"
          >
            <span>{t.result.sources}</span>
            <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isSourcesOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSourcesOpen && (
            <ul id="sources-list" className="space-y-2">
              {result.sources.map((source, index) => source.web && (
                <li key={index}>
                  <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors group">
                    <LinkIcon className="w-4 h-4 flex-shrink-0 text-gray-500 group-hover:text-green-400" />
                    <span className="truncate">{source.web.title || source.web.uri}</span>
                  </a>
                </li>
              ))}
            </ul>
           )}
        </div>
      )}

      <ChatInterface conversation={conversation} onSendMessage={onSendMessage} isReplying={isReplying} t={t} />
    </div>
  );
};

export default ResultCard;
