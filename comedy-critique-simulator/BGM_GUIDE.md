# BGM 音频文件说明

## 📁 文件位置
将你的背景音乐文件放在 `public/` 目录下：

```
comedy-critique-simulator/
├── public/
│   ├── bgm.mp3    ← 主音频文件（推荐 MP3 格式）
│   └── bgm.ogg    ← 备用音频文件（可选，OGG 格式）
└── ...
```

## 🎵 支持的格式
- **MP3** (推荐) - 兼容性最好
- **OGG** (可选) - 作为备用格式
- **WAV** (可选) - 文件较大，不推荐用于网页

## 📝 音频文件要求
1. **文件名**：必须命名为 `bgm.mp3` (或 `bgm.ogg`)
2. **大小**：建议 < 5MB，以保证加载速度
3. **时长**：建议 1-3 分钟，会自动循环播放
4. **音质**：128-192kbps 已足够（无需太高音质）

## 🔧 如何更换音乐
1. 准备你的音频文件
2. 重命名为 `bgm.mp3`
3. 放入 `public/` 文件夹
4. 重新构建项目：`npm run build`
5. 部署

## 💡 推荐音乐风格
根据"癫狂喜剧"主题，推荐：
- 🎪 马戏团风格音乐
- 🎺 欢快爵士乐
- 🎹 魔性电音
- 🥁 节奏感强烈的 Funk 音乐
- 🎸 搞笑背景音乐

## 🎛️ 调整音量
在 `App.tsx` 中找到：
```tsx
<BGMPlayer isPlaying={isPlayingMusic} volume={0.25} />
```
修改 `volume` 值（0.0 - 1.0）来调整音量。

## 🔍 示例音频资源网站
- [Pixabay Music](https://pixabay.com/music/) - 免费无版权
- [Freesound](https://freesound.org/) - 创意共享音频
- [YouTube Audio Library](https://www.youtube.com/audiolibrary) - YouTube 音频库
- [Incompetech](https://incompetech.com/) - Kevin MacLeod 免费音乐

## ⚠️ 注意事项
1. 确保音频文件有合法使用权
2. 首次播放需要用户交互（浏览器限制）
3. 音频会自动循环播放
4. 用户可随时通过左上角音乐按钮开关BGM
