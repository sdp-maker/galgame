// 音频管理器类
class AudioManager {
    constructor() {
        this.musicVolume = 0.5; // 背景音乐音量
        this.sfxVolume = 0.7; // 音效音量
        this.isMuted = false; // 是否静音
        this.currentMusic = null;
        this.music = {};
        this.soundEffects = {};
    }

    // 初始化音频系统
    init() {
        // 预加载音频资源
        this.preloadAudio();
    }

    // 预加载音频资源
    preloadAudio() {
        // 创建空的音频对象作为所有音乐的占位符
        const emptyAudio = new Audio();
        
        // 为所有需要的音乐ID设置空音频对象
        this.music = {
            'opening_theme': emptyAudio,
            'school_theme': emptyAudio,
            'library': emptyAudio,
            'student_council': emptyAudio,
            'canteen': emptyAudio,
            'romantic': emptyAudio,
            'happy_day': emptyAudio,
            'heart_warming': emptyAudio
        };

        // 为所有需要的音效ID设置空音频对象
        this.soundEffects = {
            'click': emptyAudio,
            'notification': emptyAudio,
            'success': emptyAudio,
            'error': emptyAudio,
            'transition': emptyAudio
        };
        
        console.log('音频系统已初始化（使用空音频对象）');
    }

    // 播放背景音乐
    playMusic(musicId) {
        try {
            // 停止当前播放的音乐
            if (this.currentMusic && this.currentMusic.id === musicId) {
                return; // 已经在播放相同的音乐
            }

            this.stopBackgroundMusic();

            // 播放新音乐
            const music = this.music[musicId];
            if (music) {
                music.loop = true;
                music.volume = this.isMuted ? 0 : this.musicVolume;
                // 由于没有实际音频文件，这里跳过实际的播放操作
                this.currentMusic = { id: musicId, audio: music };
            } else {
                console.warn(`音乐 ${musicId} 不存在`);
            }
        } catch (error) {
            console.warn('播放音乐时出错:', error);
        }
    }

    // 停止背景音乐
    stopBackgroundMusic() {
        if (this.currentMusic && this.currentMusic.audio) {
            try {
                this.currentMusic.audio.pause();
                this.currentMusic.audio.currentTime = 0;
            } catch (error) {
                console.warn('停止音乐时出错:', error);
            }
            this.currentMusic = null;
        }
    }

    // 暂停背景音乐
    pauseBackgroundMusic() {
        if (this.currentMusic && this.currentMusic.audio && !this.currentMusic.audio.paused) {
            try {
                this.currentMusic.audio.pause();
            } catch (error) {
                console.warn('暂停音乐时出错:', error);
            }
        }
    }

    // 恢复背景音乐
    resumeBackgroundMusic() {
        if (this.currentMusic && this.currentMusic.audio && this.currentMusic.audio.paused) {
            this.currentMusic.audio.play().catch(error => {
                console.warn('恢复音乐播放失败:', error);
            });
        }
    }

    // 播放音效
    playSoundEffect(sfxId) {
        try {
            const sfx = this.soundEffects[sfxId];
            if (sfx) {
                // 由于没有实际音频文件，这里跳过实际的播放操作
                // 仅记录要播放的音效ID
                console.log(`播放音效: ${sfxId}`);
            }
        } catch (error) {
            console.warn('音效播放出错:', error);
        }
    }

    // 设置背景音乐音量
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic && this.currentMusic.audio) {
            try {
                this.currentMusic.audio.volume = this.isMuted ? 0 : this.musicVolume;
            } catch (error) {
                console.warn('设置音乐音量时出错:', error);
            }
        }
    }

    // 设置音效音量
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        for (const audio of Object.values(this.soundEffects)) {
            audio.volume = this.isMuted ? 0 : this.sfxVolume;
        }
    }

    // 切换静音状态
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // 更新背景音乐音量
        if (this.currentMusic && this.currentMusic.audio) {
            try {
                this.currentMusic.audio.volume = this.isMuted ? 0 : this.musicVolume;
            } catch (error) {
                console.warn('更新音乐静音状态时出错:', error);
            }
        }
        
        // 更新音效音量
        for (const audio of Object.values(this.soundEffects)) {
            audio.volume = this.isMuted ? 0 : this.sfxVolume;
        }
        
        return this.isMuted;
    }

    // 获取当前音乐ID
    getCurrentMusicId() {
        return this.currentMusic?.id || null;
    }

    // 检查是否静音
    getIsMuted() {
        return this.isMuted;
    }
}