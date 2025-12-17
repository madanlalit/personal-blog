
import { useCallback, useRef, useEffect, useState } from 'react';

// Extend Window interface to include webkitAudioContext
interface CustomWindow extends Window {
    webkitAudioContext: typeof AudioContext;
}

const useSound = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        // Initialize AudioContext on first user interaction to bypass autoplay policy
        const initAudio = () => {
            if (!audioCtxRef.current) {
                const AudioContextClass = window.AudioContext || (window as unknown as CustomWindow).webkitAudioContext;
                audioCtxRef.current = new AudioContextClass();
            }
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
        };

        const handleInteraction = () => initAudio();
        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
        if (muted || !audioCtxRef.current) return;

        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }, [muted]);

    const playKeySound = useCallback(() => {
        // Soothing soft pop: Sine wave with subtle variation
        // varying pitch slightly (300-400Hz) for organic feel
        const freq = 300 + Math.random() * 100;
        playTone(freq, 'sine', 0.05, 0.03);
    }, [playTone]);

    const playHoverSound = useCallback(() => {
        // Soft high-tech blip
        playTone(800, 'sine', 0.1, 0.03);
    }, [playTone]);

    const playAlertSound = useCallback((type: 'success' | 'warning' | 'error') => {
        if (type === 'success') {
            playTone(440, 'square', 0.1, 0.1);
            setTimeout(() => playTone(880, 'square', 0.2, 0.1), 100);
        } else if (type === 'error') {
            playTone(150, 'sawtooth', 0.3, 0.2);
            setTimeout(() => playTone(100, 'sawtooth', 0.3, 0.2), 100);
        } else {
            playTone(600, 'sine', 0.3, 0.1);
        }
    }, [playTone]);

    const toggleMute = () => setMuted(prev => !prev);

    return { playKeySound, playHoverSound, playAlertSound, toggleMute, muted };
};

export default useSound;
