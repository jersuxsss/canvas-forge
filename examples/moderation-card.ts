/**
 * Example: Creating a Moderation Card
 *
 * This example demonstrates how to create a moderation action announcement card
 * and send it in a Discord logging channel.
 */

import { ModerationCardBuilder } from 'canvas-forge';
// import { AttachmentBuilder } from 'discord.js';

async function createModerationCard(): Promise<Buffer> {
  const card = await new ModerationCardBuilder()
    .setAction('ban')
    .setAvatar('https://cdn.discordapp.com/avatars/123456789/avatar.png')
    .setUsername('SpammerUser')
    .setModerator('AdminAlice')
    .setReason('Sending phishing links in multiple channels')
    .setCaseNumber('#9876')
    .setTheme('dark')
    .build();

  return card;
}

createModerationCard().then((buffer) => {
  console.log(`Moderation card generated! Size: ${buffer.length} bytes`);
});
