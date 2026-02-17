// Generation parameters
export interface GenerationParams {
  mode: "text2music" | "cover" | "repaint";
  prompt: string;
  lyrics?: string;
  vocalLanguage?: string;
  bpm?: number;
  keySignature?: string;
  timeSignature?: string;
  duration: number;
  batchSize: number;
  seed?: string;
  randomSeed: boolean;

  // DiT parameters
  ditSteps: number;
  cfgScale: number;
  shift: number;
  guidanceRescale: number;
  inferenceMethod: string;
  customTimesteps?: string;

  // LM parameters
  lmTemperature: number;
  lmCfgScale: number;
  lmTopK: number;
  lmTopP: number;
  lmNegativePrompt?: string;

  // Mode-specific
  sourceAudio?: File;
  referenceAudio?: File;
  audioCoverStrength?: number;
  startTime?: number;
  endTime?: number;

  // Advanced
  useFlashAttn: boolean;
  thinking: boolean;
  instrumental: boolean;
  genre?: string;
  tags?: string[];
}

export interface GenerationResult {
  audioFiles: AudioFile[];
  metadata: GenerationMetadata;
  lmCodes: string[];
  lyricsTimestamps: string[];
  qualityScores: number[];
}

export interface AudioFile {
  url: string;
  filename: string;
  duration: number;
  sampleRate: number;
}

export interface GenerationMetadata {
  params: GenerationParams;
  timestamp: string;
  modelConfig: ModelConfig;
}

export interface ModelConfig {
  checkpointFile: string;
  mainModelPath: string;
  device: string;
  use5HzLM: boolean;
  lmModelPath?: string;
  lmBackend?: string;
  useFlashAttention: boolean;
  offloadToCPU: boolean;
  offloadDiTtoCPU: boolean;
}

export interface ModelStatus {
  initialized: boolean;
  status: string;
  config?: ModelConfig;
}

export interface LoRAStatus {
  loaded: boolean;
  path?: string;
  status: string;
}
