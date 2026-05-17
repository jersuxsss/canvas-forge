# Profile Card

The `ProfileCardBuilder` creates detailed user profile cards with bio, badges, stats, and XP.

## Basic Example

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
  .build();
```

## Full Customization

```typescript
const card = await new ProfileCardBuilder()
  .setAvatar(user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(user.username)
  .setDiscriminator(user.discriminator)
  .setDisplayName('Cool Nickname')
  .setBio('Full-stack developer. Discord bot enthusiast.')
  .setBioAlign('left')
  .setBadges([
    { icon: './badges/verified.png', label: 'Verified' },
    { icon: './badges/booster.png', label: 'Server Booster' },
  ])
  .setLevel(25)
  .setCurrentXP(7500)
  .setRequiredXP(10000)
  .setRank(5)
  .setReputation(420)
  .setJoinedAt(new Date('2023-06-15'))
  .setStatus('online')
  .setAccentColor('#e94560')
  .setProgressBarColor('#e94560')
  .setProgressBarTrackColor('#2a2a3e')
  .setBackground('#1a1a2e')
  .build();
```

## Default Dimensions

- **Width**: 800px
- **Height**: 600px
