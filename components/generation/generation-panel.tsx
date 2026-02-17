"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Music, Sparkles, Upload, Settings2, Download, PlayCircle } from "lucide-react";
import { aceStepAPI } from "@/lib/api/ace-step-api";
import type { GenerationParams } from "@/lib/types";

export function GenerationPanel() {
  const [mode, setMode] = useState<"simple" | "custom" | "cover" | "repaint">("simple");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [results, setResults] = useState<any>(null);

  // Simple mode state
  const [description, setDescription] = useState("");
  const [instrumental, setInstrumental] = useState(false);
  const [vocalLanguage, setVocalLanguage] = useState("english");

  // Custom mode state
  const [prompt, setPrompt] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [bpm, setBpm] = useState(120);
  const [duration, setDuration] = useState(30);
  const [keySignature, setKeySignature] = useState("");
  const [timeSignature, setTimeSignature] = useState("4/4");

  // Advanced parameters
  const [ditSteps, setDitSteps] = useState(8);
  const [cfgScale, setCfgScale] = useState(3.5);
  const [temperature, setTemperature] = useState(0.85);
  const [topK, setTopK] = useState(0);
  const [topP, setTopP] = useState(0.9);
  const [batchSize, setBatchSize] = useState(2);

  const handleSimpleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setStatus("Generating from description...");

    try {
      const result = await aceStepAPI.generateFromDescription(
        description,
        instrumental,
        instrumental ? "unknown" : vocalLanguage,
        temperature,
        topK,
        topP,
        false,
        (statusMsg) => {
          setStatus(statusMsg);
          setProgress((prev) => Math.min(prev + 10, 90));
        }
      );

      setResults(result);
      setProgress(100);
      setStatus("Generation complete!");
    } catch (error) {
      console.error("Generation failed:", error);
      setStatus(`Error: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setStatus("Generating music...");

    try {
      const params: GenerationParams = {
        mode: "text2music",
        prompt,
        lyrics,
        vocalLanguage,
        bpm,
        keySignature,
        timeSignature,
        duration,
        batchSize,
        seed: "",
        randomSeed: true,
        ditSteps,
        cfgScale,
        shift: 1.0,
        guidanceRescale: 0.0,
        inferenceMethod: "euler",
        lmTemperature: temperature,
        lmCfgScale: 1.0,
        lmTopK: topK,
        lmTopP: topP,
        useFlashAttn: true,
        thinking: false,
        instrumental: false,
      };

      const result = await aceStepAPI.generateMusic(params, (statusMsg) => {
        setStatus(statusMsg);
        setProgress((prev) => Math.min(prev + 10, 90));
      });

      setResults(result);
      setProgress(100);
      setStatus("Generation complete!");
    } catch (error) {
      console.error("Generation failed:", error);
      setStatus(`Error: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadRandomExample = async () => {
    try {
      const example = await aceStepAPI.loadRandomExample();
      setDescription(example.description);
      setInstrumental(example.instrumental);
      setVocalLanguage(example.language);
    } catch (error) {
      console.error("Failed to load example:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Generation Mode
          </CardTitle>
          <CardDescription>Choose how you want to generate music</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={mode} onValueChange={(v: any) => setMode(v)} className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <RadioGroupItem value="simple" id="simple" className="peer sr-only" />
              <Label
                htmlFor="simple"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-900 p-4 hover:bg-slate-800 peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500 cursor-pointer"
              >
                <Sparkles className="mb-3 h-6 w-6" />
                <span className="font-semibold">Simple</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Quick generation</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="custom" id="custom" className="peer sr-only" />
              <Label
                htmlFor="custom"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-900 p-4 hover:bg-slate-800 peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500 cursor-pointer"
              >
                <Settings2 className="mb-3 h-6 w-6" />
                <span className="font-semibold">Custom</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Full control</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="cover" id="cover" className="peer sr-only" />
              <Label
                htmlFor="cover"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-900 p-4 hover:bg-slate-800 peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500 cursor-pointer"
              >
                <Upload className="mb-3 h-6 w-6" />
                <span className="font-semibold">Cover</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Style transfer</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="repaint" id="repaint" className="peer sr-only" />
              <Label
                htmlFor="repaint"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-900 p-4 hover:bg-slate-800 peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500 cursor-pointer"
              >
                <Music className="mb-3 h-6 w-6" />
                <span className="font-semibold">Repaint</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Edit sections</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Simple Mode */}
      {mode === "simple" && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>Simple Mode</CardTitle>
            <CardDescription>Describe the music you want to create</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Song Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., upbeat electronic dance music with catchy synth melodies"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-slate-900 border-slate-700"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="instrumental" checked={instrumental} onCheckedChange={(checked) => setInstrumental(checked as boolean)} />
              <Label htmlFor="instrumental">Instrumental (no vocals)</Label>
            </div>

            {!instrumental && (
              <div className="space-y-2">
                <Label htmlFor="language">Vocal Language</Label>
                <Select value={vocalLanguage} onValueChange={setVocalLanguage}>
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="korean">Korean</SelectItem>
                    <SelectItem value="unknown">Unknown/Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator className="bg-slate-700" />

            <div className="flex gap-3">
              <Button onClick={loadRandomExample} variant="outline" className="flex-1">
                <Sparkles className="w-4 h-4 mr-2" />
                Load Example
              </Button>
              <Button onClick={handleSimpleGenerate} disabled={isGenerating || !description} className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Music className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Music"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Mode */}
      {mode === "custom" && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>Custom Mode</CardTitle>
            <CardDescription>Full control over all parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Musical style and characteristics"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lyrics">Lyrics (optional)</Label>
                <Textarea
                  id="lyrics"
                  placeholder="Song lyrics or [Instrumental]"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="bpm">BPM</Label>
                <Input
                  id="bpm"
                  type="number"
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchSize">Batch Size</Label>
                <Input
                  id="batchSize"
                  type="number"
                  min={1}
                  max={8}
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value))}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>

            <Accordion type="single" collapsible className="border-slate-700">
              <AccordionItem value="advanced">
                <AccordionTrigger>Advanced Parameters</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>DiT Steps: {ditSteps}</Label>
                    <Slider value={[ditSteps]} onValueChange={([v]) => setDitSteps(v)} min={4} max={50} step={1} />
                  </div>
                  <div className="space-y-2">
                    <Label>CFG Scale: {cfgScale}</Label>
                    <Slider value={[cfgScale]} onValueChange={([v]) => setCfgScale(v)} min={1} max={10} step={0.1} />
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature: {temperature}</Label>
                    <Slider value={[temperature]} onValueChange={([v]) => setTemperature(v)} min={0.1} max={2} step={0.05} />
                  </div>
                  <div className="space-y-2">
                    <Label>Top-P: {topP}</Label>
                    <Slider value={[topP]} onValueChange={([v]) => setTopP(v)} min={0} max={1} step={0.01} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator className="bg-slate-700" />

            <Button onClick={handleCustomGenerate} disabled={isGenerating || !prompt} className="w-full bg-purple-600 hover:bg-purple-700">
              <Music className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Music"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generation Status */}
      {isGenerating && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <p className="text-sm text-slate-400">{status}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && !isGenerating && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5" />
              Generated Music
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-green-400 text-sm">✓ Generation completed successfully!</p>
            <p className="text-slate-400 text-sm">
              Audio playback will be available in the full implementation. Results contain {batchSize} samples.
            </p>
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
