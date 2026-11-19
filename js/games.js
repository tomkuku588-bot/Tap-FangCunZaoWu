/* ============================================================
 * 方寸造物 · 站点数据配置
 * ------------------------------------------------------------
 * 未来上架新游戏：
 *   1. 在 games 数组中追加一条游戏数据（字段见下方首作示例）
 *   2. 将素材放入 assets/img/（KV、图标、截图）与 assets/video/
 *   3. git push —— GitHub Actions 自动发布，无需改任何页面代码
 * 游戏正式上线后：把 status 改为 'released'，填入真实 taptapUrl 即可。
 * ============================================================ */
window.SITE_DATA = {
  studio: {
    name: '方寸造物',
    en: 'FANGCUN ZAOWU',
    slogan: '方寸之间 · 造物无穷',
    intro: '方寸造物制作休闲游戏。我们相信，一方小小的屏幕，也能装下温暖与匠心。从一双踩过泥的小白鞋开始，我们把生活里那些微小而确定的治愈瞬间，做成可以上手把玩的作品。',
    taptapUrl: 'https://www.taptap.cn/search/%E6%96%B9%E5%AF%B8%E9%9E%8B%E5%8C%A0%E9%93%BA'
  },

  games: [
    {
      id: 'fangcun-shoe-shop',
      title: '方寸鞋匠铺',
      en: 'FANGCUN SHOE SHOP',
      status: 'coming-soon',            // coming-soon | released
      statusText: '即将上线 TapTap',
      tagline: '刷掉鞋尖的泥，开一间街角修鞋铺',
      tags: ['休闲', '解压', '经营', 'H5'],
      kv: 'assets/img/game-kv.webp',
      icon: 'assets/img/game-icon.png',
      intro: [
        '雨天踩脏的小白鞋、洒了咖啡的乐福鞋、鞋底开胶的小皮鞋，陆续被送到你的柜台上。先看看鞋况，再决定用刷子、泡沫，还是胶水。',
        '在鞋面上来回刷洗，按住泡沫处理顽渍。遇到鞋底开胶，就逐处补好开口。碰到磨旧的鞋带，还得按顺序穿过鞋眼。交鞋时可以并排看清洁前后的变化，再看看顾客怎么评价。',
        '店里有 12 张委托单，每张有自己的鞋况和交付要求。用首通赚来的金币升级软毛刷，下一单就能刷到更大的范围。也可以添一盆绿植，在大厅里给它留个位置。'
      ],
      devWords: [
        '这个游戏是从一双踩过泥的小白鞋做起的。最先调的是鞋尖那块泥，希望刷子一过去，就能看见刚才刷过哪儿。后来加了补鞋底和换鞋带。胶水得点在开口上，鞋带得一道一道穿，做完交还给客人，才算这单收了尾。',
        '如果有哪双鞋想再洗一次，或者哪件工具用起来不顺手，欢迎在评论里告诉我。'
      ],
      features: [
        { icon: 'brush',  title: '刷洗去污', desc: '沿污渍来回拖动，刷过之处即时焕新，手感跟手，10 秒上手。' },
        { icon: 'foam',   title: '泡沫顽渍', desc: '长按敷上清洁泡沫，看泥点咖啡渍慢慢溶解，解压十足。' },
        { icon: 'repair', title: '修补鞋底', desc: '找到开胶的开口，逐处点胶补好，让旧鞋重新踏实落地。' },
        { icon: 'lace',   title: '更换鞋带', desc: '按顺序穿过一个个鞋眼，一道一道，把磨旧的鞋带换新。' }
      ],
      screens: [
        { src: 'assets/img/screens/03-foam-workbench.webp', caption: '清洁工作台 · 泡沫去污' },
        { src: 'assets/img/screens/04-order-result.webp',   caption: '交付对比 · 焕然一新' },
        { src: 'assets/img/screens/06-sole-repair.webp',    caption: '修补鞋底 · 逐处点胶' },
        { src: 'assets/img/screens/07-shoelace.webp',       caption: '更换鞋带 · 按序穿眼' },
        { src: 'assets/img/screens/01-order-hall.webp',     caption: '订单大厅 · 街坊委托' }
      ],
      video: 'assets/video/gameplay-portrait.mp4',
      videoPoster: 'assets/img/screens/03-foam-workbench.webp',
      playUrl: 'play/fangcun-shoe-shop/',
      taptapUrl: 'https://www.taptap.cn/search/%E6%96%B9%E5%AF%B8%E9%9E%8B%E5%8C%A0%E9%93%BA',
      stats: [
        { n: 12, label: '委托订单' },
        { n: 16, label: '街坊顾客' },
        { n: 18, label: '护理工具' },
        { n: 4,  label: '护理工序' }
      ]
    }
    // ← 新游戏追加在这里
  ]
};