<p align="center">
  <h1 align="center">🔨 canvas-forge</h1>
  <p align="center">A high-performance, Discord-focused canvas library with zero system dependencies.</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/canvas-forge"><img src="https://img.shields.io/npm/v/canvas-forge.svg?style=flat-square&color=e94560" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/canvas-forge"><img src="https://img.shields.io/npm/dm/canvas-forge.svg?style=flat-square&color=0f3460" alt="npm downloads" /></a>
  <a href="https://github.com/jersuxsss/canvas-forge/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/canvas-forge.svg?style=flat-square&color=16213e" alt="license" /></a>
  <a href="https://github.com/jersuxsss/canvas-forge/actions"><img src="https://img.shields.io/github/actions/workflow/status/jersuxsss/canvas-forge/ci.yml?style=flat-square&label=tests" alt="build status" /></a>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **9 Built-in Card Builders** | Welcome, Leave, Rank, Level-Up, Profile, Boost, Info, Leaderboard & Spotify cards |
| 🛠️ **Custom Canvas Builder** | Full creative freedom for your own designs with 20+ drawing methods |
| ⚡ **High Performance** | Powered by Skia engine via `@napi-rs/canvas` |
| 📦 **Zero System Dependencies** | No Cairo, no Pango, no `node-gyp` — just `npm install` |
| 🔷 **TypeScript First** | Full type definitions and IntelliSense support |
| 🎯 **Discord Focused** | Designed specifically for Discord bots and servers |
| 🔗 **Fluent API** | Beautiful, chainable builder pattern |
| 📱 **Dual Module Support** | Works with both ESM and CommonJS |

## 📦 Installation

```bash
# npm
npm install canvas-forge

# yarn
yarn add canvas-forge

# pnpm
pnpm add canvas-forge
```

## 🚀 Quick Start

### Welcome Card

```typescript
import { WelcomeCardBuilder } from 'canvas-forge';
import { AttachmentBuilder } from 'discord.js';

// Inside your guildMemberAdd event handler:
const card = await new WelcomeCardBuilder()
  .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(member.user.username)
  .setGuildName(member.guild.name)
  .setMemberCount(member.guild.memberCount)
  .setTitleText('Welcome!')
  .setSubtitleText('You are member #{memberCount}')
  .setBackground('#1a1a2e')
  .setAvatarBorder('#e94560')
  .build();

const attachment = new AttachmentBuilder(card, { name: 'welcome.png' });
channel.send({ files: [attachment] });
```

### Rank Card

```typescript
import { RankCardBuilder } from 'canvas-forge';

const card = await new RankCardBuilder()
  .setAvatar(user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(user.username)
  .setLevel(15)
  .setCurrentXP(2500)
  .setRequiredXP(5000)
  .setRank(3)
  .setStatus('online')
  .setProgressBarColor('#e94560')
  .build();
```

### Level Up Card

```typescript
import { LevelUpCardBuilder } from 'canvas-forge';

const card = await new LevelUpCardBuilder()
  .setAvatar(user.displayAvatarURL({ extension: 'png', size: 256 }))
  .setUsername(user.username)
  .setLevel(10)
  .setTitleText('Level Up!')
  .build();
```

### Profile Card

```typescript
import { ProfileCardBuilder } from 'canvas-forge';

const card = await new ProfileCardBuilder()
  .setAvatar(user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(user.username)
  .setDisplayName(member.nickname ?? user.globalName ?? user.username)
  .setBio('Hello! I love coding bots.')
  .setLevel(25)
  .setCurrentXP(7500)
  .setRequiredXP(10000)
  .setRank(5)
  .setReputation(420)
  .setStatus('online')
  .setAccentColor('#e94560')
  .build();
```

### Boost Card ✨ NEW

```typescript
import { BoostCardBuilder } from 'canvas-forge';

const card = await new BoostCardBuilder()
  .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(member.user.username)
  .setGuildName(member.guild.name)
  .setBoostCount(15)
  .setAccentColor('#f47fff')
  .build();
```

### Info Card ✨ NEW

