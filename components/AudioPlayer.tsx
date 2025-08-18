import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon } from './SocialIcons';

const AudioPlayer: React.FC = () => {
    const { t } = useI18n();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioSrc = '/background-music.mp3';

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
            }
        }
    };
    
    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
            setIsMuted(audioRef.current.muted);
        }
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        if(audio){
            audio.addEventListener('play', handlePlay);
            audio.addEventListener('pause', handlePause);
            
            return () => {
                audio.removeEventListener('play', handlePlay);
                audio.removeEventListener('pause', handlePause);
            }
        }
    }, []);

    return (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
            <audio ref={audioRef} src={audioSrc} loop />
            
            <button
                onClick={togglePlayPause}
                aria-label={isPlaying ? t('audio_player_pause') : t('audio_player_play')}
                className="w-12 h-12 glass-card !rounded-full flex items-center justify-center text-secondary hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
            >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            
            <div className={`transition-all duration-300 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                 <button
                    onClick={toggleMute}
                    aria-label={isMuted ? t('audio_player_unmute') : t('audio_player_mute')}
                    className="w-10 h-10 glass-card !rounded-full flex items-center justify-center text-secondary hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
                >
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </button>
            </div>
        </div>
    );
};

export default AudioPlayer;
