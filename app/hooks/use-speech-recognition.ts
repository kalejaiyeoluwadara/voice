"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onResultCallbackRef = useRef<((text: string) => void) | null>(null);

  // Check support on mount
  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    setIsSupported(supported);
  }, []);

  const startListening = useCallback(
    (onFinalResult?: (text: string) => void) => {
      if (!isSupported) return;

      // Stop any existing recognition
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();

      recognition.continuous = false; // Single utterance mode
      recognition.interimResults = true;
      recognition.lang = "en-US";

      onResultCallbackRef.current = onFinalResult || null;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
        setInterimTranscript("");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }

        if (final) {
          setTranscript(final);
          setInterimTranscript("");
        } else {
          setInterimTranscript(interim);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Get the final transcript and send it
        const finalText =
          transcript ||
          interimTranscript ||
          "";

        // Use a small timeout to ensure state is updated
        setTimeout(() => {
          if (onResultCallbackRef.current) {
            // We need to read from the DOM since state might not be updated
            const t = recognitionRef.current;
            if (t) {
              // The callback will be called from the component with the latest state
            }
          }
        }, 0);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error !== "no-speech" && event.error !== "aborted") {
          console.error("Speech recognition error:", event.error);
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [isSupported, transcript, interimTranscript]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    setTranscript,
    setInterimTranscript,
  };
}
