/**
 * useSpeechRecognition — Web Speech API wrapper.
 * Provides transcript, isListening, start/stop controls.
 */
import { useState, useRef, useCallback } from 'react';

interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const currentTranscriptRef = useRef('');

  const initRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (e: any) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      currentTranscriptRef.current = text;
      setTranscript(text);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    return recognition;
  }, []);

  const startListening = useCallback(() => {
    const recognition = initRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;
    recognitionRef.current.start();
    setIsListening(true);
  }, [initRecognition]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    currentTranscriptRef.current = '';
    setTranscript('');
  }, []);

  return { transcript, isListening, startListening, stopListening, resetTranscript };
};
