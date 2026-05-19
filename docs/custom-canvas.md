# Custom Canvas Guide

The `CanvasBuilder` gives you full creative freedom to design anything from scratch. It wraps the `@napi-rs/canvas` API with a friendlier, chainable interface.

## Basic Setup

```typescript
import { CanvasBuilder } from 'canvas-forge';

const canvas = new CanvasBuilder(800, 400);
```

## Background

```typescript
// Solid color
canvas.setBackground('#1a1a2e');

// Gradient
canvas.setBackgroundGradient({
  colors: ['#e94560', '#0f3460'],
  direction: 'horizontal',
});

// Image (async)
await canvas.setBackgroundImage('https://example.com/bg.png');
```

## Drawing Shapes

```typescript
// Rectangle (optionally rounded)
canvas.drawRect(10, 10, 200, 100, '#ff0000');
canvas.drawRect(10, 10, 200, 100, '#ff0000', 15); // rounded

// Circle
canvas.drawCircleShape(100, 100, 50, '#e94560');

// Gradient rectangle (optionally rounded)
canvas.drawGradientRect(20, 20, 300, 150, {
  colors: ['#e94560', '#0f3460'],
  direction: 'diagonal',
}, 10);

// Bordered rectangle (stroke only, no fill)
canvas.drawBorderedRect(50, 50, 200, 100, '#ffffff', 3, 8);

// Line
canvas.drawLine(0, 200, 800, 200, '#ffffff', 2);

// Polygon (triangle, diamond, any shape)
canvas.drawPolygon(
  [[400, 50], [500, 200], [300, 200]],
  '#5865F2',
);

// Polygon with stroke
canvas.drawPolygon(
  [[400, 50], [500, 200], [300, 200]],
  '#5865F2', '#ffffff', 2,
);

// Arc (partial circle)
canvas.drawArc(400, 200, 80, 0, Math.PI, '#e94560', 3);

// Progress bar
canvas.drawProgressBar(50, 300, 700, 30, 0.75, '#e94560', '#2a2a3e');
```

## Drawing Images

```typescript
// Regular image
await canvas.drawImage('https://example.com/image.png', 0, 0, 100, 100);

// Circular (clipped) image — perfect for avatars
await canvas.drawCircularImage('https://example.com/avatar.png', 100, 100, 80);
```

## Drawing Text

```typescript
// Set font
canvas.setFont(32, 'sans-serif', 'bold');

// Simple text
canvas.drawText('Hello World', 400, 50, '#ffffff', 'center');

// Wrapped text (auto line-break)
canvas.drawWrappedText(
  'This is a long text that will automatically wrap',
  50, 100, '#ffffff', 300,
);
```

## Shadows

```typescript
// Enable shadow
canvas.drawShadow('rgba(0,0,0,0.5)', 10, 4, 4);
canvas.drawRect(50, 50, 200, 100, '#e94560', 10);

// Disable shadow
canvas.clearShadow();
```

## Transparency

```typescript
// Set transparency (0.0 = invisible, 1.0 = opaque)
canvas.setGlobalAlpha(0.5);
canvas.drawRect(0, 0, 800, 400, '#ff0000');
canvas.resetGlobalAlpha();
```

## State Management

```typescript
// Save current state (styles, transforms, clip regions)
canvas.save();

// ... make changes ...
canvas.setGlobalAlpha(0.3);
canvas.drawRect(0, 0, 100, 100, '#ff0000');

// Restore previous state
canvas.restore();
// Alpha is back to 1.0
```

## Filters & Pixelation

You can apply standard CSS filters or pixelate specific regions:

```typescript
// Apply a quick grayscale filter to subsequent drawing operations
canvas.applyGrayscale(100);
canvas.drawRect(50, 50, 100, 100, '#ff0000'); // Drawn in grayscale

// Apply other filters
canvas.applyBlur(5); // 5px blur
canvas.applySepia(100); // 100% sepia
canvas.applyInvert(100); // 100% invert color
canvas.setFilter('contrast(150%) hue-rotate(90deg)'); // custom CSS filter

// Reset filters back to none
canvas.clearFilter();

// Pixelate a specific rectangular region (perfect for hiding avatars or details)
canvas.pixelate(50, 50, 200, 150, 8); // x, y, width, height, pixelSize (default: 8)
```

## Drawing Text with Discord Emojis

Draw strings containing inline custom Discord emojis (`<:name:id>` or `<a:name:id>`). The builder automatically fetches the emoji images from Discord's CDN, caches them, and renders them vertically aligned with your text:

```typescript
// (async) Draws text with custom emojis inline
await canvas.drawTextWithEmojis(
  'Welcome to the server! <:boost:1234567890> Enjoy your stay!',
  400, // X position
  150, // Y position (baseline)
  '#ffffff', // Text color
  'center', // Alignment ('left', 'center', 'right')
  24, // Optional custom emoji size (defaults to font size)
);
```

## Radial Gradients

In addition to linear gradients (`horizontal`, `vertical`, `diagonal`), you can use `radial` gradients for backgrounds and rectangle fills:

```typescript
// Background radial gradient
canvas.setBackgroundGradient({
  colors: ['#2c2f33', '#1a1a2e'],
  direction: 'radial',
});

// Rectangle radial gradient fill
canvas.drawGradientRect(100, 100, 200, 200, {
  colors: ['#eb459e', '#5865f2'],
  direction: 'radial',
});
```

## Advanced: Raw Context

For operations not covered by the builder API, access the raw canvas 2D context:

```typescript
const ctx = canvas.getContext();
ctx.beginPath();
ctx.arc(200, 200, 50, 0, Math.PI * 2);
ctx.fillStyle = '#e94560';
ctx.fill();
```

## Output

```typescript
// Default: PNG
const buffer = canvas.toBuffer();

// JPEG
canvas.setOutputFormat('jpeg');
canvas.setOutputQuality(90);
const jpegBuffer = canvas.toBuffer();

// WebP
canvas.setOutputFormat('webp');
canvas.setOutputQuality(85);
const webpBuffer = canvas.toBuffer();
```

## Full Example

```typescript
import { CanvasBuilder } from 'canvas-forge';
import fs from 'fs';

const buffer = new CanvasBuilder(800, 400)
  .setBackground('#1a1a2e')
  .drawShadow('rgba(0,0,0,0.3)', 8, 3, 3)
  .drawGradientRect(20, 20, 760, 360, {
    colors: ['#16213e', '#0f3460'],
    direction: 'diagonal',
  }, 15)
  .clearShadow()
  .drawLine(40, 70, 760, 70, 'rgba(255,255,255,0.1)', 1)
  .setFont(36, 'sans-serif', 'bold')
  .drawText('My Custom Card', 400, 55, '#e94560', 'center')
  .drawPolygon(
    [[400, 100], [480, 180], [400, 260], [320, 180]],
    '#5865F2',
  )
  .setFont(16, 'sans-serif', 'normal')
  .drawText('Built with canvas-forge', 400, 300, '#a0a0b0', 'center')
  .drawProgressBar(50, 330, 700, 20, 0.85, '#e94560', '#2a2a3e', 10)
  .drawBorderedRect(40, 80, 720, 260, 'rgba(255,255,255,0.05)', 1, 10)
  .toBuffer();

fs.writeFileSync('custom.png', buffer);
```
