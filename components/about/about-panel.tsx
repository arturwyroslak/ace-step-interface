"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info, Music, Zap, Code, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutPanel() {
  return (
    <div className="space-y-6">
      {/* About */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About ACE-STEP Interface
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            Professional web interface for ACE-STEP Music AI API. Built with Next.js 15, TypeScript, and shadcn/ui, providing complete access to all 99 API endpoints.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Next.js 15</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="secondary">Gradio API</Badge>
          </div>

          <Separator className="bg-slate-700" />

          <div className="flex gap-3">
            <Button variant="outline" asChild className="flex-1">
              <a href="https://github.com/arturwyroslak/ace-step-interface" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a href="https://ace-step-ace-step-v1-5.hf.space/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                API Docs
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <FeatureItem icon={<Music />} title="Multiple Generation Modes" description="Simple, Custom, Cover, and Repaint modes" />
            <FeatureItem icon={<Code />} title="99 API Endpoints" description="Complete API coverage with type-safe client" />
            <FeatureItem icon={<Zap />} title="Advanced Controls" description="Full parameter control for professional results" />
            <FeatureItem icon={<Music />} title="Batch Generation" description="Generate up to 8 samples simultaneously" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">1. Initialize Model</h4>
            <p className="text-sm text-slate-400">Go to Settings tab and initialize the model</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">2. Generate Music</h4>
            <p className="text-sm text-slate-400">Choose a mode and provide your input</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">3. Download Results</h4>
            <p className="text-sm text-slate-400">Export audio files and metadata</p>
          </div>
        </CardContent>
      </Card>

      {/* License */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <p className="text-sm text-slate-400 text-center">
            © 2026 ACE-STEP Interface • MIT License • Built by{" "}
            <a href="https://github.com/arturwyroslak" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
              @arturwyroslak
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}
