"use client";

import { useState } from "react";
import { useTTS, VoiceSettings } from "./hooks/use-tts";
import { useVoices } from "./hooks/use-voices";
import TextInput from "./components/text-input";
import PlayButton from "./components/play-button";
import VoiceSelector from "./components/voice-selector";
import VoiceSettingsPanel from "./components/voice-settings";
import AudioVisualizer from "./components/audio-visualizer";
import ProgressBar from "./components/progress-bar";

export default function Home() {
  const [text, setText] = useState("");
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.0,
  });

  const tts = useTTS();
  const {
    voices,
    groupedVoices,
    isLoading: voicesLoading,
    error: voicesError,
    selectedVoice,
    setSelectedVoice,
    previewVoice,
    previewingId,
  } = useVoices();

  const handlePlay = () => {
    if (!text.trim() || !selectedVoice) return;
    tts.speak(text, selectedVoice.voice_id, voiceSettings);
  };

  const hasText = text.trim().length > 0;
  const isActive = tts.isPlaying || tts.isPaused;

  return (
    <div className="relative flex flex-col flex-1 min-h-screen z-[1]">
      {/* Header */}
      <header className="w-full py-6 px-6 animate-fade-in-up">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--vf-gradient-accent)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0a0a0f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">VoiceFlow</h1>
              <p
                className="text-xs"
                style={{ color: "var(--vf-text-muted)" }}
              >
                AI Text to Speech
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="vf-badge-accent vf-badge">
              <span
                className="w-1.5 h-1.5 rounded-full mr-1.5"
                style={{ background: "var(--vf-accent)" }}
              />
              ElevenLabs
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pb-12">
        {/* Hero */}
        <section className="text-center py-8 animate-fade-in-up-delay-1">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            <span className="gradient-text">Natural Voice</span>
            <br />
            <span style={{ color: "var(--vf-text-primary)" }}>
              for Any Text
            </span>
          </h2>
          <p
            className="text-base max-w-md mx-auto"
            style={{ color: "var(--vf-text-secondary)" }}
          >
            Powered by ElevenLabs&apos; industry-leading AI. Type, paste, or speak
            — and hear it come alive with human-like clarity.
          </p>
        </section>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in-up-delay-2">
          {/* Left Column — Input & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input Card */}
            <div className="glass-card p-6">
              <TextInput
                value={text}
                onChange={setText}
                disabled={tts.isLoading}
              />
            </div>

            {/* Voice Selector Card */}
            <div className="glass-card p-6">
              <VoiceSelector
                voices={voices}
                groupedVoices={groupedVoices}
                selectedVoice={selectedVoice}
                onSelect={setSelectedVoice}
                onPreview={previewVoice}
                previewingId={previewingId}
                isLoading={voicesLoading}
              />
              {voicesError && (
                <div
                  className="mt-3 text-xs p-3 rounded-lg"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#f87171",
                    border: "1px solid rgba(239, 68, 68, 0.15)",
                  }}
                >
                  {voicesError}
                </div>
              )}
            </div>

            {/* Voice Settings Card */}
            <div className="glass-card p-6">
              <VoiceSettingsPanel
                settings={voiceSettings}
                onChange={setVoiceSettings}
              />
            </div>
          </div>

          {/* Right Column — Playback & Visualization */}
          <div className="lg:col-span-3 space-y-6">
            {/* Visualizer Card */}
            <div className="glass-card-glow p-8 flex flex-col items-center justify-center min-h-[340px]">
              {/* Visualizer */}
              <AudioVisualizer
                getAnalyserNode={tts.getAnalyserNode}
                isPlaying={tts.isPlaying}
                isPaused={tts.isPaused}
              />

              {/* Play Controls */}
              <div className="mt-8 flex flex-col items-center gap-6 w-full">
                <PlayButton
                  isLoading={tts.isLoading}
                  isPlaying={tts.isPlaying}
                  isPaused={tts.isPaused}
                  disabled={!hasText || !selectedVoice}
                  onPlay={handlePlay}
                  onPause={tts.pause}
                  onResume={tts.resume}
                  onStop={tts.stop}
                />

                <ProgressBar
                  progress={tts.progress}
                  currentTime={tts.currentTime}
                  duration={tts.duration}
                  onSeek={tts.seekByPercent}
                  isActive={isActive}
                />
              </div>

              {/* Error display */}
              {tts.error && (
                <div
                  className="mt-4 text-xs p-3 rounded-lg w-full"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#f87171",
                    border: "1px solid rgba(239, 68, 68, 0.15)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {tts.error}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Voice Info */}
            {selectedVoice && (
              <div className="glass-card p-5 animate-fade-in-up-delay-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          background: "var(--vf-accent-glow)",
                          color: "var(--vf-accent)",
                        }}
                      >
                        {selectedVoice.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-semibold">
                          {selectedVoice.name}
                        </span>
                        <p
                          className="text-xs"
                          style={{ color: "var(--vf-text-muted)" }}
                        >
                          {selectedVoice.category} voice
                          {selectedVoice.labels?.accent
                            ? ` · ${selectedVoice.labels.accent} accent`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {Object.entries(selectedVoice.labels || {})
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <span key={key} className="vf-badge">
                          {value}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Info footer */}
            <div
              className="text-center text-xs py-4"
              style={{ color: "var(--vf-text-muted)" }}
            >
              <p>
                Powered by{" "}
                <a
                  href="https://elevenlabs.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                  style={{ color: "var(--vf-text-secondary)" }}
                >
                  ElevenLabs
                </a>{" "}
                · Eleven Multilingual v2 model · Premium AI voices
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
