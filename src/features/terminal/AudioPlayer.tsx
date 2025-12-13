
import React, { useState, useEffect, useRef } from 'react';
import './AudioPlayer.css';

interface AudioPlayerProps {
    onExit: () => void;
}

const TRACKS = [
    { title: "Synthwave Demo 1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Techno Beat 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Electronica 3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onExit }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, volume, currentTrack]);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
        setIsPlaying(true);
    };
    const prevTrack = () => {
        setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        setIsPlaying(true);
    };

    return (
        <div className="audio-player-overlay fade-in">
            <div className="audio-player-window tui-window">
                <div className="player-header">
                    <h3>AMP AUDIO PLAYER v1.0</h3>
                    <button onClick={onExit}>[X]</button>
                </div>

                <div className="player-display">
                    <div className="track-info">
                        <span className="track-label">NOW PLAYING:</span>
                        <div className="track-title-scroller">
                            <span className="track-title">{TRACKS[currentTrack].title}</span>
                        </div>
                    </div>

                    <div className="visualizer">
                        {/* Fake visualizer bars */}
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className={`bar ${isPlaying ? 'animate' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                        ))}
                    </div>
                </div>

                <div className="player-controls">
                    <button onClick={prevTrack}>|&lt;</button>
                    <button onClick={togglePlay}>{isPlaying ? '||' : '►'}</button>
                    <button onClick={nextTrack}>&gt;|</button>
                </div>

                <div className="volume-control">
                    <span>VOL:</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                    />
                </div>

                <audio
                    ref={audioRef}
                    src={TRACKS[currentTrack].url}
                    onEnded={nextTrack}
                />
            </div>
        </div>
    );
};

export default AudioPlayer;
