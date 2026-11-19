# 方寸造物 FANGCUN ZAOWU · 厂商官网

新中式黑金 × 现代科技风格的独立游戏工作室官网。纯静态、零构建，推送即自动部署。

**线上地址**：https://tomkuku588-bot.github.io/Tap-FangCunZaoWu/

## 本地预览

```bash
python3 -m http.server 8080
# 打开 http://localhost:8080
```

> 需通过 HTTP 服务访问（在线试玩 iframe 与路由在 file:// 下受限）。

## 目录结构

```
├── index.html            # 主站（首页 + 游戏详情 hash 路由）
├── css/main.css          # 设计系统（黑金主题 / 响应式 / 动效降级）
├── js/games.js           # ★ 站点数据配置（工作室 + 游戏列表）
├── js/main.js            # 交互引擎（GSAP + Lenis，CDN 失败自动降级）
├── assets/img/           # 品牌视觉、游戏 KV、截图、favicon（WebP 优先）
├── assets/video/         # 实机游玩录屏
├── play/fangcun-shoe-shop/  # 《方寸鞋匠铺》H5 在线试玩包（v3.5.2）
└── .github/workflows/deploy.yml  # GitHub Pages 自动部署
```

## ★ 未来上架新游戏（三步）

1. **加数据**：在 `js/games.js` 的 `games` 数组追加一条，字段参照首作：
   `id / title / en / status / statusText / tagline / tags / kv / icon / intro / devWords / features / screens / video / videoPoster / playUrl / taptapUrl / stats`
2. **放素材**：KV 与截图进 `assets/img/`，录屏进 `assets/video/`，H5 试玩包解压进 `play/<id>/`
3. **推送**：`git push` —— Actions 自动发布，作品矩阵、详情路由、试玩入口全部自动生成

游戏正式上线后：把 `status` 改为 `'released'`、`taptapUrl` 换成真实商店链接即可，全站徽章与 CTA 自动更新。

## 技术要点

- 原生 HTML/CSS/JS，无框架无构建；GSAP ScrollTrigger + Lenis 走 jsDelivr（cdnjs 兜底，均失败时内容完整可见）
- 字体：Noto Serif SC / Noto Sans SC / Cinzel（自托管镜像，系统字体兜底）
- 交互动画：粒子星尘、逐字标题、滚动叙事、磁吸按钮、3D 卡片、自定义光标、灯箱画廊、手机框试玩
- `prefers-reduced-motion` 全量降级；触屏自动关闭光标/倾斜；移动端全屏抽屉菜单
- SEO：OG / Twitter Card / JSON-LD / favicon 全套

## 素材来源

- 品牌 Logo 与黑金主视觉：方寸造物品牌资产
- 游戏截图 / 录屏 / 文案：《方寸鞋匠铺》v3.5.2 TapTap 提审物料（`store_materials/taptap/`）
- 在线试玩包：`fangcun-shoe-shop-3.5.2-taptap-h5-web.zip` 原样解压