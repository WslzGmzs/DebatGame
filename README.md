# Gemini AI 辩论游戏 - Deno Deploy版本

## 🚀 部署说明

这是一个基于React的AI辩论游戏，支持多个AI提供商（Google Gemini、OpenAI、自定义代理）。

### 功能特性
- 🤖 AI vs AI 辩论模式
- 👤 人机对战模式
- ☁️ 云端-本地分离配置
- 🔄 流式响应支持
- 📊 辩论历史记录

### 部署到Deno Deploy

1. 将此目录上传到GitHub仓库
2. 在Deno Deploy中连接GitHub仓库
3. 设置入口点为 `main.ts`
4. 部署完成！

### 环境变量配置（可选）
- `PORT`: 服务器端口（默认8000）
- `SYSTEM_API_KEY`: 系统级API密钥
- `ADMIN_PASSWORD`: 管理员密码

### 配置管理
- 云端配置：`dist/config/cloud-config.json`
- 用户配置：浏览器localStorage

## 📞 技术支持
如有问题，请检查浏览器控制台和Deno Deploy日志。
