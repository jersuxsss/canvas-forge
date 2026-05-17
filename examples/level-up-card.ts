/**
 * Example: Creating a Level Up Card
 */

import { LevelUpCardBuilder } from 'canvas-forge';
import { writeFileSync } from 'fs';

async function main(): Promise<void> {
  const card = await new LevelUpCardBuilder()
    .setUsername('Jersuxs')
    .setLevel(10)
    .setTitleText('Level Up!')
    .setTitleColor('#e94560')
    .setLevelColor('#e94560')
    .setTheme('dark')
    .build();

  writeFileSync('./level-up.png', card);
  console.log('✅ Level up card saved to level-up.png');
}

main().catch(console.error);
