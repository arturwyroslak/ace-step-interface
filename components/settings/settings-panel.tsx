"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Settings, Cpu, Zap, Upload, X } from "lucide-react";
import { aceStepAPI } from "@/lib/api/ace-step-api";
import type { ModelConfig } from "@/lib/types";

export function SettingsPanel() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [status, setStatus] = useState("Not initialized");
  const [loraPath, setLoraPath] = useState("");
  const [loraStatus, setLoraStatus] = useState("No LoRA loaded");

  const [config, setConfig] = useState<ModelConfig>({
    checkpointFile: "/data/checkpoints",
    mainModelPath: "acestep-v15-turbo",
    device: "auto",
    use5HzLM: true,
    lmModelPath: "acestep-5Hz-lm-1.7B",
    lmBackend: "vllm",
    useFlashAttention: true,
    offloadToCPU: false,
    offloadDiTtoCPU: false,
  });

  const handleInitialize = async () => {
    setIsInitializing(true);
    setStatus("Initializing model...");

    try {
      const result = await aceStepAPI.initializeModel(config, (statusMsg) => {
        setStatus(statusMsg);
      });

      setStatus(result);
    } catch (error) {
      console.error("Initialization failed:", error);
      setStatus(`Error: ${error}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleLoadLoRA = async () => {
    if (!loraPath) return;

    try {
      const result = await aceStepAPI.loadLoRA(loraPath);
      setLoraStatus(result);
    } catch (error) {
      console.error("LoRA loading failed:", error);
      setLoraStatus(`Error: ${error}`);
    }
  };

  const handleUnloadLoRA = async () => {
    try {
      const result = await aceStepAPI.unloadLoRA();
      setLoraStatus(result);
      setLoraPath("");
    } catch (error) {
      console.error("LoRA unloading failed:", error);
      setLoraStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Model Configuration */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Model Configuration
          </CardTitle>
          <CardDescription>Configure and initialize the ACE-STEP model</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="modelPath">Model Path</Label>
              <Select value={config.mainModelPath} onValueChange={(v) => setConfig({ ...config, mainModelPath: v })}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acestep-v15-turbo">ACE-STEP v1.5 Turbo</SelectItem>
                  <SelectItem value="acestep-v15">ACE-STEP v1.5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="device">Device</Label>
              <Select value={config.device} onValueChange={(v) => setConfig({ ...config, device: v })}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="cuda">CUDA (GPU)</SelectItem>
                  <SelectItem value="cpu">CPU</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="use5HzLM"
                checked={config.use5HzLM}
                onCheckedChange={(checked) => setConfig({ ...config, use5HzLM: checked as boolean })}
              />
              <Label htmlFor="use5HzLM" className="cursor-pointer">
                Initialize 5Hz Language Model (better quality)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="flashAttn"
                checked={config.useFlashAttention}
                onCheckedChange={(checked) => setConfig({ ...config, useFlashAttention: checked as boolean })}
              />
              <Label htmlFor="flashAttn" className="cursor-pointer">
                Use Flash Attention (faster inference)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="offloadCPU"
                checked={config.offloadToCPU}
                onCheckedChange={(checked) => setConfig({ ...config, offloadToCPU: checked as boolean })}
              />
              <Label htmlFor="offloadCPU" className="cursor-pointer">
                Offload to CPU (reduce VRAM usage)
              </Label>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          <div className="space-y-2">
            <p className="text-sm text-slate-400">
              Status: <span className={status.includes("Error") ? "text-red-400" : status.includes("success") ? "text-green-400" : "text-yellow-400"}>{status}</span>
            </p>
          </div>

          <Button onClick={handleInitialize} disabled={isInitializing} className="w-full bg-purple-600 hover:bg-purple-700">
            <Cpu className="w-4 h-4 mr-2" />
            {isInitializing ? "Initializing..." : "Initialize Model"}
          </Button>
        </CardContent>
      </Card>

      {/* LoRA Management */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            LoRA Adapters
          </CardTitle>
          <CardDescription>Load custom LoRA adapters for style control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loraPath">LoRA Path</Label>
            <Input
              id="loraPath"
              placeholder="path/to/lora/adapter"
              value={loraPath}
              onChange={(e) => setLoraPath(e.target.value)}
              className="bg-slate-900 border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-400">
              Status: <span className="text-blue-400">{loraStatus}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleLoadLoRA} disabled={!loraPath} className="flex-1" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Load LoRA
            </Button>
            <Button onClick={handleUnloadLoRA} className="flex-1" variant="outline">
              <X className="w-4 h-4 mr-2" />
              Unload LoRA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure API endpoint</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Endpoint</Label>
            <Input
              value="https://ace-step-ace-step-v1-5.hf.space"
              disabled
              className="bg-slate-900 border-slate-700 text-slate-500"
            />
            <p className="text-xs text-slate-500">Set NEXT_PUBLIC_API_URL in .env.local to change</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
