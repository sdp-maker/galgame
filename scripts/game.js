// 视觉效果管理器
class EffectManager {
    constructor() {
        this.activeEffects = new Map();
    }
    
    // 应用效果到元素
    applyEffect(element, effectName, duration = 1000) {
        if (!element) return;
        
        // 移除可能存在的相同效果
        this.removeEffect(element, effectName);
        
        // 添加新效果
        element.classList.add(effectName);
        
        // 记录效果
        this.activeEffects.set(`${element.id || element.className}-${effectName}`, {
            element: element,
            effectName: effectName
        });
        
        // 设置自动移除
        setTimeout(() => {
            this.removeEffect(element, effectName);
        }, duration);
    }
    
    // 移除效果
    removeEffect(element, effectName) {
        if (!element) return;
        
        element.classList.remove(effectName);
        
        // 从记录中移除
        const key = `${element.id || element.className}-${effectName}`;
        this.activeEffects.delete(key);
    }
    
    // 淡入效果
    fadeIn(element, duration = 1000) {
        this.applyEffect(element, 'fade-in', duration);
    }
    
    // 淡出效果
    fadeOut(element, duration = 1000) {
        this.applyEffect(element, 'fade-out', duration);
    }
    
    // 震动效果
    shake(element, duration = 500) {
        this.applyEffect(element, 'shake', duration);
    }
    
    // 脉冲效果
    pulse(element, duration = 1000) {
        this.applyEffect(element, 'pulse', duration);
    }
    
    // 闪烁效果
    flash(element, duration = 500) {
        this.applyEffect(element, 'flash', duration);
    }
    
    // 从左侧滑入
    slideInLeft(element, duration = 500) {
        this.applyEffect(element, 'slide-in-left', duration);
    }
    
    // 从右侧滑入
    slideInRight(element, duration = 500) {
        this.applyEffect(element, 'slide-in-right', duration);
    }
    
    // 从顶部滑入
    slideInTop(element, duration = 500) {
        this.applyEffect(element, 'slide-in-top', duration);
    }
    
    // 从底部滑入
    slideInBottom(element, duration = 500) {
        this.applyEffect(element, 'slide-in-bottom', duration);
    }
    
    // 缩放进入
    zoomIn(element, duration = 500) {
        this.applyEffect(element, 'zoom-in', duration);
    }
    
    // 旋转效果
    rotate(element, duration = 500) {
        this.applyEffect(element, 'rotate', duration);
    }
    
    // 清除所有效果
    clearAllEffects() {
        this.activeEffects.forEach(({ element, effectName }) => {
            this.removeEffect(element, effectName);
        });
        this.activeEffects.clear();
    }
}

// 游戏状态管理
class GameState {
    constructor() {
        this.currentScene = 'opening';
        this.currentLineIndex = 0;
        this.gameData = null;
        this.isAutoPlay = false;
        this.autoPlayInterval = null;
        this.saveData = this.loadSaveData();
        this.choicesMade = 0;
        
        // 角色好感度系统
        this.characterAffection = {};
        this.initializeCharacterAffection();
        
        // 成就系统
        this.achievements = {};
        this.unlockedAchievements = [];
        this.gameStartTime = Date.now();
        this.visitedScenes = new Set();
        this.unlockedEndings = new Set();
        // Achievement system will be initialized when loading game data
    }

    // 初始化角色好感度
    initializeCharacterAffection() {
        // 如果游戏数据已加载，初始化所有角色的好感度
        if (this.gameData && this.gameData.characters) {
            // characters是对象，不是数组，需要使用Object.keys遍历
            Object.keys(this.gameData.characters).forEach(characterId => {
                const character = this.gameData.characters[characterId];
                // 为主角外的所有角色初始化好感度
                if (characterId !== 'protagonist') {
                    this.characterAffection[characterId] = 0;
                }
            });
        }
    }

    // 增加角色好感度
    increaseAffection(characterId, amount = 1) {
        if (this.characterAffection[characterId] !== undefined) {
            this.characterAffection[characterId] += amount;
            // 限制好感度范围
            this.characterAffection[characterId] = Math.max(0, Math.min(100, this.characterAffection[characterId]));
            console.log(`${characterId} 好感度: ${this.characterAffection[characterId]}`);
            
            // 添加闪光效果到好感度面板
            const affectionDisplay = document.getElementById('affection-display');
            if (affectionDisplay && !affectionDisplay.classList.contains('hidden')) {
                setTimeout(() => {
                    const affectionItem = document.querySelector(`[data-character="${characterId}"]`);
                    if (affectionItem) {
                        affectionItem.style.animation = 'flash 0.3s ease-in-out';
                        setTimeout(() => {
                            affectionItem.style.animation = '';
                        }, 300);
                    }
                }, 100);
            }
            
            // 注意：checkAchievements方法在Galgame类中，不在GameState类中
            // 成就检查将在Galgame类的相应方法中处理
        }
    }
    
    // 减少角色好感度
    decreaseAffection(characterId, amount = 1) {
        if (this.characterAffection[characterId] !== undefined) {
            this.characterAffection[characterId] -= amount;
            // 限制好感度范围
            this.characterAffection[characterId] = Math.max(0, Math.min(100, this.characterAffection[characterId]));
            console.log(`${characterId} 好感度: ${this.characterAffection[characterId]}`);
            
            // 添加震动效果到好感度面板
            const affectionDisplay = document.getElementById('affection-display');
            if (affectionDisplay && !affectionDisplay.classList.contains('hidden')) {
                setTimeout(() => {
                    const affectionItem = document.querySelector(`[data-character="${characterId}"]`);
                    if (affectionItem) {
                        affectionItem.style.animation = 'shake 0.3s ease-in-out';
                        setTimeout(() => {
                            affectionItem.style.animation = '';
                        }, 300);
                    }
                }, 100);
            }
            
            // 注意：checkAchievements方法属于Galgame类，不应在此调用
            // 成就检查应由Galgame类处理
        }
    }

    // 获取角色好感度
    getAffection(characterId) {
        return this.characterAffection[characterId] || 0;
    }

    // 设置角色好感度
    setAffection(characterId, value) {
        if (this.characterAffection[characterId] !== undefined) {
            this.characterAffection[characterId] = Math.max(0, Math.min(100, value));
            console.log(`${characterId} 好感度设置为: ${this.characterAffection[characterId]}`);
        }
    }

    // 获取好感度最高的角色
    getHighestAffectionCharacter() {
        let maxAffection = -1;
        let highestCharacter = null;
        
        for (const [characterId, affection] of Object.entries(this.characterAffection)) {
            if (affection > maxAffection) {
                maxAffection = affection;
                highestCharacter = characterId;
            }
        }
        
        return highestCharacter;
    }

    // 重置所有好感度
    resetAffection() {
        for (const characterId in this.characterAffection) {
            this.characterAffection[characterId] = 0;
        }
    }

    // 加载保存数据
    loadSaveData() {
        const savedData = localStorage.getItem('galgame_save_data');
        return savedData ? JSON.parse(savedData) : {};
    }

    // 保存游戏数据
    saveGame(slot) {
        const saveData = {
            scene: this.currentScene,
            lineIndex: this.currentLineIndex,
            characterAffection: this.characterAffection,
            timestamp: new Date().toISOString()
        };
        this.saveData[slot] = saveData;
        localStorage.setItem('galgame_save_data', JSON.stringify(this.saveData));
        return true;
    }

