
import React from 'react';
import { Translation } from '../constants/translations';

interface LoadingIndicatorProps {
  t: Translation;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ t }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900/50 rounded-lg border border-gray-800">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      <p className="mt-4 text-lg text-gray-300">{t.loading.title}</p>
      <p className="text-sm text-gray-500">{t.loading.subtitle}</p>
    </div>
  );
};

export default LoadingIndicator;
