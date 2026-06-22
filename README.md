# PJSK 大门升级材料管理器

纯前端 Next.js 应用，用于管理《Project Sekai》五团大门升级材料。

## 开发

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

## 测试

```bash
npm test
npx playwright test
```

## 构建

```bash
npm run build
```

产物输出到 `dist/`，可直接部署到 Cloudflare Pages。

## 数据说明

- 等级范围 1–40
- 第 N 行材料 = 从 (N-1) 级升级到 N 级所需
- 数据保存于浏览器 localStorage，支持导出/导入 JSON

## 五团

- Leo/need
- MORE MORE JUMP!
- Vivid BAD SQUAD
- Wonderlands×Showtime
- 25点，Nightcord见。

## 版权声明

本项目为玩家自制的非官方工具，与 SEGA、Colorful Palette、Crypton Future Media 等官方无关。
游戏名称、角色、素材版权归各自权利人所有，仅供个人学习与交流使用。
