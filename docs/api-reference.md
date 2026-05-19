# API Reference

Complete API documentation for canvas-forge.

## Table of Contents

- [Card Builders](#card-builders)
  - [WelcomeCardBuilder](#welcomecardbuilder)
  - [LeaveCardBuilder](#leavecardbuilder)
  - [RankCardBuilder](#rankcardbuilder)
  - [LevelUpCardBuilder](#levelupcardbuilder)
  - [ProfileCardBuilder](#profilecardbuilder)
  - [BoostCardBuilder](#boostcardbuilder)
  - [InfoCardBuilder](#infocardbuilder)
  - [LeaderboardCardBuilder](#leaderboardcardbuilder)
  - [SpotifyCardBuilder](#spotifycardbuilder)
  - [ModerationCardBuilder](#moderationcardbuilder)
  - [ServerStatsCardBuilder](#serverstatscardbuilder)
- [CanvasBuilder](#canvasbuilder)
- [Utilities](#utilities)
- [Types](#types)

---

## Card Builders

All card builders extend `BaseCanvas` and share these common methods:

| Method | Description |
|---|---|
| `setSize(width, height)` | Set canvas dimensions |
| `setBackground(color)` | Set solid background color |
| `setBackgroundGradient(gradient)` | Set gradient background |
| `setBackgroundImage(image)` | Set image background |
| `setOverlay(color, opacity)` | Apply overlay on top of background |
| `setOutputFormat(format)` | Output format: `'png'`, `'jpeg'`, `'webp'` |
| `setQuality(quality)` | JPEG/WebP quality (1-100) |
| `registerFont(path, name)` | Register a custom font file |
| `build()` | Build and return the card as a Buffer |

### WelcomeCardBuilder

See [Welcome Card docs](./cards/welcome-card.md).

### LeaveCardBuilder

See [Leave Card docs](./cards/leave-card.md).

### RankCardBuilder

See [Rank Card docs](./cards/rank-card.md).

### LevelUpCardBuilder

See [Level Up Card docs](./cards/level-up-card.md).

### ProfileCardBuilder

See [Profile Card docs](./cards/profile-card.md).

### BoostCardBuilder

See [Boost Card docs](./cards/boost-card.md). Server boost notification cards with Nitro-themed gradients.

### InfoCardBuilder

See [Info Card docs](./cards/info-card.md). General-purpose info cards with title, description, fields, and footer.

### LeaderboardCardBuilder

See [Leaderboard Card docs](./cards/leaderboard-card.md). Ranked leaderboard cards with medals, avatars, and scores.

### SpotifyCardBuilder

See [Spotify Card docs](./cards/spotify-card.md). Music "Now Playing" cards with album art, progress bar, and timestamps.

### ModerationCardBuilder

See [Moderation Card docs](./cards/moderation-card.md). Log/announcement cards for bans, kicks, mutes, etc.

### ServerStatsCardBuilder

See [Server Stats Card docs](./cards/server-stats-card.md). Grid-based server metric display cards.

---

## CanvasBuilder

A freeform canvas builder for creating completely custom designs. Wraps `@napi-rs/canvas` with a friendlier, chainable API.

### Constructor

```typescript
new CanvasBuilder(width: number, height: number)
```

### Properties

| Property | Type | Description |
|---|---|---|
| `width` | `number` | Canvas width |
| `height` | `number` | Canvas height |

### Background Methods

| Method | Description |
|---|---|
| `setBackground(color)` | Fill canvas with solid color |
| `setBackgroundGradient(gradient)` | Fill canvas with gradient |
| `setBackgroundImage(source)` | Draw background image (async) |

### Drawing Methods

| Method | Description |
|---|---|
| `drawRect(x, y, w, h, color, radius?)` | Draw filled rectangle (optionally rounded) |
| `drawCircleShape(x, y, radius, color)` | Draw filled circle |
| `drawImage(source, x, y, w?, h?)` | Draw image (async) |
| `drawCircularImage(source, x, y, size)` | Draw circular-clipped image (async) |
| `drawLine(x1, y1, x2, y2, color, lineWidth?)` | Draw straight line |
| `drawPolygon(points, color, stroke?, strokeWidth?)` | Draw filled polygon |
| `drawGradientRect(x, y, w, h, gradient, radius?)` | Draw gradient-filled rectangle |
| `drawBorderedRect(x, y, w, h, color, lineWidth?, radius?)` | Draw bordered rectangle (stroke only) |
| `drawArc(x, y, radius, startAngle, endAngle, color, lineWidth?)` | Draw arc / partial circle |
| `drawProgressBar(x, y, w, h, progress, fill, track, radius?)` | Draw progress bar |
| `pixelate(x, y, w, h, pixelSize?)` | Pixelate region |

### Text Methods

| Method | Description |
|---|---|
| `setFont(size, family?, weight?)` | Set current font |
| `drawText(text, x, y, color, align?)` | Draw text |
| `drawWrappedText(text, x, y, color, maxWidth, lineHeight?)` | Draw wrapped text |
| `drawTextWithEmojis(text, x, y, color, align?, emojiSize?)` | Draw text with Discord custom emojis inline (async) |

### State & Filter Methods

| Method | Description |
|---|---|
| `drawShadow(color?, blur?, offsetX?, offsetY?)` | Enable shadow |
| `clearShadow()` | Disable shadow |
| `setGlobalAlpha(alpha)` | Set global transparency (0.0-1.0) |
| `resetGlobalAlpha()` | Reset transparency to 1.0 |
| `setFilter(filterString)` | Set canvas filter string |
| `clearFilter()` | Clear canvas filters |
| `applyBlur(pixels)` | Apply CSS blur filter |
| `applyGrayscale(percent)` | Apply CSS grayscale filter |
| `applySepia(percent)` | Apply CSS sepia filter |
| `applyInvert(percent)` | Apply CSS invert filter |
| `save()` | Save canvas state |
| `restore()` | Restore canvas state |

### Output Methods

| Method | Description |
|---|---|
| `setOutputFormat(format)` | Set output format |
| `setOutputQuality(quality)` | Set JPEG/WebP quality |
| `toBuffer()` | Encode and return Buffer |
| `getContext()` | Get raw 2D context |
| `registerFont(path, name)` | Register custom font |

---

## Utilities

### Color Utilities

```typescript
import { resolveColor, hexToRgba, rgbaToHex, darken, lighten, withOpacity, isHexColor } from 'canvas-forge';
```

| Function | Description |
|---|---|
| `resolveColor(color)` | Convert ColorResolvable to CSS string |
| `hexToRgba(hex)` | Parse hex to RGBA object |
| `rgbaToHex(r, g, b, a?)` | Convert RGBA to hex string |
| `darken(color, amount)` | Darken a color by percentage |
| `lighten(color, amount)` | Lighten a color by percentage |
| `withOpacity(color, opacity)` | Apply opacity to a color |
| `isHexColor(string)` | Check if string is valid hex color |

### Text Utilities

```typescript
import { formatNumber, formatRank, buildFontString, wrapText, truncateText, measureText } from 'canvas-forge';
```

| Function | Description |
|---|---|
| `formatNumber(num)` | Format number (1500 → '1.5K') |
| `formatRank(num, prefix?)` | Format rank ('#3') |
| `buildFontString(size, family?, weight?)` | Build CSS font string |
| `wrapText(ctx, text, maxWidth)` | Wrap text into lines |
| `truncateText(ctx, text, maxWidth, suffix?)` | Truncate with ellipsis |
| `measureText(ctx, text)` | Measure text dimensions |

### Shape Utilities

```typescript
import { drawRoundedRect, drawCircle, drawProgressBar, drawCircularProgress } from 'canvas-forge';
```

### Constants

```typescript
import { DiscordColors, StatusColors, DefaultDimensions } from 'canvas-forge';
```

---

## Types

### Core Types

| Type | Description |
|---|---|
| `ColorResolvable` | `string \| [r, g, b] \| [r, g, b, a]` |
| `ImageResolvable` | `string \| Buffer \| URL` |
| `ThemeMode` | `'dark' \| 'light' \| 'custom'` |
| `StatusType` | `'online' \| 'idle' \| 'dnd' \| 'offline' \| 'streaming'` |
| `OutputFormat` | `'png' \| 'jpeg' \| 'webp'` |
| `GradientData` | `{ colors: ColorResolvable[], direction?: GradientDirection }` |
| `GradientDirection` | `'horizontal' \| 'vertical' \| 'diagonal' \| 'radial'` |

### Card Config Types

| Type | Description |
|---|---|
| `BaseCardConfig` | Base configuration shared by all cards |
| `WelcomeCardConfig` | Welcome card configuration |
| `LeaveCardConfig` | Leave card configuration |
| `RankCardConfig` | Rank card configuration |
| `LevelUpCardConfig` | Level-up card configuration |
| `ProfileCardConfig` | Profile card configuration |
| `BoostCardConfig` | Boost card configuration |
| `InfoCardConfig` | Info card configuration |
| `InfoFieldData` | Info card field `{ name, value, inline? }` |
| `LeaderboardCardConfig` | Leaderboard card configuration |
| `LeaderboardEntry` | Leaderboard entry `{ rank, username, score, avatar? }` |
| `SpotifyCardConfig` | Spotify card configuration |
| `BadgeData` | Profile badge `{ icon, label }` |
| `ModerationCardConfig` | Moderation card configuration |
| `ModerationAction` | `'ban' \| 'kick' \| 'mute' \| 'warn' \| 'unban' \| 'unmute'` |
| `ServerStatsCardConfig` | Server stats card configuration |
