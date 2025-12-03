import React from 'react';
import { VocabularyItem } from '../types';

interface WordCardProps {
  item: VocabularyItem;
  index: number;
}

const WordCard: React.FC<WordCardProps> = ({ item, index }) => {
  // Stagger animation delay based on index
  const animationDelay = `${index * 100}ms`;

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-stone-100 flex flex-col items-center justify-center p-4 min-h-[160px] animate-fade-in-up"
      style={{ animationDelay }}
    >
      <div className="text-4xl mb-3 font-bold text-pink-300">{index + 1}</div>
      
      {/* English */}
      <div className="text-xl font-bold text-slate-800 font-sans mb-1">
        {item.english}
      </div>
      
      {/* Korean */}
      <div className="text-lg text-chiikawa-text font-korean mb-1">
        {item.korean}
      </div>
      
      {/* Chinese */}
      <div className="text-md text-stone-500 font-chinese">
        {item.chinese}
      </div>
    </div>
  );
};

export default WordCard;