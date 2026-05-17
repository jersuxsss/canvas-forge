# Custom Canvas Guide

The `CanvasBuilder` gives you complete creative freedom to build any design you can imagine.

## Basic Usage

```typescript
import { CanvasBuilder } from 'canvas-forge';

const buffer = new CanvasBuilder(800, 400)
  .setBackground('#1a1a2e')
  .setFont(32, 'sans-serif', 'bold')
  .drawText('Hello World!', 400, 200, '#e94560', 'center')
  .toBuffer();
```

## Drawing Shapes

```typescript
const builder = new CanvasBuilder(800, 400)
  .setBackground('#1a1a2e')
  // Rectangles (with optional rounded corners)
  .drawRect(20, 20, 200, 100, '#16213e', 15)
  // Circles
  .drawCircleShape(500, 200, 80, '#e94560');
```

## Drawing Images

```typescript
const builder = new CanvasBuilder(800, 400);
await builder.setBackgroundImage('https://example.com/bg.png');
await builder.drawImage('https://example.com/icon.png', 10, 10, 64, 64);
await builder.drawCircularImage('https://cdn.discordapp.com/avatars/...', 400, 200, 120);
const buffer = builder.toBuffer();
```

## Text

```typescript
const builder = new CanvasBuilder(800, 400)
  .setBackground('#1a1a2e')
  .setFont(24, 'sans-serif', 'bold')
  .drawText('Title', 400, 50, '#ffffff', 'center')
  .setFont(16, 'sans-serif', 'normal')
  .drawWrappedText(
    'This is a long paragraph that will automatically wrap to the next line.',
    50, 100, '#a0a0b0', 700
  );
```

## Progress Bars

```typescript
const builder = new CanvasBuilder(800, 100)
  .setBackground('#1a1a2e')
  .drawProgressBar(50, 35, 700, 30, 0.75, '#e94560', '#2a2a3e', 15);
```

## Raw Context Access

For advanced operations not covered by the builder API:

```typescript
const builder = new CanvasBuilder(800, 400);
const ctx = builder.getContext();

// Use the raw @napi-rs/canvas API
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
ctx.shadowBlur = 10;
ctx.fillStyle = '#e94560';
ctx.fillRect(100, 100, 200, 200);

const buffer = builder.toBuffer();
```

## Custom Fonts

```typescript
const builder = new CanvasBuilder(800, 400)
  .registerFont('./fonts/Montserrat-Bold.ttf', 'Montserrat')
  .setBackground('#1a1a2e')
  .setFont(32, 'Montserrat', 'bold')
  .drawText('Custom Font!', 400, 200, '#e94560', 'center');
```

## Output Formats

```typescript
// PNG (default)
const png = builder.toBuffer();

// JPEG
const jpeg = builder.setOutputFormat('jpeg').setOutputQuality(90).toBuffer();

// WebP
const webp = builder.setOutputFormat('webp').setOutputQuality(85).toBuffer();
```
