import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Character, AppState, SCENE_PRESETS, VocabularyItem } from './types';
import { generateContent } from './services/geminiService';
import Controls from './components/Controls';
import WordCard from './components/WordCard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    character: Character.Chiikawa,
    scenePrompt: SCENE_PRESETS.Concert,
    loading: false,
    step: 'idle',
    result: null,
    error: null,
  });

  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Update image dimensions on resize for accurate annotation positioning
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.clientWidth,
          height: imageRef.current.clientHeight,
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    // Initial check after image loads is handled by onLoad
    return () => window.removeEventListener('resize', handleResize);
  }, [state.result]);

  const handleGenerate = useCallback(async () => {
    if (!state.scenePrompt.trim()) return;

    setState((prev) => ({ ...prev, loading: true, step: 'generating-image', error: null, result: null }));
    
    try {
      const result = await generateContent(state.character, state.scenePrompt);
      
      setState((prev) => ({ 
        ...prev, 
        loading: false, 
        step: 'complete',
        result 
      }));

    } catch (error: any) {
      console.error("Generation error:", error);
      setState((prev) => ({ 
        ...prev, 
        loading: false, 
        step: 'idle',
        error: "Failed to generate. Please ensure your API Key is valid and try again." 
      }));
    }
  }, [state.character, state.scenePrompt]);

  const onImageLoad = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6F6] text-stone-800 font-sans pb-20 selection:bg-pink-200">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎫</span>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500 font-chinese tracking-wide">
              Chiikawa Maker
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
             <span>🤖</span> Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Intro */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-700 mb-3 font-korean">
            Design Your Word Card
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto leading-relaxed">
            Choose a character (Chiikawa or Demon Slayer) and type any scene!
          </p>
        </div>

        {/* Controls */}
        <Controls
          selectedCharacter={state.character}
          scenePrompt={state.scenePrompt}
          onCharacterChange={(c) => setState((prev) => ({ ...prev, character: c }))}
          onSceneChange={(s) => setState((prev) => ({ ...prev, scenePrompt: s }))}
          onGenerate={handleGenerate}
          loading={state.loading}
          step={state.step}
        />

        {/* Error Message */}
        {state.error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-xl max-w-2xl mx-auto animate-fade-in-up">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🥺</span>
              <p className="text-sm font-bold text-red-700">{state.error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {state.result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto animate-fade-in">
            
            {/* Main Image Stage - Spans 8 cols (Larger image) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-white p-3 rounded-[2rem] shadow-2xl border-[6px] border-white ring-4 ring-pink-100 relative group select-none">
                
                {/* Image Container */}
                <div className="relative rounded-3xl overflow-hidden aspect-square bg-stone-100">
                  {state.result.imageUrl ? (
                    <img 
                      ref={imageRef}
                      src={state.result.imageUrl} 
                      alt="Generated Scene" 
                      className="w-full h-full object-cover"
                      onLoad={onImageLoad}
                    />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>
                  )}

                  {/* Annotations Layer */}
                  {state.result.vocabulary.map((item, idx) => {
                    if (!item.box2d) return null;
                    
                    // Convert 1000-scale coordinates to percentages
                    const centerTop = (item.box2d.ymin + item.box2d.ymax) / 2 / 10;
                    const centerLeft = (item.box2d.xmin + item.box2d.xmax) / 2 / 10;

                    return (
                      <div 
                        key={idx}
                        className="absolute z-20 hover:z-50 cursor-pointer transition-all duration-300 hover:scale-110"
                        style={{ 
                          top: `${centerTop}%`, 
                          left: `${centerLeft}%`,
                          transform: 'translate(-50%, -50%)' 
                        }}
                      >
                         {/* Anchor Dot */}
                         <div className="w-4 h-4 bg-white rounded-full border-2 border-pink-400 shadow-sm relative z-10 mx-auto mb-1"></div>

                         {/* Card Bubble */}
                         <div className="bg-white border border-stone-200 rounded-lg shadow-xl px-3 py-2 min-w-[120px] text-center flex flex-col gap-0.5">
                            <div className="font-bold text-slate-800 text-sm">{item.english}</div>
                            <div className="text-pink-600 font-korean text-xs font-bold">{item.korean}</div>
                            <div className="text-stone-500 font-chinese text-[10px]">{item.chinese}</div>
                         </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Scene Label */}
                <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full font-bold text-sm border border-white/20">
                  {state.scenePrompt}
                </div>

              </div>
              
              <div className="text-center text-stone-400 text-sm mt-2">
                Tap the labels to learn!
              </div>
            </div>

            {/* Vocabulary List - Spans 4 cols */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-stone-100 h-full">
                <h3 className="text-xl font-bold text-stone-600 mb-6 flex items-center gap-3 pb-4 border-b border-stone-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-lg">📝</div>
                  Words
                </h3>
                
                <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {state.result.vocabulary.map((item, idx) => (
                    <WordCard key={idx} item={item} index={idx} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Empty State */}
        {!state.result && !state.loading && (
          <div className="text-center py-12 opacity-40 hover:opacity-60 transition-opacity">
            <div className="text-7xl mb-4 filter grayscale contrast-50">🎡</div>
            <p className="text-lg font-medium text-stone-400">Waiting for your imagination...</p>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E5E7EB;
          border-radius: 20px;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate3d(0, 20px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;