# Leaderboard Card

The `LeaderboardCardBuilder` creates ranked leaderboard cards showing the top users in a server. Features gold/silver/bronze medals for top-3, optional avatars, and score display.

## Basic Usage

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

## Configuration

| Method | Description | Default |
|---|---|---|
| `setTitle(text)` | Title text | `'Leaderboard'` |
| `addEntry(entry)` | Add a single entry `{ rank, username, score, avatar? }` | — |
| `setEntries(entries)` | Replace all entries | `[]` |
| `setMaxEntries(max)` | Max entries to display | `10` |
| `setScoreLabel(label)` | Score column label (e.g., `'XP'`, `'Coins'`) | `'XP'` |
| `setTitleColor(color)` | Title text color | `#ffffff` |
| `setUsernameColor(color)` | Username text color | `#d0d0e0` |
| `setScoreColor(color)` | Score text color | `#a0a0b0` |
| `setAccentColor(color)` | Accent color for highlights | `#e94560` |
| `setDividerColor(color)` | Divider line color | `rgba(255,255,255,0.06)` |
| `setRankColor(color)` | Rank number color | `#e94560` |
| `setTheme(theme)` | Color theme (`'dark'`, `'light'`, `'custom'`) | `'dark'` |

## Entry Format

Each entry requires `rank`, `username`, and `score`. An optional `avatar` image can be provided:

```typescript
interface LeaderboardEntry {
  rank: number;           // Position (1, 2, 3, ...)
  username: string;       // Display name
  score: number;          // Score / XP / coins
  avatar?: ImageResolvable; // Optional avatar
}
```

## With Avatars

```typescript
const card = await new LeaderboardCardBuilder()
  .setTitle('Top Players')
  .addEntry({
    rank: 1,
    username: 'Jersuxs',
    score: 25400,
    avatar: 'https://cdn.discordapp.com/avatars/...',
  })
  .build();
```
