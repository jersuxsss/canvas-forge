# Leave Card

The `LeaveCardBuilder` creates goodbye/leave cards for when members leave a Discord server.

## Basic Example

```typescript
import { LeaveCardBuilder } from 'canvas-forge';

const card = await new LeaveCardBuilder()
  .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(member.user.username)
  .setGuildName(member.guild.name)
  .build();
```

## Full Customization

```typescript
const card = await new LeaveCardBuilder()
  .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(member.user.username)
  .setGuildName(member.guild.name)
  .setTitleText('Goodbye!')
  .setSubtitleText('We will miss you...')
  .setTheme('dark')
  .setAvatarBorder('#747f8d')
  .setTitleColor('#747f8d')
  .build();
```

## With Discord.js

```typescript
client.on(Events.GuildMemberRemove, async (member) => {
  const card = await new LeaveCardBuilder()
    .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
    .setUsername(member.user.username)
    .setGuildName(member.guild.name)
    .build();

  const attachment = new AttachmentBuilder(card, { name: 'goodbye.png' });
  const channel = member.guild.channels.cache.get('CHANNEL_ID');
  if (channel?.isTextBased()) {
    await channel.send({ content: `${member.user.username} has left.`, files: [attachment] });
  }
});
```
