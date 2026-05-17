# API Reference

Complete API reference for canvas-forge.

---

## Card Builders

### WelcomeCardBuilder

Creates welcome cards for new Discord server members.

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `setAvatar()` | `source: ImageResolvable` | `this` | Set the user's avatar image |
| `setAvatarSize()` | `size: number` | `this` | Set avatar diameter in pixels |
| `setAvatarBorder()` | `color: ColorResolvable` | `this` | Set avatar border color |
| `setAvatarBorderWidth()` | `width: number` | `this` | Set avatar border width in pixels |
| `setUsername()` | `username: string` | `this` | Set the username text |
| `setDiscriminator()` | `discriminator: string` | `this` | Set the discriminator (e.g., '0001') |
| `setGuildName()` | `name: string` | `this` | Set the server name |
| `setMemberCount()` | `count: number` | `this` | Set the member count |
| `setTitleText()` | `text: string` | `this` | Set the title (e.g., 'Welcome!') |
| `setSubtitleText()` | `text: string` | `this` | Set subtitle (use `{memberCount}` placeholder) |
| `setTitleColor()` | `color: ColorResolvable` | `this` | Set title text color |
| `setSubtitleColor()` | `color: ColorResolvable` | `this` | Set subtitle text color |
| `setUsernameColor()` | `color: ColorResolvable` | `this` | Set username text color |
| `setTheme()` | `theme: ThemeMode` | `this` | Set color theme ('dark', 'light', 'custom') |
| `setBackground()` | `color: ColorResolvable` | `this` | Set solid background color |
| `setBackgroundGradient()` | `gradient: GradientData` | `this` | Set gradient background |
| `setBackgroundImage()` | `image: ImageResolvable` | `this` | Set background image |
| `setOverlay()` | `color, opacity` | `this` | Add overlay on top of background |
| `setSize()` | `width, height` | `this` | Set canvas dimensions |
| `setOutputFormat()` | `format: OutputFormat` | `this` | Set output format (png, jpeg, webp) |
| `setQuality()` | `quality: number` | `this` | Set JPEG/WebP quality (1-100) |
| `registerFont()` | `path, nameAlias` | `this` | Register a custom font |
| `build()` | — | `Promise<Buffer>` | Build and return the image buffer |

### LeaveCardBuilder

Same API as WelcomeCardBuilder but with leave-themed defaults. Does not include `setMemberCount()`.

### RankCardBuilder

Creates XP/rank cards with progress bars.

| Method | Parameters | Returns | Description |
|---|---|---|---|
| *All avatar methods from WelcomeCardBuilder* | | | |
| `setUsername()` | `username: string` | `this` | Set username |
| `setLevel()` | `level: number` | `this` | Set current level |
| `setCurrentXP()` | `xp: number` | `this` | Set current XP amount |
| `setRequiredXP()` | `xp: number` | `this` | Set XP for next level |
| `setRank()` | `rank: number` | `this` | Set leaderboard rank |
| `setProgressBarColor()` | `color: ColorResolvable` | `this` | Set progress bar fill color |
| `setProgressBarTrackColor()` | `color: ColorResolvable` | `this` | Set progress bar track color |
| `setProgressBarHeight()` | `height: number` | `this` | Set progress bar height |
| `setStatus()` | `status: StatusType` | `this` | Set status indicator |
| `setStatusColor()` | `color: ColorResolvable` | `this` | Override status color |
| `setLevelColor()` | `color: ColorResolvable` | `this` | Set level text color |
| `setXPColor()` | `color: ColorResolvable` | `this` | Set XP text color |
| `setRankColor()` | `color: ColorResolvable` | `this` | Set rank text color |

### LevelUpCardBuilder

Creates compact level-up notification cards.

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `setAvatar()` | `source: ImageResolvable` | `this` | Set avatar |
| `setUsername()` | `username: string` | `this` | Set username |
| `setLevel()` | `level: number` | `this` | Set new level |
| `setTitleText()` | `text: string` | `this` | Set title (e.g., 'Level Up!') |
| `setTitleColor()` | `color: ColorResolvable` | `this` | Set title color |
| `setLevelColor()` | `color: ColorResolvable` | `this` | Set level color |

### ProfileCardBuilder

Creates detailed user profile cards.

*Includes all methods from RankCardBuilder, plus:*

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `setDisplayName()` | `name: string` | `this` | Set display name / nickname |
| `setBio()` | `bio: string` | `this` | Set bio/description (max 3 lines) |
| `setBadges()` | `badges: BadgeData[]` | `this` | Set user badges |
| `setReputation()` | `rep: number` | `this` | Set reputation/points |
| `setJoinedAt()` | `date: Date \| string` | `this` | Set join date |
| `setAccentColor()` | `color: ColorResolvable` | `this` | Set accent color |
| `setBioColor()` | `color: ColorResolvable` | `this` | Set bio text color |
| `setBioAlign()` | `align: TextAlign` | `this` | Set bio alignment |

---

## CanvasBuilder

Freeform canvas for custom designs. See [Custom Canvas Guide](./custom-canvas.md).

---

## Types

### ColorResolvable
```typescript
type ColorResolvable = string | [r, g, b] | [r, g, b, a];
```

### ImageResolvable
```typescript
type ImageResolvable = string | Buffer | URL;
```

### ThemeMode
```typescript
type ThemeMode = 'dark' | 'light' | 'custom';
```

### StatusType
```typescript
type StatusType = 'online' | 'idle' | 'dnd' | 'offline' | 'streaming';
```

### OutputFormat
```typescript
type OutputFormat = 'png' | 'jpeg' | 'webp';
```

### GradientData
```typescript
interface GradientData {
  colors: ColorResolvable[];
  direction?: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
}
```

### BadgeData
```typescript
interface BadgeData {
  icon: ImageResolvable;
  label: string;
}
```

---

## Constants

### DiscordColors
```typescript
DiscordColors.BLURPLE     // '#5865F2'
DiscordColors.GREEN       // '#57F287'
DiscordColors.YELLOW      // '#FEE75C'
DiscordColors.FUCHSIA     // '#EB459E'
DiscordColors.RED         // '#ED4245'
DiscordColors.WHITE       // '#FFFFFF'
DiscordColors.BLACK       // '#23272A'
DiscordColors.GREYPLE     // '#99AAB5'
```

### StatusColors
```typescript
StatusColors.online    // '#43b581'
StatusColors.idle      // '#faa61a'
StatusColors.dnd       // '#f04747'
StatusColors.offline   // '#747f8d'
StatusColors.streaming // '#593695'
```

### DefaultDimensions
```typescript
DefaultDimensions.WELCOME   // { width: 1024, height: 450 }
DefaultDimensions.LEAVE     // { width: 1024, height: 450 }
DefaultDimensions.RANK      // { width: 934, height: 282 }
DefaultDimensions.LEVEL_UP  // { width: 600, height: 200 }
DefaultDimensions.PROFILE   // { width: 800, height: 600 }
```