    // 加载游戏数据
    loadGame(slot) {
        if (this.saveData[slot]) {
            this.currentScene = this.saveData[slot].scene;
            this.currentLineIndex = this.saveData[slot].lineIndex;
            
            // 加载角色好感度
            if (this.saveData[slot].characterAffection) {
                this.characterAffection = this.saveData[slot].characterAffection;
            }
            
            return true;
        }
        return false;
    }

    // 获取保存槽信息
    getSaveSlots() {
        return Object.keys(this.saveData).map(slot => {
            const data = this.saveData[slot];
            return {
                slot,
                timestamp: data.timestamp,
                scene: data.scene,
                lineIndex: data.lineIndex
            };
        });
    }
}

// 游戏主类
class Galgame {
    constructor() {
        this.gameState = new GameState();
        this.audioManager = new AudioManager();
        this.effectManager = new EffectManager();
        this.init();
    }

    // 初始化游戏
    async init() {
        try {
            console.log('开始初始化游戏...');
            
            // 初始化音频管理器 - 添加安全检查
            try {
                if (this.audioManager && this.audioManager.init) {
                    this.audioManager.init();
                    console.log('音频管理器初始化完成');
                }
            } catch (audioError) {
                console.warn('音频管理器初始化失败，但将继续执行:', audioError);
            }
            
            // 加载游戏数据 - 关键步骤
            try {
                const response = await fetch('assets/data/script.json');
                this.gameState.gameData = await response.json();
                console.log('游戏数据加载完成');
            } catch (dataError) {
                console.error('游戏数据加载失败:', dataError);
                // 创建基础的游戏数据结构，确保游戏可以继续
                this.gameState.gameData = {
                    scenes: {
                        opening: {
                            background: 'school.jpg', // 使用完整的文件名
                            music: 'default',
                            dialogues: [
                                { speaker: '系统', text: '欢迎来到校园故事游戏！', character: null }
                            ]
                        }
                    }
                };
            }
            
            // 初始化角色好感度系统
            if (this.gameState && this.gameState.initializeCharacterAffection) {
                this.gameState.initializeCharacterAffection();
                console.log('角色好感度系统初始化完成');
            }
            
            // 初始化UI元素 - 添加try-catch
            try {
                this.initUI();
                console.log('UI元素初始化完成');
            } catch (uiError) {
                console.warn('UI初始化出错，但将继续执行:', uiError);
            }
            
            // 初始化成就系统 - 故事体验的重要部分
            try {
                this.initAchievementSystem();
                console.log('成就系统初始化完成');
            } catch (achievementError) {
                console.warn('成就系统初始化出错:', achievementError);
            }
            
            // 移除自动加载初始场景的代码，改为通过开始游戏按钮触发
            
            // 使用简化的事件监听器
            this.setupBasicEventListeners();
            
            // 添加开始游戏按钮的事件监听器
            try {
                const startBtn = document.getElementById('start-btn');
                if (startBtn) {
                    startBtn.addEventListener('click', () => {
                        this.startGame();
                    });
                    console.log('开始游戏按钮事件监听设置完成');
                }
            } catch (btnError) {
                console.warn('设置开始游戏按钮事件监听出错:', btnError);
            }
            
            console.log('游戏初始化流程完成');
        } catch (error) {
            console.error('游戏初始化失败:', error);
        }
    }
    
    // 简化版的事件监听器设置，包含按钮支持
    setupBasicEventListeners() {
        try {
            // 只设置最基础的交互功能
            const handleInteraction = () => {
                if (typeof this.nextLine === 'function') {
                    this.nextLine();
                }
            };
            
            if (typeof document !== 'undefined' && document) {
                // 点击屏幕继续
                if (document.addEventListener) {
                    // 点击屏幕空白处和文本框都能继续对话
                    document.addEventListener('click', handleInteraction.bind(this));
                    const textBox = document.getElementById('text-box');
                    if (textBox) {
                        textBox.addEventListener('click', handleInteraction.bind(this));
                    }
                    document.addEventListener('keydown', (e) => {
                        if (e && (e.key === ' ' || e.key === 'Enter')) {
                            handleInteraction.call(this);
                        }
                    });
                }
                
                // 添加开始游戏按钮支持 - 使用正确的ID
                const startBtn = document.getElementById('start-btn');
                if (startBtn && startBtn.addEventListener) {
                    startBtn.addEventListener('click', () => {
                        console.log('开始游戏按钮被点击');
                        if (typeof this.startGame === 'function') {
                            this.startGame();
                        } else {
                            console.log('直接加载开场场景');
                            // 如果startGame方法不存在，直接进入游戏
                            this.loadScene('opening');
                        }
                    });
                }
                
                // 添加继续游戏按钮支持 - 使用正确的ID
                const continueBtn = document.getElementById('continue-btn');
                if (continueBtn && continueBtn.addEventListener) {
                    continueBtn.addEventListener('click', () => {
                        console.log('继续游戏按钮被点击');
                        if (typeof this.continueGame === 'function') {
                            this.continueGame();
                        } else {
                            console.log('直接加载开场场景');
                            this.loadScene('opening');
                        }
                    });
                }
                
                // 添加其他重要按钮支持
                const optionsBtn = document.getElementById('options-btn');
                if (optionsBtn && optionsBtn.addEventListener) {
                    optionsBtn.addEventListener('click', () => {
                        console.log('选项按钮被点击');
                        if (typeof this.showOptions === 'function') {
                            this.showOptions();
                        }
                    });
                }
                
                const loadBtn = document.getElementById('load-btn');
                if (loadBtn && loadBtn.addEventListener) {
                    loadBtn.addEventListener('click', () => {
                        console.log('读取存档按钮被点击');
                        if (typeof this.showLoadScreen === 'function') {
                            this.showLoadScreen();
                        }
                    });
                }
            }
            
            console.log('基础事件监听器设置完成，包含按钮支持');
        } catch (error) {
            console.warn('设置基础事件监听器时出错:', error);
        }
    }

    // 初始化UI元素
    initUI() {
        this.elements = {
            background: document.getElementById('background'),
            charactersContainer: document.getElementById('characters-container'),
            speakerName: document.getElementById('speaker-name'),
            dialogueText: document.getElementById('dialogue-text'),
            choicesContainer: document.getElementById('choices-container'),
            menuScreen: document.getElementById('menu-screen'),
            saveLoadScreen: document.getElementById('save-load-screen'),
            saveSlots: document.querySelector('.save-slots'),
            autoBtn: document.getElementById('auto-btn'),
            skipBtn: document.getElementById('skip-btn'),
            startBtn: document.getElementById('start-btn'),
            continueBtn: document.getElementById('continue-btn'),
            optionsBtn: document.getElementById('options-btn'),
            exitBtn: document.getElementById('exit-btn'),
            loadBtn: document.getElementById('load-btn'),
            musicToggleBtn: document.getElementById('music-toggle-btn'),
            sfxToggleBtn: document.getElementById('sfx-toggle-btn'),
            musicVolume: document.getElementById('music-volume'),
            sfxVolume: document.getElementById('sfx-volume')
        };
    }

