/**
 * Example: Creating a Welcome Card
 *
 * This example demonstrates how to create a welcome card
 * and save it to a file. In a real Discord bot, you would
 * send the buffer as an attachment instead.
 */

import { WelcomeCardBuilder } from 'canvas-forge';
import { writeFileSync } from 'fs';

async function main(): Promise<void> {
  // Basic welcome card
  const basicCard = await new WelcomeCardBuilder()
    .setUsername('Jersuxs')
    .setGuildName('My Awesome Server')
    .setMemberCount(1500)
    .build();

  writeFileSync('./welcome-basic.png', basicCard);
  console.log('✅ Basic welcome card saved to welcome-basic.png');

  // Fully customized welcome card
  const customCard = await new WelcomeCardBuilder()
    .setUsername('Jersuxs')
    .setGuildName('My Awesome Server')
    .setMemberCount(1500)
    .setTitleText('Welcome aboard!')
    .setSubtitleText('You are member #{memberCount}')
    .setTheme('dark')
    .setAvatarBorder('#e94560')
    .setTitleColor('#e94560')
    .setBackgroundGradient({
      colors: ['#1a1a2e', '#16213e', '#0f3460'],
      direction: 'diagonal',
    })
    .setOverlay('#000000', 0.2)
    .setSize(1024, 500)
    .build();

  writeFileSync('./welcome-custom.png', customCard);
  console.log('✅ Custom welcome card saved to welcome-custom.png');
}

main().catch(console.error);
