import React, { useEffect, useRef } from 'react';

interface BGMPlayerProps {
  isPlaying: boolean;
  volume?: number; // 0-1
}

const BGMPlayer: React.FC<BGMPlayerProps> = ({ isPlaying, volume = 0.3 }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.volume = volume;
      audio.play().catch(err => {
        console.warn('BGM播放失败（可能需要用户交互）:', err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, volume]);

  return (
    <audio 
      ref={audioRef} 
      loop 
      preload="auto"
    >
      {/* 支持从 public 文件夹读取音频文件 */}
      {/* 将音频文件放在 public/bgm.mp3 */}
      <source src="/comedy/bgm.mp3" type="audio/mpeg" />
      <source src="/comedy/bgm.ogg" type="audio/ogg" />
      您的浏览器不支持音频播放。
    </audio>
  );
};

export default BGMPlayer;
