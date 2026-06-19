"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
}

export interface TTSState {
  isLoading: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  error: string | null;
  progress: number;
  duration: number;
  currentTime: number;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.0,
};

export function useTTS() {
  const [state, setState] = useState<TTSState>({
    isLoading: false,
    isPlaying: false,
    isPaused: false,
    error: null,
    progress: 0,
    duration: 0,
    currentTime: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Setup Web Audio API analyser for visualization
  const setupAudioAnalyser = useCallback((audioElement: HTMLAudioElement) => {
    // Only create context and source once per audio element
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    // Create analyser if not exists
    if (!analyserRef.current) {
      analyserRef.current = ctx.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
    }

    // Only create source node once per audio element
    if (!sourceRef.current) {
      try {
        sourceRef.current = ctx.createMediaElementSource(audioElement);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(ctx.destination);
      } catch {
        // Source already created for this element — that's fine
      }
    }

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === "suspended") {
      ctx.resume();
    }
  }, []);

  // Track playback progress
  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      const audio = audioRef.current;
      if (audio && !isNaN(audio.duration)) {
        setState((prev) => ({
          ...prev,
          currentTime: audio.currentTime,
          duration: audio.duration,
          progress: (audio.currentTime / audio.duration) * 100,
        }));
      }
    }, 50);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Core speak function
  const speak = useCallback(
    async (
      text: string,
      voiceId: string,
      settings: VoiceSettings = DEFAULT_SETTINGS
    ) => {
      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Clean up old blob URL
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }

      setState({
        isLoading: true,
        isPlaying: false,
        isPaused: false,
        error: null,
        progress: 0,
        duration: 0,
        currentTime: 0,
      });

      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voiceId,
            voiceSettings: settings,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `TTS request failed: ${response.status}`
          );
        }

        // Collect the audio stream into a blob
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;

        // Reset source node so we can connect the new audio element
        sourceRef.current = null;

        // Create and play audio
        const audio = new Audio(url);
        audioRef.current = audio;

        // Setup Web Audio API analysis for visualization
        setupAudioAnalyser(audio);

        audio.addEventListener("play", () => {
          setState((prev) => ({
            ...prev,
            isPlaying: true,
            isPaused: false,
            isLoading: false,
          }));
          startProgressTracking();
        });

        audio.addEventListener("pause", () => {
          setState((prev) => ({
            ...prev,
            isPlaying: !audio.ended,
            isPaused: !audio.ended,
          }));
          if (!audio.ended) {
            stopProgressTracking();
          }
        });

        audio.addEventListener("ended", () => {
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
            progress: 100,
          }));
          stopProgressTracking();
        });

        audio.addEventListener("error", () => {
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
            isLoading: false,
            error: "Audio playback error",
          }));
          stopProgressTracking();
        });

        await audio.play();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to generate speech",
        }));
      }
    },
    [setupAudioAnalyser, startProgressTracking, stopProgressTracking]
  );

  // Playback controls
  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
    audioRef.current?.play();
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopProgressTracking();
    setState({
      isLoading: false,
      isPlaying: false,
      isPaused: false,
      error: null,
      progress: 0,
      duration: 0,
      currentTime: 0,
    });
  }, [stopProgressTracking]);

  const seek = useCallback((time: number) => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      audioRef.current.currentTime = time;
      setState((prev) => ({
        ...prev,
        currentTime: time,
        progress: (time / audioRef.current!.duration) * 100,
      }));
    }
  }, []);

  const seekByPercent = useCallback(
    (percent: number) => {
      if (audioRef.current && !isNaN(audioRef.current.duration)) {
        const time = (percent / 100) * audioRef.current.duration;
        seek(time);
      }
    },
    [seek]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopProgressTracking]);

  return {
    ...state,
    speak,
    pause,
    resume,
    stop,
    seek,
    seekByPercent,
    analyserNode: analyserRef.current,
    getAnalyserNode: () => analyserRef.current,
  };
}
