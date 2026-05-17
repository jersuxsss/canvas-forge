# Info Card

The `InfoCardBuilder` creates general-purpose information cards similar to Discord embeds. Supports title, description, structured fields (inline or full-width), footer, icon, and a left accent stripe.

## Basic Usage

```typescript
import { InfoCardBuilder } from 'canvas-forge';

const card = await new InfoCardBuilder()
  .setTitle('Server Rules')
  .setDescription('Please follow these rules.')
  .addField({ name: 'Rule 1', value: 'Be respectful' })
  .addField({ name: 'Rule 2', value: 'No spam' })
  .setFooter('Last updated: May 2026')
  .setAccentColor('#5865F2')
  .build();
```

## Configuration

| Method | Description | Default |
|---|---|---|
| `setTitle(text)` | Title text | `'Information'` |
| `setDescription(text)` | Description / body text | `''` |
| `addField(field)` | Add a single field `{ name, value, inline? }` | — |
| `setFields(fields)` | Replace all fields | `[]` |
| `setFooter(text)` | Footer text | `''` |
| `setIcon(source)` | Icon image (top-left) | `null` |
| `setIconSize(size)` | Icon size in pixels | `48` |
| `setTitleColor(color)` | Title text color | `#ffffff` |
| `setDescriptionColor(color)` | Description text color | `#a0a0b0` |
| `setFieldNameColor(color)` | Field label color | `#e94560` |
| `setFieldValueColor(color)` | Field value color | `#d0d0e0` |
| `setFooterColor(color)` | Footer text color | `#666680` |
| `setAccentColor(color)` | Left accent stripe color | `#e94560` |
| `setTheme(theme)` | Color theme (`'dark'`, `'light'`, `'custom'`) | `'dark'` |

## Inline Fields

Fields can be displayed side-by-side by setting `inline: true`:

```typescript
.addField({ name: 'Members', value: '1,500', inline: true })
.addField({ name: 'Online', value: '320', inline: true })
.addField({ name: 'Roles', value: '25', inline: true })
```

Up to 3 inline fields are displayed per row.
