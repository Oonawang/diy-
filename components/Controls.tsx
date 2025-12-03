import React from 'react';
import { Character, SCENE_PRESETS } from '../types';

interface ControlsProps {
  selectedCharacter: Character;
  scenePrompt: string;
  onCharacterChange: (c: Character) => void;
  onSceneChange: (s: string) => void;
  onGenerate: () => void;
  loading: boolean;
  step: string;
}

const Controls: React.FC<ControlsProps> = ({
  selectedCharacter,
  scenePrompt,
  onCharacterChange,
  onSceneChange,
  onGenerate,
  loading,
  step
}) => {
  
  const chiikawaChars = [Character.Chiikawa, Character.Hachiware, Character.Usagi];
  const demonSlayerChars = [Character.Tanjiro, Character.Nezuko, Character.Zenitsu, Character.Inosuke];

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-pink-100 mb-8 max-w-4xl mx-auto w-full relative overflow-hidden">
      {/* Decorative bg element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-100 to-transparent rounded-bl-full -z-10 opacity-50"></div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        
        {/* Character Selector - Spans 12 cols (Full Width now for better grouping) */}
        <div className="md:col-span-12 flex flex-col gap-3">
          <label className="text-stone-500 text-xs font-bold uppercase tracking-wider ml-1 flex items-center gap-1">
            <span>👤</span> Choose Character
          </label>
          
          <div className="flex flex-col gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100">
            {/* Chiikawa Group */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold text-stone-400 self-center mr-2 w-16">Chiikawa:</span>
              {chiikawaChars.map((char) => (
                <button
                  key={char}
                  onClick={() => onCharacterChange(char)}
                  className={`py-1.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedCharacter === char
                      ? 'bg-white text-pink-500 shadow-md ring-2 ring-pink-100 transform scale-105'
                      : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>

            <div className="h-px bg-stone-200 w-full opacity-50"></div>

            {/* Demon Slayer Group */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold text-stone-400 self-center mr-2 w-16">Demon Slayer:</span>
              {demonSlayerChars.map((char) => (
                <button
                  key={char}
                  onClick={() => onCharacterChange(char)}
                  className={`py-1.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedCharacter === char
                      ? 'bg-white text-blue-500 shadow-md ring-2 ring-blue-100 transform scale-105'
                      : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scene Input - Spans 12 cols */}
        <div className="md:col-span-12 flex flex-col gap-2">
          <label className="text-stone-500 text-xs font-bold uppercase tracking-wider ml-1 flex items-center gap-1">
            <span>🎨</span> Scene (DIY Input)
          </label>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                value={scenePrompt}
                onChange={(e) => onSceneChange(e.target.value)}
                placeholder="e.g., Singing at a rock concert, At Disney World wearing mickey ears..."
                className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-sans text-stone-700 placeholder-stone-300"
                disabled={loading}
              />
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(SCENE_PRESETS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => onSceneChange(value)}
                  className="text-xs px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-500 hover:border-pink-300 hover:text-pink-500 hover:shadow-sm transition-all"
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="md:col-span-12 mt-2">
          <button
            onClick={onGenerate}
            disabled={loading || !scenePrompt.trim()}
            className={`w-full h-[56px] rounded-2xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg ${
              loading || !scenePrompt.trim()
                ? 'bg-stone-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 hover:opacity-90 hover:scale-[1.01] active:scale-[0.98] hover:shadow-pink-200/50'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full"></div>
                {step === 'generating-image' && 'Creating Scene...'}
                {step === 'analyzing-image' && 'Identifying Objects...'}
                {!step && 'Loading...'}
              </>
            ) : (
              <>
                <span>✨</span> Generate Magic Card
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;