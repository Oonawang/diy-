export enum Character {
  Chiikawa = 'Chiikawa',
  Hachiware = 'Hachiware',
  Usagi = 'Usagi',
  Tanjiro = 'Tanjiro',
  Nezuko = 'Nezuko',
  Zenitsu = 'Zenitsu',
  Inosuke = 'Inosuke'
}

// Scene is now just a string to support DIY, but we can keep constants for presets
export const SCENE_PRESETS = {
  Concert: 'Concert',
  Disney: 'Disney',
  Camping: 'Camping',
  Space: 'Space'
} as const;

export type ScenePreset = keyof typeof SCENE_PRESETS;

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface VocabularyItem {
  english: string;
  korean: string;
  chinese: string;
  box2d: BoundingBox | null; // Coordinates 0-1000
}

export interface GenerationResult {
  imageUrl: string | null;
  vocabulary: VocabularyItem[];
}

export interface AppState {
  character: Character;
  scenePrompt: string;
  loading: boolean;
  step: 'idle' | 'generating-image' | 'analyzing-image' | 'complete';
  result: GenerationResult | null;
  error: string | null;
}