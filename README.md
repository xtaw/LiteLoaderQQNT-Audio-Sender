一个用于直接以语音形式发送音频文件的插件

用法：
1. 点击信息栏上方的语音图标，切换到发送语音界面
2. 直接将音频文件拖入聊天窗口即可

依赖：
1. 安装 [LLAPI v1.3.1.1及以上版本](https://github.com/Night-stars-1/LiteLoaderQQNT-Plugin-LLAPI) 插件，但请不要使用v1.3.1.2版本，会导致发出噪声
2. 将 [ffmpeg (包括 ffprobe)](https://ffmpeg.org) 添加至环境变量

注意：由于 LLAPI 现在不再维护，最新版存在bug，没有处理 onAddSendMsg 事件，导致发送信息回调失败，.silk文件无法自动删除

两种解决方法：
1. 降级 LLAPI 到 v1.3.1.1 版本
2. 或者手动对 LLAPI 进行修复，在 `src\main.js` 中 `// 发送消息成功` 下方加上一行 `window.webContents.send('new-send-message-main', args);`