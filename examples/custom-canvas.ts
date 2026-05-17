/**
 * Example: Creating a Custom Canvas
 */

import { CanvasBuilder } from 'canvas-forge';
import { writeFileSync } from 'fs';

function main(): void {
  const buffer = new CanvasBuilder(800, 400)
    .setBackground('#1a1a2e')
    // Draw a panel
    .drawRect(20, 20, 760, 360, '#16213e', 15)
    // Title
    .setFont(36, 'sans-serif', 'bold')
    .drawText('My Custom Card', 400, 70, '#e94560', 'center')
    // Subtitle
    .setFont(18, 'sans-serif', 'normal')
    .drawText('Built with canvas-forge', 400, 100, '#a0a0b0', 'center')
    // A circle decoration
    .drawCircleShape(400, 220, 60, '#0f3460')
    .drawCircleShape(400, 220, 45, '#16213e')
    // Progress bar
    .drawProgressBar(100, 330, 600, 25, 0.72, '#e94560', '#2a2a3e', 12)
    // Progress label
    .setFont(14, 'sans-serif', 'normal')
    .drawText('72%', 710, 349, '#a0a0b0', 'left')
    .toBuffer();

  writeFileSync('./custom-canvas.png', buffer);
  console.log('✅ Custom canvas saved to custom-canvas.png');
}

main();
