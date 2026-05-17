# Boost Card

The `BoostCardBuilder` creates server boost notification cards with a Nitro-themed gradient accent and boost glow effect.

## Basic Usage

```typescript
import { BoostCardBuilder } from 'canvas-forge';

const card = await new BoostCardBuilder()
  .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(member.user.username)
  .setGuildName(member.guild.name)
  .setBoostCount(15)
  .build();
```

## Configuration

| Method | Description | Default |
|---|---|---|
| `setAvatar(source)` | User avatar image (URL, path, or Buffer) | `null` |
| `setAvatarSize(size)` | Avatar diameter in pixels | `120` |
| `setAvatarBorder(color)` | Avatar border color | `#f47fff` |
| `setAvatarBorderWidth(width)` | Avatar border width | `4` |
| `setUsername(name)` | Username text | `'User'` |
| `setGuildName(name)` | Server name | `'Server'` |
| `setBoostCount(count)` | Number of boosts | `1` |
| `setTitleText(text)` | Title text | `'Server Boosted!'` |
| `setSubtitleText(text)` | Subtitle (use `{boostCount}` placeholder) | `'This server now has {boostCount} boosts!'` |
| `setTitleColor(color)` | Title text color | `#f47fff` |
| `setSubtitleColor(color)` | Subtitle text color | `#a0a0b0` |
| `setUsernameColor(color)` | Username text color | `#ffffff` |
| `setAccentColor(color)` | Accent / highlight color | `#f47fff` |
| `setTheme(theme)` | Color theme (`'dark'`, `'light'`, `'custom'`) | `'dark'` |

## Discord.js Example

```typescript
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (oldMember.premiumSince === null && newMember.premiumSince !== null) {
    const card = await new BoostCardBuilder()
      .setAvatar(newMember.user.displayAvatarURL({ extension: 'png', size: 512 }))
      .setUsername(newMember.user.username)
      .setGuildName(newMember.guild.name)
      .setBoostCount(newMember.guild.premiumSubscriptionCount ?? 1)
      .build();

    const attachment = new AttachmentBuilder(card, { name: 'boost.png' });
    boostChannel.send({ files: [attachment] });
  }
});
```
