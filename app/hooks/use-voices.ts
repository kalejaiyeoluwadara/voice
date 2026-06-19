"use client";

import { useState, useEffect, useCallback } from "react";

export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  preview_url: string;
  description: string;
}

export interface VoiceGroup {
  category: string;
  voices: Voice[];
}

export function useVoices() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const fetchVoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/voices");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch voices");
      }

      const data = await response.json();
      setVoices(data.voices);

      // Auto-select first voice if none selected
      if (data.voices.length > 0 && !selectedVoice) {
        // Try to find a good default voice (Rachel or first premade)
        const rachel = data.voices.find(
          (v: Voice) => v.name === "Rachel" || v.voice_id === "21m00Tcm4TlvDq8ikWAM"
        );
        const premade = data.voices.find(
          (v: Voice) => v.category === "premade"
        );
        setSelectedVoice(rachel || premade || data.voices[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch voices");
    } finally {
      setIsLoading(false);
    }
  }, [selectedVoice]);

  useEffect(() => {
    fetchVoices();
  }, [fetchVoices]);

  // Group voices by category
  const groupedVoices: VoiceGroup[] = voices.reduce(
    (groups: VoiceGroup[], voice) => {
      const category = voice.category || "other";
      const existingGroup = groups.find((g) => g.category === category);
      if (existingGroup) {
        existingGroup.voices.push(voice);
      } else {
        groups.push({ category, voices: [voice] });
      }
      return groups;
    },
    []
  );

  // Preview a voice
  const previewVoice = useCallback(
    (voice: Voice) => {
      // Stop current preview
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.currentTime = 0;
      }

      if (previewingId === voice.voice_id) {
        setPreviewingId(null);
        return;
      }

      if (!voice.preview_url) return;

      const audio = new Audio(voice.preview_url);
      audio.volume = 0.7;
      audio.play();
      setPreviewAudio(audio);
      setPreviewingId(voice.voice_id);

      audio.addEventListener("ended", () => {
        setPreviewingId(null);
      });
    },
    [previewAudio, previewingId]
  );

  return {
    voices,
    groupedVoices,
    isLoading,
    error,
    selectedVoice,
    setSelectedVoice,
    previewVoice,
    previewingId,
    refetch: fetchVoices,
  };
}
