/**
 * Example: Creating a Profile Card
 */

import { ProfileCardBuilder } from 'canvas-forge';
import { writeFileSync } from 'fs';

async function main(): Promise<void> {
  const card = await new ProfileCardBuilder()
    .setUsername('Jersuxs')
    .setDisplayName('Jersuxs')
    .setBio('Full-stack developer. Discord bot enthusiast. Open source lover.')
    .setLevel(25)
    .setCurrentXP(7500)
    .setRequiredXP(10000)
    .setRank(5)
    .setReputation(420)
    .setStatus('online')
    .setAccentColor('#e94560')
    .setTheme('dark')
    .build();

  writeFileSync('./profile-card.png', card);
  console.log('✅ Profile card saved to profile-card.png');
}

main().catch(console.error);
