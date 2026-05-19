# Moderation Card

The `ModerationCardBuilder` creates moderation action announcement cards (for bans, kicks, mutes, warns, etc.) with custom tags, moderation details, case numbers, and colored status accents.

## Basic Usage

```typescript
import { ModerationCardBuilder } from 'canvas-forge';

const card = await new ModerationCardBuilder()
  .setAction('ban')
  .setAvatar(user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(user.username)
  .setModerator(interaction.user.username)
  .setReason('Phishing links spam')
  .setCaseNumber('#1204')
  .build();
```

## Configuration

| Method | Description | Default |
|---|---|---|
| `setAction(action)` | Moderation action type (`'ban'`, `'kick'`, `'mute'`, `'warn'`, `'unban'`, `'unmute'`) | `'ban'` |
| `setAvatar(source)` | Target user avatar (URL, path, or Buffer) | `null` |
| `setUsername(name)` | Target user username | `'User'` |
| `setModerator(name)` | Moderator username | `'Moderator'` |
| `setReason(text)` | Reason for the moderation action | `'No reason provided'` |
| `setCaseNumber(text)` | Optional case number identifier (e.g. `"#1204"`) | `undefined` |
| `setAccentColor(color)` | Accent color highlighting the border/action tag | Dynamic (based on action) |
| `setTitleColor(color)` | Title text color | `#ffffff` |
| `setContentColor(color)` | Details content text color | `#d0d0e0` |
| `setLabelColor(color)` | Label description text color | Dynamic (based on action) |
| `setTheme(theme)` | Color theme (`'dark'`, `'light'`, `'custom'`) | `'dark'` |

## Discord.js Example

```typescript
import { AttachmentBuilder } from 'discord.js';
import { ModerationCardBuilder } from 'canvas-forge';

async function logBan(guild, user, moderator, reason, caseNum) {
  const card = await new ModerationCardBuilder()
    .setAction('ban')
    .setAvatar(user.displayAvatarURL({ extension: 'png' }))
    .setUsername(user.username)
    .setModerator(moderator.username)
    .setReason(reason)
    .setCaseNumber(`#${caseNum}`)
    .build();

  const attachment = new AttachmentBuilder(card, { name: 'ban-log.png' });
  const logChannel = guild.channels.cache.get('LOGS_CHANNEL_ID');
  await logChannel.send({ files: [attachment] });
}
```
