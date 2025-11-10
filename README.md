# Galgame项目

这是一个简单的Galgame项目，使用HTML、CSS和JavaScript构建。

## 项目结构

```
galgame/
├── index.html          # 主页面
├── server.js           # 本地服务器
├── package.json        # 项目配置
├── styles/             # CSS样式
│   └── main.css        # 主样式文件
├── scripts/            # JavaScript脚本
│   └── game.js         # 游戏逻辑
├── assets/             # 游戏资源
│   ├── images/         # 图片资源
│   │   ├── characters/ # 角色立绘
│   │   └── backgrounds/ # 背景图片
│   ├── audio/          # 音频资源
│   │   ├── music/      # 背景音乐
│   │   └── sounds/     # 音效
│   └── data/           # 游戏数据
│       └── script.json # 剧本数据
└── README.md           # 项目说明
```

## 运行项目

1. 安装依赖：
   ```
   npm install
   ```

2. 启动服务器：
   ```
   npm start
   ```

3. 在浏览器中访问：
   ```
   http://localhost:3000
   ```

## 自定义内容

- 修改 `assets/data/script.json` 来编辑游戏剧本
- 替换 `assets/images/` 中的图片来自定义视觉资源
- 替换 `assets/audio/` 中的音频来自定义音效和背景音乐