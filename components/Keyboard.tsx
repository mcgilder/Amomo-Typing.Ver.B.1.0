
import React from 'react';
import { KEYBOARD_LAYOUT, FINGER_MAPPING } from '../constants';

interface KeyboardProps {
  targetKey: string;
}

const Keyboard: React.FC<KeyboardProps> = ({ targetKey }) => {
  const normalizedTarget = targetKey.toUpperCase();

  const getFingerColor = (key: string) => {
    const mapping = FINGER_MAPPING[key.toUpperCase()];
    if (!mapping) return { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-700', active: 'bg-yellow-400 border-yellow-600' };
    
    switch (mapping.finger) {
      case '小指': return { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-700', active: 'bg-pink-500 border-pink-700' };
      case '无名指': return { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', active: 'bg-orange-500 border-orange-700' };
      case '中指': return { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700', active: 'bg-green-500 border-green-700' };
      case '食指': return { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', active: 'bg-blue-500 border-blue-700' };
      case '大拇指': return { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700', active: 'bg-purple-500 border-purple-700' };
      default: return { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-700', active: 'bg-yellow-400 border-yellow-600' };
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white/90 rounded-[2.5rem] shadow-xl backdrop-blur-xl border-2 border-white select-none">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className={`flex gap-2 ${rowIndex === 1 ? 'ml-5' : rowIndex === 2 ? 'ml-10' : ''}`}>
          {row.map((key) => {
            const isTarget = normalizedTarget === key;
            const mapping = FINGER_MAPPING[key];
            const colors = getFingerColor(key);
            
            return (
              <div
                key={key}
                className={`
                  relative w-11 h-10 md:w-14 md:h-12 flex items-center justify-center rounded-xl text-xl md:text-2xl font-bold border-b-[4px] transition-all duration-150
                  ${isTarget ? `${colors.active} scale-110 shadow-lg z-10 text-white -translate-y-1` : `${colors.bg} ${colors.text} ${colors.border} hover:bg-gray-50`}
                `}
              >
                {key}
                {isTarget && mapping && (
                  <div className="absolute -top-12 flex flex-col items-center animate-bounce z-20">
                    <span className={`text-white text-xs md:text-sm px-3 py-1 rounded-full shadow-lg whitespace-nowrap font-kids ${colors.active}`}>
                      {mapping.hand === 'left' ? '左手' : '右手'} {mapping.finger}
                    </span>
                    <div className={`w-2 h-2 rotate-45 -mt-1 shadow-md ${colors.active}`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <div 
          className={`
            w-48 h-10 md:w-72 md:h-12 rounded-xl flex items-center justify-center font-kids text-xl md:text-2xl border-b-[4px] transition-all
            ${normalizedTarget === ' ' ? 'bg-purple-500 border-purple-700 scale-105 text-white shadow-lg -translate-y-1' : 'bg-white border-gray-200 text-gray-400'}
          `}
        >
          空格键 [Space]
        </div>
      </div>
      
      {/* Finger Legend */}
      <div className="flex justify-between w-full max-w-lg mt-2 text-xs text-gray-400 font-kids">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-pink-300"></div> 小指</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-300"></div> 无名指</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-300"></div> 中指</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-400"></div> 食指</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-purple-300"></div> 大拇指
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
