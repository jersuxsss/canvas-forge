# Rank Card

The `RankCardBuilder` creates XP/rank cards with progress bars for Discord leveling systems.

## Basic Example

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
  .build();
```

## Full Customization

```typescript
const card = await new RankCardBuilder()
  .setAvatar(user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(user.username)
  .setLevel(15)
  .setCurrentXP(2500)
  .setRequiredXP(5000)
  .setRank(3)
  .setStatus('online')
  .setProgressBarColor('#e94560')
  .setProgressBarTrackColor('#2a2a3e')
  .setProgressBarHeight(30)
  .setAvatarBorder('#e94560')
  .setLevelColor('#e94560')
  .setRankColor('#ffffff')
  .setXPColor('#a0a0b0')
  .setUsernameColor('#ffffff')
  .setBackground('#1a1a2e')
  .build();
```

## Status Types

```typescript
builder.setStatus('online');    // Green dot
builder.setStatus('idle');      // Yellow dot
builder.setStatus('dnd');       // Red dot
builder.setStatus('offline');   // Gray dot
builder.setStatus('streaming'); // Purple dot

// Override the status color
builder.setStatusColor('#ff00ff');
```

## Default Dimensions

- **Width**: 934px
- **Height**: 282px
