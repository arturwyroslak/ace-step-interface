import { gradioAPI } from "./gradio-client";
import type { GenerationParams, ModelConfig, GenerationResult } from "../types";

/**
 * ACE-STEP API Client
 * High-level interface for all ACE-STEP operations
 */

export class ACEStepAPI {
  /**
   * Initialize model
   */
  async initializeModel(config: ModelConfig, onProgress?: (status: string) => void): Promise<string> {
    const data = [
      config.checkpointFile,
      config.mainModelPath,
      config.device,
      config.use5HzLM,
      config.lmModelPath || "acestep-5Hz-lm-1.7B",
      config.lmBackend || "vllm",
      config.useFlashAttention,
      config.offloadToCPU,
      config.offloadDiTtoCPU,
    ];

    const result = await gradioAPI.call("lambda_1", data, (progressData) => {
      if (onProgress && progressData.output?.data) {
        onProgress(progressData.output.data[0]);
      }
    });

    return result[0]; // Status message
  }

  /**
   * Load LoRA adapter
   */
  async loadLoRA(loraPath: string): Promise<string> {
    const result = await gradioAPI.call("load_lora", [loraPath]);
    return result[0];
  }

  /**
   * Unload LoRA adapter
   */
  async unloadLoRA(): Promise<string> {
    const result = await gradioAPI.call("unload_lora", []);
    return result[0];
  }

  /**
   * Generate music
   */
  async generateMusic(
    params: GenerationParams,
    onProgress?: (status: string) => void
  ): Promise<GenerationResult> {
    // Prepare audio files if needed
    let sourceAudioPath: string | null = null;
    let referenceAudioPath: string | null = null;

    if (params.sourceAudio) {
      sourceAudioPath = await gradioAPI.uploadFile(params.sourceAudio);
    }

    if (params.referenceAudio) {
      referenceAudioPath = await gradioAPI.uploadFile(params.referenceAudio);
    }

    // Call appropriate endpoint based on mode
    let result;
    
    if (params.mode === "text2music") {
      // Custom mode generation
      const data = [
        params.prompt,
        params.lyrics || "",
        params.bpm || 0,
        params.duration,
        params.keySignature || "",
        params.timeSignature || "",
        params.lmTemperature,
        params.lmTopK,
        params.lmTopP,
        params.thinking,
      ];
      
      result = await gradioAPI.call("lambda_10", data, (progressData) => {
        if (onProgress && progressData.output?.data) {
          onProgress(progressData.output.data[7]); // Generation status
        }
      });
    } else if (params.mode === "cover") {
      // Cover mode
      const data = [
        { path: sourceAudioPath },
        params.thinking,
      ];
      
      result = await gradioAPI.call("lambda_11", data, (progressData) => {
        if (onProgress && progressData.output?.data) {
          onProgress(progressData.output.data[1]); // Generation status
        }
      });
    }

    // Generate actual audio with main generation endpoint
    const generationData = [
      params.mode,
      params.prompt,
      params.lyrics || "",
      params.vocalLanguage || "unknown",
      params.bpm || 0,
      params.keySignature || "",
      params.timeSignature || "",
      params.duration,
      params.batchSize,
      params.ditSteps,
      params.cfgScale,
      params.seed || "",
      params.randomSeed,
      params.useFlashAttn,
      params.guidanceRescale,
      0, // base_shift
      params.shift,
      params.inferenceMethod,
      params.customTimesteps || "",
      "wav", // audio format
      params.lmTemperature,
      params.lmCfgScale,
      params.lmTopK,
      params.lmTopP,
      params.lmNegativePrompt || "",
      false, // disable_lm_cfg_schedule
      false, // enable_lm_emb_rescale
      false, // enable_lm_cfg_rescale
      params.audioCoverStrength || 0.5,
      params.thinking,
      sourceAudioPath || "",
      params.startTime || 0,
      params.endTime || -1,
      params.genre || "woodwinds",
      params.tags || [],
    ];

    const audioResult = await gradioAPI.call("lambda_29", generationData, (progressData) => {
      if (onProgress && progressData.progress) {
        onProgress(`Generating: ${Math.round((progressData.progress || 0) * 100)}%`);
      }
    });

    // Parse results
    const audioFiles = audioResult.slice(0, 8).map((audio: any, i: number) => ({
      url: audio?.url || audio?.path || "",
      filename: `generated_${i + 1}.wav`,
      duration: params.duration,
      sampleRate: 44100,
    }));

    const lmCodes = audioResult.slice(20, 28);
    const lyricsTimestamps = audioResult.slice(28, 36);
    const qualityScores = audioResult.slice(12, 20).map((s: string) => parseFloat(s) || 0);

    return {
      audioFiles,
      metadata: {
        params,
        timestamp: new Date().toISOString(),
        modelConfig: {} as ModelConfig,
      },
      lmCodes,
      lyricsTimestamps,
      qualityScores,
    };
  }

  /**
   * Transcribe audio codes
   */
  async transcribeAudio(audioFile: File): Promise<string> {
    const path = await gradioAPI.uploadFile(audioFile);
    const result = await gradioAPI.call("lambda_4", [{ path }]);
    return result[0];
  }

  /**
   * Generate from simple description
   */
  async generateFromDescription(
    description: string,
    instrumental: boolean,
    vocalLanguage: string,
    temperature: number,
    topK: number,
    topP: number,
    thinking: boolean,
    onProgress?: (status: string) => void
  ): Promise<any> {
    const data = [
      description,
      instrumental,
      vocalLanguage,
      temperature,
      topK,
      topP,
      thinking,
    ];

    return gradioAPI.call("lambda_12", data, (progressData) => {
      if (onProgress && progressData.output?.data) {
        onProgress(progressData.output.data[10]); // Generation status
      }
    });
  }

  /**
   * Load random simple example
   */
  async loadRandomExample(): Promise<{ description: string; instrumental: boolean; language: string }> {
    const result = await gradioAPI.call("load_random_simple_description", []);
    return {
      description: result[0],
      instrumental: result[1],
      language: result[2],
    };
  }

  /**
   * Export metadata
   */
  exportMetadata(params: GenerationParams): string {
    return JSON.stringify(params, null, 2);
  }

  /**
   * Import metadata
   */
  importMetadata(json: string): GenerationParams {
    return JSON.parse(json) as GenerationParams;
  }
}

export const aceStepAPI = new ACEStepAPI();