```typescript
import { InfoCardBuilder } from 'canvas-forge';

const card = await new InfoCardBuilder()
  .setTitle('Server Rules')
  .setDescription('Please follow these rules to keep the server friendly.')
  .addField({ name: 'Rule 1', value: 'Be respectful' })
  .addField({ name: 'Rule 2', value: 'No spam' })
  .addField({ name: 'Members', value: '1,500', inline: true })
  .addField({ name: 'Online', value: '320', inline: true })
  .setFooter('Last updated: May 2026')
  .setAccentColor('#5865F2')
  .build();
```

### Leaderboard Card ✨ NEW

```typescript
import { LeaderboardCardBuilder } from 'canvas-forge';

const card = await new LeaderboardCardBuilder()
  .setTitle('🏆 XP Leaderboard')
  .addEntry({ rank: 1, username: 'Jersuxs', score: 25400 })
  .addEntry({ rank: 2, username: 'Alice', score: 19200 })
  .addEntry({ rank: 3, username: 'Bob', score: 15800 })
  .setScoreLabel('XP')
  .build();
```

### Spotify / Now Playing Card ✨ NEW

```typescript
import { SpotifyCardBuilder } from 'canvas-forge';

const card = await new SpotifyCardBuilder()
  .setSongTitle('Blinding Lights')
  .setArtist('The Weeknd')
  .setAlbum('After Hours')
  .setAlbumArt('https://example.com/cover.jpg')
  .setElapsed(90000)
  .setDuration(200000)
  .setIsPlaying(true)
  .setProgressBarColor('#1DB954')
  .build();
```

### Custom Canvas

```typescript
import { CanvasBuilder } from 'canvas-forge';

const buffer = new CanvasBuilder(800, 400)
  .setBackground('#1a1a2e')
  .drawShadow()
  .drawGradientRect(20, 20, 760, 360, { colors: ['#e94560', '#0f3460'] }, 15)
  .clearShadow()
  .drawLine(40, 200, 760, 200, '#ffffff', 1)
  .setFont(32, 'sans-serif', 'bold')
  .drawText('My Custom Card', 400, 60, '#e94560', 'center')
  .drawPolygon([[400, 100], [500, 180], [400, 260], [300, 180]], '#5865F2')
  .drawProgressBar(50, 300, 700, 30, 0.75, '#e94560', '#2a2a3e')
  .toBuffer();
```

## 🎨 Themes

All card builders support built-in themes:

```typescript
// Dark theme (default)
builder.setTheme('dark');

// Light theme
builder.setTheme('light');

// Custom (configure your own colors)
builder.setTheme('custom');
```

## 🖼️ Background Options

```typescript
// Solid color
builder.setBackground('#1a1a2e');

// Gradient
builder.setBackgroundGradient({
  colors: ['#e94560', '#0f3460'],
  direction: 'horizontal', // 'horizontal' | 'vertical' | 'diagonal' | 'radial'
});

// Image (URL, file path, or Buffer)
builder.setBackgroundImage('https://example.com/background.png');

// Add an overlay on top (useful for darkening background images)
builder.setOverlay('#000000', 0.5);
```

## 📐 Custom Fonts

```typescript
builder.registerFont('./fonts/Montserrat-Bold.ttf', 'Montserrat');
```

## 📤 Output Formats

```typescript
// PNG (default, best quality)
builder.setOutputFormat('png');

// JPEG (smaller file size)
builder.setOutputFormat('jpeg');
builder.setQuality(90); // 1-100

// WebP (modern, small & high quality)
builder.setOutputFormat('webp');
builder.setQuality(85);
```

## 🔧 Utility Functions

canvas-forge exports many utility functions you can use in your own code:

```typescript
import {
  // Color utilities
  resolveColor, hexToRgba, rgbaToHex, darken, lighten, withOpacity, isHexColor,

  // Text utilities
  formatNumber, formatRank, buildFontString,

  // Shape utilities (for use with CanvasBuilder.getContext())
  drawRoundedRect, drawCircle, drawProgressBar, drawCircularProgress,

  // Constants
  DiscordColors, StatusColors, DefaultDimensions,

  // Image loading
  loadImage, tryLoadImage,
} from 'canvas-forge';
```

## 📋 API Reference

See the full [API Reference](./docs/api-reference.md) for detailed documentation of every class, method, and type.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/canvas-forge)
- [GitHub Repository](https://github.com/jersuxsss/canvas-forge)
- [Issue Tracker](https://github.com/jersuxsss/canvas-forge/issues)
- [Changelog](./CHANGELOG.md)
