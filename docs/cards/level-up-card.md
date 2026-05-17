# Level Up Card

The `LevelUpCardBuilder` creates compact notification cards for when users level up.

## Basic Example

```typescript
import { LevelUpCardBuilder } from 'canvas-forge';

const card = await new LevelUpCardBuilder()
  .setAvatar(user.displayAvatarURL({ extension: 'png', size: 256 }))
  .setUsername(user.username)
  .setLevel(10)
  .build();
```

## Full Customization

```typescript
const card = await new LevelUpCardBuilder()
  .setAvatar(user.displayAvatarURL({ extension: 'png', size: 256 }))
  .setUsername(user.username)
  .setLevel(10)
  .setTitleText('Level Up!')
  .setTitleColor('#e94560')
  .setUsernameColor('#ffffff')
  .setLevelColor('#e94560')
  .setAvatarBorder('#e94560')
  .setTheme('dark')
  .build();
```

## Default Dimensions

- **Width**: 600px
- **Height**: 200px