    // 初始化音频控制
    initAudioControls() {
        // 音乐切换按钮
        this.elements.musicToggleBtn.addEventListener('click', () => {
            const isMuted = this.audioManager.toggleMute();
            this.elements.musicToggleBtn.classList.toggle('muted', isMuted);
            this.elements.sfxToggleBtn.classList.toggle('muted', isMuted);
            
            // 播放音效
            this.audioManager.playSoundEffect('click');
        });

        // 音效切换按钮
        this.elements.sfxToggleBtn.addEventListener('click', () => {
            const isMuted = this.audioManager.toggleMute();
            this.elements.musicToggleBtn.classList.toggle('muted', isMuted);
            this.elements.sfxToggleBtn.classList.toggle('muted', isMuted);
            
            // 播放音效
            this.audioManager.playSoundEffect('click');
        });

        // 音乐音量滑块
        this.elements.musicVolume.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audioManager.setMusicVolume(volume);
        });

        // 音效音量滑块
        this.elements.sfxVolume.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audioManager.setSfxVolume(volume);
        });
    }
    
    // 初始化好感度面板
    initAffectionPanel() {
        const affectionToggle = document.getElementById('affection-toggle-btn');
        const affectionDisplay = document.getElementById('affection-display');
        
        // 切换好感度面板显示/隐藏
        affectionToggle.addEventListener('click', () => {
            // 添加旋转效果到切换按钮
            this.effectManager.rotate(affectionToggle, 300);
            
            affectionDisplay.classList.toggle('hidden');
            if (!affectionDisplay.classList.contains('hidden')) {
                this.updateAffectionDisplay();
            }
        });
        
        // 初始更新好感度显示
        this.updateAffectionDisplay();
    }
    
    // 初始化成就系统
    initAchievementSystem() {
        // 加载成就数据
        if (this.gameData && this.gameData.achievements) {
            this.achievements = { ...this.gameData.achievements };
        }
        
        // 加载已解锁的成就
        const savedAchievements = localStorage.getItem('galgame_achievements');
        if (savedAchievements) {
            this.unlockedAchievements = JSON.parse(savedAchievements);
            // 更新成就状态
            this.unlockedAchievements.forEach(id => {
                if (this.achievements[id]) {
                    this.achievements[id].unlocked = true;
                }
            });
        }
        
        // 初始化成就面板
        this.initAchievementPanel();
        
        // 更新成就显示
        this.updateAchievementDisplay();
    }
    
    // 初始化成就面板
    initAchievementPanel() {
        const achievementToggle = document.getElementById('achievement-toggle-btn');
        const achievementDisplay = document.getElementById('achievement-display');
        
        achievementToggle.addEventListener('click', () => {
            // 添加旋转效果到切换按钮
            this.effectManager.rotate(achievementToggle, 300);
            
            achievementDisplay.classList.toggle('hidden');
            if (!achievementDisplay.classList.contains('hidden')) {
                this.updateAchievementDisplay();
            }
        });
    }
    
    // 更新成就显示
    updateAchievementDisplay() {
        const achievementList = document.getElementById('achievement-list');
        if (!achievementList) return;
        
        achievementList.innerHTML = '';
        
        for (const id in this.achievements) {
            const achievement = this.achievements[id];
            const achievementItem = document.createElement('div');
            achievementItem.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            
            const achievementHeader = document.createElement('div');
            achievementHeader.className = 'achievement-header';
            
            const achievementName = document.createElement('div');
            achievementName.className = 'achievement-name';
            achievementName.textContent = achievement.name;
            
            const achievementIcon = document.createElement('div');
            achievementIcon.className = 'achievement-icon';
            achievementIcon.textContent = achievement.icon;
            
            achievementHeader.appendChild(achievementName);
            achievementHeader.appendChild(achievementIcon);
            
            const achievementDescription = document.createElement('div');
            achievementDescription.className = 'achievement-description';
            achievementDescription.textContent = achievement.description;
            
            const achievementProgress = document.createElement('div');
            achievementProgress.className = 'achievement-progress';
            achievementProgress.textContent = achievement.unlocked ? '已解锁' : '未解锁';
            
            achievementItem.appendChild(achievementHeader);
            achievementItem.appendChild(achievementDescription);
            achievementItem.appendChild(achievementProgress);
            
            achievementList.appendChild(achievementItem);
        }
    }
    
    // 解锁成就
    unlockAchievement(achievementId) {
        if (!this.achievements[achievementId] || this.achievements[achievementId].unlocked) {
            return false; // 成就不存在或已解锁
        }
        
        // 标记成就为已解锁
        this.achievements[achievementId].unlocked = true;
        this.unlockedAchievements.push(achievementId);
        
        // 保存到本地存储
        localStorage.setItem('galgame_achievements', JSON.stringify(this.unlockedAchievements));
        
        // 显示成就解锁通知
        this.showAchievementNotification(this.achievements[achievementId]);
        
        // 更新成就显示
        this.updateAchievementDisplay();
        
        return true;
    }
    
    // 显示成就解锁通知
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        
        const title = document.createElement('div');
        title.style.fontSize = '18px';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.textContent = '成就解锁！';
        
        const icon = document.createElement('div');
        icon.style.fontSize = '24px';
        icon.style.marginBottom = '10px';
        icon.textContent = achievement.icon;
        
        const name = document.createElement('div');
        name.style.fontSize = '16px';
        name.style.marginBottom = '5px';
        name.textContent = achievement.name;
        
        const description = document.createElement('div');
        description.style.fontSize = '14px';
        description.textContent = achievement.description;
        
        notification.appendChild(title);
        notification.appendChild(icon);
        notification.appendChild(name);
        notification.appendChild(description);
        
        document.body.appendChild(notification);
        
        // 2秒后移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }
    
    // 检查成就条件
    checkAchievements() {
        try {
            // 检查"初次选择"成就
            if (this.gameState.choicesMade > 0) {
                this.unlockAchievement('first_choice');
            }
            
            // 检查好感度相关成就
            if (this.characterAffection && this.characterAffection['heroine1'] >= 100) {
                this.unlockAchievement('heroine1_max_affection');
            }
            
            if (this.characterAffection && this.characterAffection['heroine2'] >= 100) {
                this.unlockAchievement('heroine2_max_affection');
            }
            
            // 检查结局相关成就 - 修正访问路径，应该从gameState访问
            if (this.gameState.unlockedEndings && this.gameState.unlockedEndings.size >= 3) {
                this.unlockAchievement('all_endings');
            }
            
            if (this.gameState.unlockedEndings && this.gameState.unlockedEndings.has('true_ending')) {
                this.unlockAchievement('true_ending');
            }
            
            // 检查速通成就
            const gameTime = (Date.now() - (this.gameState.gameStartTime || Date.now())) / 1000 / 60; // 分钟
            if (gameTime <= 10 && this.gameState.currentScene === 'ending') {
                this.unlockAchievement('speedrun');
            }
            
            // 检查探索成就 - 修正访问路径，应该从gameState访问
            if (this.gameState.visitedScenes && this.gameState.visitedScenes.size >= 5) {
                this.unlockAchievement('explorer');
            }
        } catch (error) {
            console.warn('检查成就时出错，但游戏将继续:', error);
        }
    }
    
    // 更新好感度显示
    updateAffectionDisplay() {
        const affectionList = document.getElementById('affection-list');
        const characterAffection = this.gameState?.characterAffection;
        
        // 安全检查
        if (!affectionList || !characterAffection) {
            console.warn('好感度显示元素不存在或角色好感度数据未定义');
            return;
        }
        
        // 清空现有内容
        affectionList.innerHTML = '';
        
        // 为每个角色创建好感度显示项
        for (const [characterId, affection] of Object.entries(characterAffection)) {
            const affectionItem = document.createElement('div');
            affectionItem.className = 'affection-item';
            
            // 角色名称
            const nameElement = document.createElement('div');
            nameElement.className = 'affection-name';
            nameElement.textContent = characterId;
            
            // 好感度条容器
            const barContainer = document.createElement('div');
            barContainer.className = 'affection-bar-container';
            
            // 好感度条
            const bar = document.createElement('div');
            bar.className = 'affection-bar';
            bar.style.width = `${affection}%`;
            
            // 好感度值
            const valueElement = document.createElement('div');
            valueElement.className = 'affection-value';
            valueElement.textContent = `${affection}/100`;
            
            // 好感度等级
            const levelElement = document.createElement('div');
            levelElement.className = 'affection-level';
            levelElement.textContent = this.getAffectionLevel(affection);
            
            // 组装元素
            barContainer.appendChild(bar);
            affectionItem.appendChild(nameElement);
            affectionItem.appendChild(barContainer);
            affectionItem.appendChild(valueElement);
            affectionItem.appendChild(levelElement);
            affectionList.appendChild(affectionItem);
        }
    }
    
    // 获取好感度等级描述
    getAffectionLevel(value) {
        if (value < 20) return "陌生人";
        if (value < 40) return "认识";
        if (value < 60) return "朋友";
        if (value < 80) return "好朋友";
        if (value < 95) return "亲密";
        return "深爱";
    }

    // 设置事件监听器
    setupEventListeners() {
        // 点击文本框继续对话
        const textBox = document.getElementById('text-box');
        if (textBox) {
            textBox.addEventListener('click', () => {
                this.nextLine();
            });
        }

        // 开始游戏按钮
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => {
                if (this.audioManager) {
                    this.audioManager.playSoundEffect('click');
                }
                this.startGame();
            });
        }

        // 继续游戏按钮
        if (this.elements.continueBtn) {
            this.elements.continueBtn.addEventListener('click', () => {
                if (this.audioManager) {
                    this.audioManager.playSoundEffect('click');
                }
                this.continueGame();
            });
        }

        // 游戏选项按钮
        if (this.elements.optionsBtn) {
            this.elements.optionsBtn.addEventListener('click', () => {
                if (this.audioManager) {
                    this.audioManager.playSoundEffect('click');
                }
                this.showOptions();
            });
        }

        // 读取按钮
        if (this.elements.loadBtn) {
            this.elements.loadBtn.addEventListener('click', () => {
                if (this.audioManager) {
                    this.audioManager.playSoundEffect('click');
                }
                this.showLoadScreen();
            });
        }

        // 退出游戏按钮
        if (this.elements.exitBtn) {
            this.elements.exitBtn.addEventListener('click', () => {
                if (this.audioManager) {
                    this.audioManager.playSoundEffect('click');
                }
                this.exitGame();
            });
        }

        // 自动播放按钮
        if (this.elements.autoBtn) {
            this.elements.autoBtn.addEventListener('click', () => {
                if (this.audioManager) {
                    this.audioManager.playSoundEffect('click');
                }
                this.toggleAutoPlay();
            });
        }

        // 跳过按钮
        if (this.elements.skipBtn) {
            this.elements.skipBtn.addEventListener('click', () => {
                if (this.audioManager) {
                    this.audioManager.playSoundEffect('click');
                }
                this.skipToNextChoice();
            });
        }

        // 键盘事件 - 添加严格的安全检查
        try {
            if (document && document.addEventListener) {
                document.addEventListener('keydown', (e) => {
                    // 只保留最基础的交互功能
                    if (e.key === ' ' || e.key === 'Enter') {
                        this.nextLine();
                    }
                });
            }
        } catch (error) {
            console.warn('设置键盘事件监听器时出错:', error);
        }

        // 音量控制 - 添加安全检查
        if (this.elements.musicVolume && this.audioManager && typeof this.audioManager.setMusicVolume === 'function') {
            this.elements.musicVolume.addEventListener('input', (event) => {
                const volume = parseFloat(event.target.value) / 100; // 确保除以100保持与原代码一致
                this.audioManager.setMusicVolume(volume);
            });
        }

        if (this.elements.sfxVolume && this.audioManager && typeof this.audioManager.setSfxVolume === 'function') {
            this.elements.sfxVolume.addEventListener('input', (event) => {
                const volume = parseFloat(event.target.value) / 100; // 确保除以100保持与原代码一致
                this.audioManager.setSfxVolume(volume);
            });
        }

        // 音乐开关 - 添加安全检查
        if (this.elements.musicToggleBtn && this.audioManager) {
            this.elements.musicToggleBtn.addEventListener('click', () => {
                // 使用toggleMute或toggleMusic，确保与原方法名匹配
                if (typeof this.audioManager.toggleMute === 'function') {
                    this.audioManager.toggleMute();
                } else if (typeof this.audioManager.toggleMusic === 'function') {
                    this.audioManager.toggleMusic();
                }
                // 添加播放点击音效
                if (typeof this.audioManager.playSoundEffect === 'function') {
                    this.audioManager.playSoundEffect('click');
                }
            });
        }

        // 音效开关 - 添加安全检查
        if (this.elements.sfxToggleBtn && this.audioManager) {
            this.elements.sfxToggleBtn.addEventListener('click', () => {
                // 使用toggleMute或toggleSfx，确保与原方法名匹配
                if (typeof this.audioManager.toggleMute === 'function') {
                    this.audioManager.toggleMute();
                } else if (typeof this.audioManager.toggleSfx === 'function') {
                    this.audioManager.toggleSfx();
                }
                // 添加播放点击音效
                if (typeof this.audioManager.playSoundEffect === 'function') {
                    this.audioManager.playSoundEffect('click');
                }
            });
        }
    }

    // 加载场景
    loadScene(sceneId) {
        try {
            console.log('尝试加载场景:', sceneId);
            
            // 安全检查
            if (!this.gameState || !this.gameState.gameData) {
                console.error('游戏状态或游戏数据未初始化');
                return;
            }
            
            // 记录访问的场景 - 添加更完善的安全检查
            if (this.gameState.visitedScenes && typeof this.gameState.visitedScenes.add === 'function') {
                try {
                    this.gameState.visitedScenes.add(sceneId);
                } catch (addError) {
                    console.warn('记录访问场景时出错:', addError);
                }
            }
            
            // 使用对象直接访问，因为scenes是对象而不是数组
            const scene = this.gameState.gameData.scenes?.[sceneId];
            if (!scene) {
                console.warn('场景未找到:', sceneId);
                return;
            }
            
            console.log('场景加载成功:', sceneId);

            this.gameState.currentScene = sceneId;
            this.gameState.currentLineIndex = 0;

            // 更新背景
            if (scene.background && typeof this.updateBackground === 'function') {
                try {
                    this.updateBackground(scene.background);
                } catch (bgError) {
                    console.warn('更新背景时出错:', bgError);
                }
            }

            // 播放背景音乐
            if (scene.music && typeof this.playMusic === 'function') {
                try {
                    this.playMusic(scene.music);
                } catch (musicError) {
                    console.warn('播放音乐时出错:', musicError);
                }
            }

            // 显示第一行对话
            if (typeof this.displayCurrentLine === 'function') {
                try {
                    this.displayCurrentLine();
                } catch (displayError) {
                    console.warn('显示对话时出错:', displayError);
                }
            }
            
            // 检查是否解锁了"初次相遇"成就
            if ((sceneId === 'library_roof' || sceneId === 'student_council' || sceneId === 'canteen' || sceneId === 'school_gate') && 
                this.gameState.unlockedAchievements && 
                Array.isArray(this.gameState.unlockedAchievements) && 
                !this.gameState.unlockedAchievements.includes('first_meeting') &&
                typeof this.unlockAchievement === 'function') {
                try {
                    this.unlockAchievement('first_meeting');
                } catch (unlockError) {
                    console.warn('解锁成就时出错:', unlockError);
                }
            }
            
            // 检查是否解锁了"四海之交"成就
            if (this.gameState.visitedScenes && 
                typeof this.gameState.visitedScenes.has === 'function' &&
                this.gameState.visitedScenes.has('library_roof') && 
                this.gameState.visitedScenes.has('student_council') && 
                this.gameState.visitedScenes.has('canteen') && 
                this.gameState.visitedScenes.has('school_gate') &&
                this.gameState.unlockedAchievements && 
                Array.isArray(this.gameState.unlockedAchievements) &&
                !this.gameState.unlockedAchievements.includes('all_characters_met') &&
                typeof this.unlockAchievement === 'function') {
                try {
                    this.unlockAchievement('all_characters_met');
                } catch (unlockError) {
                    console.warn('解锁成就时出错:', unlockError);
                }
            }
        } catch (error) {
            console.error('加载场景时出错:', error);
        }
        
        // 检查成就 - 添加安全检查
        if (typeof this.checkAchievements === 'function') {
            try {
                this.checkAchievements();
            } catch (checkError) {
                console.warn('检查成就时出错:', checkError);
            }
        }
    }

    // 更新背景
    updateBackground(backgroundId) {
        // 安全检查
        if (!this.elements || !this.elements.background || !this.effectManager) {
            console.warn('缺少必要的元素或管理器，无法更新背景');
            return;
        }
        
        // 添加淡出效果
        this.effectManager.fadeOut(this.elements.background, 500);
        
        setTimeout(() => {
            try {
                let imagePath = '';
                let altText = '';
                
                // 检查backgroundId是否已经是文件名（包含扩展名）
                if (backgroundId && backgroundId.includes('.')) {
                    imagePath = backgroundId;
                    altText = backgroundId.replace(/\.[^/.]+$/, ''); // 移除扩展名作为alt文本
                } else {
                    // 尝试从游戏数据中查找
                    let background = this.gameState?.gameData?.backgrounds?.[backgroundId];
                    // 如果是数组格式，则使用find方法
                    if (!background && Array.isArray(this.gameState?.gameData?.backgrounds)) {
                        background = this.gameState.gameData.backgrounds.find(bg => bg.id === backgroundId);
                    }
                    
                    if (background) {
                        imagePath = background.image || backgroundId;
                        altText = background.name || backgroundId;
                    } else {
                        // 默认使用提供的ID作为文件名
                        imagePath = backgroundId || 'school.jpg'; // 默认为school.jpg
                        altText = '背景图';
                    }
                }
                
                // 设置背景图片
                this.elements.background.src = `assets/images/backgrounds/${imagePath}`;
                this.elements.background.alt = altText;
                
                // 移除占位符样式
                this.elements.background.style.backgroundColor = '';
                this.elements.background.style.display = 'block';
                this.elements.background.style.alignItems = '';
                this.elements.background.style.justifyContent = '';
                this.elements.background.style.color = '';
                this.elements.background.style.fontSize = '';
                this.elements.background.style.textAlign = '';
                
                // 添加淡入效果
                this.effectManager.fadeIn(this.elements.background, 500);
            } catch (error) {
                console.error('更新背景时出错:', error);
                // 兜底措施
                if (this.elements && this.elements.background) {
                    this.elements.background.src = 'assets/images/backgrounds/school.jpg';
                    this.elements.background.alt = '学校背景';
                    this.elements.background.style.display = 'block';
                }
            }
        }, 500);
    }

    // 播放背景音乐
    playMusic(musicId) {
        // 使用音频管理器播放背景音乐
        this.audioManager.playMusic(musicId);
    }

    // 显示当前行
    displayCurrentLine() {
        try {
            // 使用对象直接访问，因为scenes是对象而不是数组
            const scene = this.gameState?.gameData?.scenes?.[this.gameState.currentScene];
            if (!scene) {
                console.warn('场景不存在或未定义');
                return;
            }
            
            // 支持script和dialogues两种属性名
            const dialogueArray = scene.script || scene.dialogues;
            if (!dialogueArray || this.gameState.currentLineIndex >= dialogueArray.length) {
                console.warn('对话数组不存在或索引超出范围');
                return;
            }

            const currentLine = dialogueArray[this.gameState.currentLineIndex];
            
            switch (currentLine.type) {
                case 'dialogue':
                    this.displayDialogue(currentLine);
                    break;
                case 'character':
                    this.updateCharacter(currentLine.characterId, currentLine.position, currentLine.expression);
                    this.gameState.currentLineIndex++;
                    this.displayCurrentLine();
                    break;
                case 'choice':
                    this.displayChoice(currentLine);
                    break;
                case 'ending':
                    this.displayEnding(currentLine.endingId);
                    // 解锁对应角色的结局成就
                    try {
                        if (this.achievements && typeof this.unlockAchievement === 'function') {
                            if (currentLine.endingId === 'huanshi_ending' && this.achievements['huanshi_end']) {
                                this.unlockAchievement('huanshi_end');
                            } else if (currentLine.endingId === 'chengxiang_ending' && this.achievements['chengxiang_end']) {
                                this.unlockAchievement('chengxiang_end');
                            } else if (currentLine.endingId === 'tianhuazhu_ending' && this.achievements['tianhuazhu_end']) {
                                this.unlockAchievement('tianhuazhu_end');
                            } else if (currentLine.endingId === 'hesuowu_ending' && this.achievements['hesuowu_end']) {
                                this.unlockAchievement('hesuowu_end');
                            }
                        }
                    } catch (achievementError) {
                        console.warn('解锁成就时出错:', achievementError);
                    }
                    break;
                case 'scene_transition':
                    // 场景过渡
                    this.gameState.currentLineIndex++;
                    this.loadScene(currentLine.nextScene);
                    break;
                default:
                    console.warn(`未知的对话类型: ${currentLine.type}`);
                    this.gameState.currentLineIndex++;
                    this.displayCurrentLine();
            }
        } catch (error) {
            console.error('显示当前行时出错:', error);
        }
    }

    // 显示对话
    displayDialogue(dialogue) {
        // 安全检查
        if (!this.elements || !this.elements.choicesContainer || !this.elements.speakerName || !this.elements.dialogueText) {
            console.warn('缺少必要的UI元素，无法显示对话');
            return;
        }
        
        try {
            // 清除选项
            this.elements.choicesContainer.innerHTML = '';
            
            // 添加闪光效果到对话框（添加安全检查）
            if (this.effectManager && typeof this.effectManager.flash === 'function') {
                const textBox = document.getElementById('text-box');
                if (textBox) {
                    this.effectManager.flash(textBox, 300);
                }
            }
            
            // 处理好感度变化
            if (dialogue.affectionChanges && this.gameState) {
                for (const [characterId, change] of Object.entries(dialogue.affectionChanges)) {
                    if (change > 0 && this.gameState.increaseAffection) {
                        this.gameState.increaseAffection(characterId, change);
                    } else if (change < 0 && this.gameState.decreaseAffection) {
                        this.gameState.decreaseAffection(characterId, Math.abs(change));
                    }
                }
                // 更新好感度显示
                if (typeof this.updateAffectionDisplay === 'function') {
                    this.updateAffectionDisplay();
                }
            }
            
            // 更新角色立绘 - 同时支持character和characterId属性
            if (typeof this.updateCharacter === 'function') {
                const characterId = dialogue.character || dialogue.characterId;
                if (characterId) {
                    this.updateCharacter(characterId, dialogue.position || 'center');
                }
            }
            
            // 更新说话者名称
            let speakerName = dialogue.speaker || '未知';
            let speakerColor = '#ffffff';
            
            // 对于旁白类型的对话，不显示说话者名称
            if (speakerName === '旁白') {
                speakerName = '';
            }
            
            // 尝试从角色数据中查找说话者信息 - 增强安全检查
            try {
                // 确保对话有说话者
                if (dialogue.speaker) {
                    // 检查gameState、gameData和characters是否存在
                    if (this.gameState && this.gameState.gameData) {
                        // 确保characters是数组类型
                        let characters = [];
                        if (Array.isArray(this.gameState.gameData.characters)) {
                            characters = this.gameState.gameData.characters;
                        } else if (typeof this.gameState.gameData.characters === 'object' && this.gameState.gameData.characters !== null) {
                            // 如果是对象而不是数组，尝试转换为数组
                            characters = Object.values(this.gameState.gameData.characters);
                        }
                        
                        // 使用forEach替代find方法以确保兼容性
                        for (let i = 0; i < characters.length; i++) {
                            const c = characters[i];
                            if (c && c.id === dialogue.speaker) {
                                speakerName = c.name || dialogue.speaker || '未知';
                                speakerColor = c.color || '#ffffff';
                                break;
                            }
                        }
                    }
                }
            } catch (findError) {
                console.warn('查找角色信息时出错:', findError);
                // 出错时使用默认值
                speakerName = dialogue.speaker || '系统';
            }
            
            this.elements.speakerName.textContent = speakerName;
            this.elements.speakerName.style.color = speakerColor;
            
            // 显示对话文本
            if (typeof this.typeText === 'function' && dialogue.text) {
                this.typeText(dialogue.text);
            } else if (dialogue.text) {
                // 后备方案：直接设置文本内容
                this.elements.dialogueText.textContent = dialogue.text;
            }
        } catch (error) {
            console.error('显示对话时出错:', error);
            // 显示错误信息给用户
            if (this.elements && this.elements.dialogueText) {
                this.elements.dialogueText.textContent = '显示对话时发生错误';
            }
        }
    }

    // 显示选择
    displayChoice(choice) {
        // 清除角色立绘
        this.elements.charactersContainer.innerHTML = '';
        
        // 更新说话者名称
        this.elements.speakerName.textContent = '选择';
        this.elements.speakerName.style.color = '#ffffff';
        
        // 显示选择文本
        this.elements.dialogueText.textContent = choice.question || choice.text;
        
        // 显示选项按钮
        this.elements.choicesContainer.innerHTML = '';
        choice.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = option.text;
            
            // 添加脉冲效果到按钮
            this.effectManager.pulse(button, 1000 + index * 200);
            
            button.addEventListener('click', () => {
                // 播放点击音效
                try {
                    this.audioManager.playSoundEffect('click');
                } catch (error) {
                    console.warn('无法播放点击音效:', error);
                }
                
                // 添加震动效果到按钮
                this.effectManager.shake(button, 300);
                
                // 处理选项的好感度变化
                if (option.affectionChange) {
                    for (const [characterId, change] of Object.entries(option.affectionChange)) {
                        if (change > 0) {
                            this.gameState.increaseAffection(characterId, change);
                        } else if (change < 0) {
                            this.gameState.decreaseAffection(characterId, Math.abs(change));
                        }
                    }
                    // 更新好感度显示
                    this.updateAffectionDisplay();
                }
                
                this.gameState.currentLineIndex = 0;
                this.loadScene(option.nextScene);
            });
            this.elements.choicesContainer.appendChild(button);
        });
    }

    // 显示结局
    displayEnding(ending) {
        // 记录解锁的结局
        if (ending.id) {
            this.gameState.unlockedEndings.add(ending.id);
        }
        
        // 清除角色立绘
        this.elements.charactersContainer.innerHTML = '';
        
        // 更新说话者名称
        this.elements.speakerName.textContent = '结局';
        this.elements.speakerName.style.color = '#ffffff';
        
        // 创建结局显示容器
        const endingContainer = document.createElement('div');
        endingContainer.style.opacity = '0';
        endingContainer.style.transition = 'opacity 1s ease-in-out';
        
        // 显示结局文本
        this.elements.dialogueText.textContent = ending.text;
        endingContainer.appendChild(this.elements.dialogueText);
        
        // 显示返回主菜单按钮
        this.elements.choicesContainer.innerHTML = '';
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = '返回主菜单';
        button.addEventListener('click', () => {
            // 播放点击音效
            this.audioManager.playSoundEffect('click');
            // 重置游戏并返回初始页面
            this.resetGame();
            // 隐藏游戏UI
            const gameContainer = document.getElementById('game-container');
            const mainMenu = document.getElementById('main-menu');
            if (gameContainer) gameContainer.style.display = 'none';
            if (mainMenu) mainMenu.style.display = 'block';
        });
        this.elements.choicesContainer.appendChild(button);
        
        // 添加淡入效果
        setTimeout(() => {
            endingContainer.style.opacity = '1';
        }, 100);
        
        // 检查成就
        this.checkAchievements();
    }

    // 更新角色立绘
    updateCharacter(characterId, position, expression = 'normal') {
        // 角色ID到文件夹名称的映射表
        const characterFolderMap = {
            'huanshi': 'hs',
            'chengxiang': 'cx',
            'tianhuazhu': 'czb',
            'hesuowu': 'hsw'
        };
        
        // 获取对应的文件夹名称，如果没有映射则使用原ID
        const folderName = characterFolderMap[characterId] || characterId;
        
        // 获取角色数据 - 添加安全检查
        let character = null;
        
        try {
            // 检查必要的对象是否存在
            if (this.gameState && this.gameState.gameData && this.gameState.gameData.characters) {
                let characters = this.gameState.gameData.characters;
                
                // 确保characters是数组类型
                if (!Array.isArray(characters) && typeof characters === 'object') {
                    // 如果是对象，尝试转换为数组
                    characters = Object.values(characters);
                }
                
                // 使用for循环替代find方法以确保兼容性
                for (let i = 0; i < characters.length; i++) {
                    if (characters[i] && characters[i].id === characterId) {
                        character = characters[i];
                        break;
                    }
                }
            }
        } catch (error) {
            console.warn('查找角色时出错:', error);
        }
        
        if (!character) {
            console.error(`角色 ${characterId} 未找到`);
            return;
        }
        
        // 清除现有角色
        this.elements.charactersContainer.innerHTML = '';
        
        // 创建角色图片元素
        const characterImg = document.createElement('img');
        characterImg.className = `character ${position}`;
        
        // 设置角色图片路径 - 使用映射后的文件夹名称
        if (character.expressions && character.expressions[expression]) {
            characterImg.src = `assets/images/characters/${folderName}/${character.expressions[expression]}`;
        } else if (character.defaultImage) {
            characterImg.src = `assets/images/characters/${folderName}/${character.defaultImage}`;
        } else {
            // 根据不同角色目录使用对应的默认图片扩展名
            const defaultExtensions = {
                'cx': 'jpg',
                'hs': 'jpg',
                'czb': 'png',
                'hsw': 'png'
            };
            const extension = defaultExtensions[folderName] || 'png';
            characterImg.src = `assets/images/characters/${folderName}/1.${extension}`;
        }
        
        characterImg.alt = character.name;
        
        this.elements.charactersContainer.appendChild(characterImg);
        
        // 根据位置添加不同的滑入效果
        switch (position) {
            case 'left':
                this.effectManager.slideInLeft(characterImg, 500);
                break;
            case 'right':
                this.effectManager.slideInRight(characterImg, 500);
                break;
            case 'center':
                this.effectManager.zoomIn(characterImg, 500);
                break;
            default:
                this.effectManager.fadeIn(characterImg, 500);
        }
        
        // 简单直接的表情动画
        setTimeout(() => {
            // 先清除所有可能存在的动画类
            characterImg.classList.remove('shake', 'pulse', 'rotate', 'flash', 'zoom-in');
            
            switch (expression) {
                case 'happy':
                    // 高兴时直接添加抖动效果
                    characterImg.classList.add('shake');
                    setTimeout(() => characterImg.classList.remove('shake'), 600);
                    break;
                case 'angry':
                    // 生气时直接添加抖动效果
                    characterImg.classList.add('shake');
                    setTimeout(() => characterImg.classList.remove('shake'), 600);
                    break;
                case 'surprised':
                    // 惊讶时直接添加旋转效果
                    characterImg.classList.add('rotate');
                    setTimeout(() => characterImg.classList.remove('rotate'), 500);
                    break;
                case 'sad':
                    // 悲伤时直接添加脉冲效果
                    characterImg.classList.add('pulse');
                    setTimeout(() => characterImg.classList.remove('pulse'), 1000);
                    break;
                case 'normal':
                default:
                    // 普通表情时50%概率添加效果，提高触发几率
                    if (Math.random() > 0.5) {
                        characterImg.classList.add('pulse');
                        setTimeout(() => characterImg.classList.remove('pulse'), 1000);
                    }
                    break;
            }
        }, 200); // 更早触发动画，不等待滑入效果完全完成
    }

    // 打字机效果显示文本
    typeText(text) {
        // 清除之前可能存在的定时器，防止多个定时器同时运行
        if (this._typeInterval) {
            clearInterval(this._typeInterval);
        }
        
        this.elements.dialogueText.textContent = '';
        let index = 0;
        
        // 使用实例属性存储定时器引用
        this._typeInterval = setInterval(() => {
            if (index < text.length) {
                this.elements.dialogueText.textContent += text[index];
                index++;
            } else {
                clearInterval(this._typeInterval);
                this._typeInterval = null;
            }
        }, 30);
    }

    // 下一行
    nextLine() {
        try {
            // 播放对话切换音效
            if (this.audioManager) {
                try {
                    this.audioManager.playSoundEffect('notification');
                } catch (audioError) {
                    console.warn('播放音效失败，但将继续执行:', audioError);
                }
            }
        
            // 使用对象直接访问，因为scenes是对象而不是数组
            const scene = this.gameState?.gameData?.scenes?.[this.gameState.currentScene];
            if (!scene) {
                console.warn('场景不存在');
                return;
            }
        
            // 支持script和dialogues两种属性名
            const dialogueArray = scene.script || scene.dialogues;
            
            // 如果当前行是选择或结局，不执行任何操作
            if (dialogueArray && Array.isArray(dialogueArray) && dialogueArray[this.gameState.currentLineIndex]) {
                const currentLine = dialogueArray[this.gameState.currentLineIndex];
                if (currentLine && (currentLine.type === 'choice' || currentLine.type === 'ending')) {
                    return;
                }
            }
        
            // 移动到下一行
            this.gameState.currentLineIndex++;
        
            // 检查是否超出场景范围
            if (dialogueArray && Array.isArray(dialogueArray) && this.gameState.currentLineIndex >= dialogueArray.length) {
                // 场景结束，返回主菜单
                this.resetGame();
                // 隐藏游戏UI
                const gameContainer = document.getElementById('game-container');
                const mainMenu = document.getElementById('main-menu');
                if (gameContainer) gameContainer.style.display = 'none';
                if (mainMenu) mainMenu.style.display = 'block';
            } else if (dialogueArray && Array.isArray(dialogueArray)) {
                // 显示下一行
                this.displayCurrentLine();
            } else {
                console.warn('场景脚本不存在或格式错误');
            }
        } catch (error) {
            console.error('处理下一行时出错:', error);
        }
    }

    // 显示菜单
    showMenu() {
        this.elements.menuScreen.style.display = 'flex';
        
        // 添加缩放效果到菜单
        this.effectManager.zoomIn(this.elements.menuScreen, 300);
    }

    // 隐藏菜单
    hideMenu() {
        this.elements.menuScreen.style.display = 'none';
        
        // 添加缩放效果到菜单
        this.effectManager.zoomOut(this.elements.menuScreen, 300);
    }

    // 显示保存界面
    showSaveScreen() {
        this.updateSaveSlots();
        this.elements.saveLoadScreen.style.display = 'flex';
        
        // 添加滑入效果到保存界面
        this.effectManager.slideInRight(this.elements.saveLoadScreen, 500);
    }

    // 显示读取界面
    showLoadScreen() {
        this.updateSaveSlots();
        this.elements.saveLoadScreen.style.display = 'flex';
        
        // 添加滑入效果到加载界面
        this.effectManager.slideInLeft(this.elements.saveLoadScreen, 500);
    }

    // 隐藏保存/读取界面
    hideSaveLoadScreen() {
        this.elements.saveLoadScreen.style.display = 'none';
        
        // 添加滑出效果
        this.effectManager.slideOutRight(this.elements.saveLoadScreen, 300);
        this.effectManager.slideOutLeft(this.elements.saveLoadScreen, 300);
    }

    // 更新保存槽
    updateSaveSlots() {
        this.elements.saveSlots.innerHTML = '';
        
        // 创建5个保存槽
        for (let i = 1; i <= 5; i++) {
            const slot = document.createElement('div');
            slot.className = 'save-slot';
            
            const saveData = this.gameState.saveData[i];
            if (saveData) {
                const date = new Date(saveData.timestamp);
                slot.innerHTML = `
                    <div>保存槽 ${i}</div>
                    <div>场景: ${saveData.scene}</div>
                    <div>时间: ${date.toLocaleString()}</div>
                `;
            } else {
                slot.innerHTML = `<div>保存槽 ${i}</div><div>空</div>`;
            }
            
            slot.addEventListener('click', () => {
                if (this.elements.saveLoadScreen.querySelector('.save-load-title').textContent === '保存游戏') {
                    this.gameState.saveGame(i);
                    this.hideSaveLoadScreen();
                    alert('游戏已保存！');
                } else {
                    if (this.gameState.loadGame(i)) {
                        this.loadScene(this.gameState.currentScene);
                        this.hideSaveLoadScreen();
                    }
                }
            });
            
            this.elements.saveSlots.appendChild(slot);
        }
    }

    // 切换自动播放
    toggleAutoPlay() {
        this.gameState.isAutoPlay = !this.gameState.isAutoPlay;
        
        if (this.gameState.isAutoPlay) {
            this.elements.autoBtn.style.backgroundColor = 'rgba(70, 70, 200, 0.8)';
            this.gameState.autoPlayInterval = setInterval(() => {
                this.nextLine();
            }, 3000);
        } else {
            this.elements.autoBtn.style.backgroundColor = 'rgba(50, 50, 50, 0.7)';
            clearInterval(this.gameState.autoPlayInterval);
        }
    }

    // 跳转到下一个选择点
    skipToNextChoice() {
        try {
            // 使用对象直接访问，因为scenes是对象而不是数组
            const scene = this.gameState?.gameData?.scenes?.[this.gameState.currentScene];
            if (!scene) return;
        
            // 跳过到下一个选择点
            for (let i = this.gameState.currentLineIndex + 1; i < scene.script.length; i++) {
                if (scene.script[i].type === 'choice') {
                    this.gameState.currentLineIndex = i - 1;
                    this.displayCurrentLine();
                    return;
                }
            }
        
            // 如果没有找到选择点，跳到场景末尾
            this.gameState.currentLineIndex = scene.script.length - 1;
            this.displayCurrentLine();
        } catch (error) {
            console.error('跳转到下一个选择时出错:', error);
        }
    }
    
    startGame() {
        try {
            console.log('开始新游戏');
            // 开始新游戏
            this.resetGame();
            
            // 加载开场场景
            this.loadScene('opening');
            
            // 显示游戏UI（这会隐藏标题和主菜单）
            this.showGameUI();
            
            console.log('新游戏启动完成');
        } catch (error) {
            console.error('启动新游戏时出错:', error);
        }
    }
    
    continueGame() {
        // 继续游戏
        const saveData = this.loadSaveData();
        if (saveData && saveData.currentScene) {
            this.loadGameState(saveData);
            this.loadScene(saveData.currentScene);
            // 隐藏标题和菜单按钮
            document.getElementById('game-title').style.display = 'none';
            document.getElementById('menu-buttons').classList.add('game-menu');
            // 显示游戏UI
            this.showGameUI();
        } else {
            alert('没有找到存档数据！');
        }
    }
    
    showOptions() {
        // 显示游戏选项
        alert('游戏选项功能开发中...');
    }
    
    exitGame() {
        // 退出游戏
        if (confirm('确定要退出游戏吗？')) {
            window.close();
        }
    }
    
    resetGame() {
        // 重置游戏状态
        this.currentScene = null;
        this.currentLineIndex = 0;
        this.characterAffection = {};
        this.gameState.choicesMade = 0;
        this.gameState.visitedScenes = new Set();
        this.gameState.unlockedEndings = new Set();
    }
    
    loadGameState(saveData) {
        // 加载游戏状态
        this.currentScene = saveData.currentScene;
        this.currentLineIndex = saveData.currentLineIndex || 0;
        this.characterAffection = saveData.characterAffection || {};
        this.gameState.choicesMade = saveData.choicesMade || 0;
        this.gameState.visitedScenes = new Set(saveData.visitedScenes || []);
        this.gameState.unlockedEndings = new Set(saveData.unlockedEndings || []);
    }
    
    showGameUI() {
        try {
            console.log('显示游戏UI');
            
            // 显示游戏UI元素
            if (this.elements) {
                // 显示对话框元素
                if (this.elements.dialogueText) {
                    this.elements.dialogueText.style.display = 'block';
                }
                if (this.elements.speakerName) {
                    this.elements.speakerName.style.display = 'block';
                }
                if (this.elements.choicesContainer) {
                    this.elements.choicesContainer.style.display = 'block';
                }
            }
            
            // 显示文本框
            const textBox = document.getElementById('text-box');
            if (textBox) {
                textBox.style.display = 'block';
            }
            
            // 显示游戏内按钮
            const gameButtons = document.getElementById('game-buttons');
            if (gameButtons) {
                gameButtons.style.display = 'block';
            }
            
            // 隐藏主菜单按钮
            const menuButtons = document.getElementById('menu-buttons');
            if (menuButtons) {
                menuButtons.style.display = 'none';
            }
            
            // 隐藏游戏标题
            const gameTitle = document.getElementById('game-title');
            if (gameTitle) {
                gameTitle.style.display = 'none';
            }
            
            console.log('游戏UI显示完成');
        } catch (error) {
            console.error('显示游戏UI时出错:', error);
        }
    }
}

