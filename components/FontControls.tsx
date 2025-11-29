
import React from 'react';
import { FontIncreaseIcon, FontDecreaseIcon } from './icons';

interface FontControlsProps {
    onIncrease: () => void;
    onDecrease: () => void;
}

const FontControls: React.FC<FontControlsProps> = ({ onIncrease, onDecrease }) => {
    return (
        <div className="flex items-center gap-2">
             <button
                onClick={onDecrease}
                className="p-2 text-gray-400 rounded-full hover:bg-gray-800 hover:text-green-400 transition-colors"
                title="הקטן גופן"
            >
                <FontDecreaseIcon className="w-6 h-6" />
            </button>
            <button
                onClick={onIncrease}
                className="p-2 text-gray-400 rounded-full hover:bg-gray-800 hover:text-green-400 transition-colors"
                title="הגדל גופן"
            >
                <FontIncreaseIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export default FontControls;
