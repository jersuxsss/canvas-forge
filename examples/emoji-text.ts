/**
 * Example: CanvasBuilder Advanced Features (Radial Gradients, Filters, Emojis, Pixelate)
 *
 * This example demonstrates the advanced CanvasBuilder API additions including
 * radial gradients, filters, custom Discord emojis, and region pixelation.
 */

import { CanvasBuilder } from 'canvas-forge';
import * as fs from 'fs';
import * as path from 'path';

async function createAdvancedCanvas(): Promise<Buffer> {
  const canvas = new CanvasBuilder(800, 450)
    // 1. Radial Background Gradient
    .setBackgroundGradient({
      colors: ['#2c2f33', '#1a1a2e'],
      direction: 'radial'
    })
    // 2. Set font
    .setFont(24, 'sans-serif', 'bold');

  // 3. Draw text with custom Discord emojis (<:emoji_name:emoji_id>)
  // (Behind the scenes, canvas-forge fetches them from Discord's CDN and aligns them inline)
  await canvas.drawTextWithEmojis(
    'Welcome <:blurple_sparkle:1234567890> to the party! <:boost:1234567890>',
    400,
    100,
    '#ffffff',
    'center'
  );

  // 4. Draw shapes with radial gradients
  canvas.drawGradientRect(
    100, 180, 250, 150,
    { colors: ['#eb459e', '#5865f2'], direction: 'radial' },
    12
  );

  // 5. Drawing with filters and pixelation
  canvas
    .save()
    .applyBlur(4)
    .drawRect(450, 180, 250, 150, '#5865f2')
    .restore()
    // Pixelate a portion of the blurred rectangle
    .pixelate(550, 220, 100, 80, 10);

  return canvas.toBuffer();
}

createAdvancedCanvas().then((buffer) => {
  console.log(`Advanced canvas example generated! Size: ${buffer.length} bytes`);
});