// 游戏启动
document.addEventListener('DOMContentLoaded', () => {
    const game = new Galgame();
    
    // 初始化游戏，但不自动加载场景
    game.init();
    
    // 添加菜单界面
    const menuScreen = document.createElement('div');
    menuScreen.id = 'menu-screen';
    menuScreen.innerHTML = `
        <div class="menu-title">游戏菜单</div>
        <div class="menu-options">
            <button class="menu-option" id="resume-btn">继续游戏</button>
            <button class="menu-option" id="save-menu-btn">保存游戏</button>
            <button class="menu-option" id="load-menu-btn">读取游戏</button>
            <button class="menu-option" id="restart-btn">重新开始</button>
            <button class="menu-option" id="quit-btn">退出游戏</button>
        </div>
    `;
    document.body.appendChild(menuScreen);
    
    // 添加保存/读取界面
    const saveLoadScreen = document.createElement('div');
    saveLoadScreen.id = 'save-load-screen';
    saveLoadScreen.innerHTML = `
        <div class="save-load-title">保存游戏</div>
        <div class="save-slots"></div>
        <button class="close-btn">关闭</button>
    `;
    document.body.appendChild(saveLoadScreen);
    
    // 菜单事件
    document.getElementById('resume-btn').addEventListener('click', () => {
        game.hideMenu();
    });
    
    document.getElementById('save-menu-btn').addEventListener('click', () => {
        game.hideMenu();
        saveLoadScreen.querySelector('.save-load-title').textContent = '保存游戏';
        game.showSaveScreen();
    });
    
    document.getElementById('load-menu-btn').addEventListener('click', () => {
        game.hideMenu();
        saveLoadScreen.querySelector('.save-load-title').textContent = '读取游戏';
        game.showLoadScreen();
    });
    
    document.getElementById('restart-btn').addEventListener('click', () => {
        game.startGame(); // 使用startGame方法重启游戏
        game.hideMenu();
    });
    
    document.getElementById('quit-btn').addEventListener('click', () => {
        if (confirm('确定要退出游戏吗？')) {
            window.close();
        }
    });
    
    // 关闭保存/读取界面
    document.querySelector('.close-btn').addEventListener('click', () => {
        game.hideSaveLoadScreen();
    });
    
    // 添加其他按钮事件监听器
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            game.continueGame();
        });
    }
    
    const optionsBtn = document.getElementById('options-btn');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            game.showOptions();
        });
    }
    
    const loadBtn = document.getElementById('load-btn');
    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            game.showLoadScreen();
        });
    }
    
    const exitBtn = document.getElementById('exit-btn');
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            game.exitGame();
        });
    }
});
