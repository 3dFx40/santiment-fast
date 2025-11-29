
import React, { useState } from 'react';
import { XIcon, GoogleIcon, FacebookIcon } from './icons';
import { User } from '../types';
import { Translation } from '../constants/translations';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: User) => void;
    t: Translation;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, t }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleMockAuth = async (provider: 'email' | 'google' | 'facebook') => {
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            let mockUser: User;
            
            if (provider === 'google') {
                mockUser = { id: 'g_123', name: 'Google User', email: 'user@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Google+User&background=random' };
            } else if (provider === 'facebook') {
                mockUser = { id: 'f_456', name: 'Facebook User', email: 'user@facebook.com', avatar: 'https://ui-avatars.com/api/?name=Facebook+User&background=random' };
            } else {
                // Email auth
                mockUser = { 
                    id: 'e_' + Date.now(), 
                    name: name || email.split('@')[0], 
                    email: email, 
                    avatar: `https://ui-avatars.com/api/?name=${name || email}&background=random`
                };
            }

            onLogin(mockUser);
            setIsLoading(false);
            onClose();
            // Reset form
            setEmail('');
            setPassword('');
            setName('');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors rtl:right-auto rtl:left-4 ltr:right-4 ltr:left-auto"
                    style={{ left: document.dir === 'rtl' ? '1rem' : 'auto', right: document.dir === 'rtl' ? 'auto' : '1rem' }}
                >
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isLogin ? t.auth.loginDesc : t.auth.registerDesc}
                    </p>
                </div>

                <div className="space-y-4">
                     <button 
                        onClick={() => handleMockAuth('google')}
                        className="w-full bg-white text-gray-800 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
                        disabled={isLoading}
                    >
                        <GoogleIcon className="w-5 h-5" />
                        {t.auth.google}
                    </button>
                    
                    <button 
                        onClick={() => handleMockAuth('facebook')}
                        className="w-full bg-[#1877F2] text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-[#166fe5] transition-colors"
                        disabled={isLoading}
                    >
                        <FacebookIcon className="w-5 h-5" />
                        {t.auth.facebook}
                    </button>

                    <div className="flex items-center gap-3 my-4">
                        <div className="h-px bg-gray-700 flex-grow"></div>
                        <span className="text-gray-500 text-sm">{t.auth.or}</span>
                        <div className="h-px bg-gray-700 flex-grow"></div>
                    </div>

                    {!isLogin && (
                         <input
                            type="text"
                            placeholder={t.auth.name}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                    )}
                    <input
                        type="email"
                        placeholder={t.auth.email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder={t.auth.password}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />

                    <button
                        onClick={() => handleMockAuth('email')}
                        disabled={!email || !password || (!isLogin && !name) || isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? t.auth.processing : (isLogin ? t.auth.submitLogin : t.auth.submitRegister)}
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-gray-400">
                    {isLogin ? t.auth.noAccount : t.auth.hasAccount}
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="text-green-400 hover:underline font-medium"
                    >
                        {isLogin ? t.auth.linkRegister : t.auth.linkLogin}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
