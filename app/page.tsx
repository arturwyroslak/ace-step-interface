"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Music, Settings, Info } from "lucide-react";
import { GenerationPanel } from "@/components/generation/generation-panel";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { AboutPanel } from "@/components/about/about-panel";

export default function Home() {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2">
            🎵 ACE-STEP Music AI
          </h1>
          <p className="text-slate-400 text-lg">
            Professional Text-to-Music Generation Interface
          </p>
        </div>

        {/* Main Content */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="generate" className="data-[state=active]:bg-purple-600">
                <Music className="w-4 h-4 mr-2" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-purple-600">
                <Info className="w-4 h-4 mr-2" />
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="p-6">
              <GenerationPanel />
            </TabsContent>

            <TabsContent value="settings" className="p-6">
              <SettingsPanel />
            </TabsContent>

            <TabsContent value="about" className="p-6">
              <AboutPanel />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>
            Powered by{" "}
            <a
              href="https://ace-step-ace-step-v1-5.hf.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              ACE-STEP v1.5
            </a>
            {" • "}
            Built with Next.js, TypeScript & shadcn/ui
          </p>
        </div>
      </div>
    </main>
  );
}
