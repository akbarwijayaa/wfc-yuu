# Brand — spk/coffee

Direction: **Stark Minimal** (Vercel-style), dark, warmed to coffee. Single accent + warm grayscale. Restraint over decoration.

## Palette (tokens in `app/globals.css` `@theme`)

| Token | Hex | Role |
|---|---|---|
| `--color-bg` | `#0a0908` | App background (warm near-black) |
| `--color-panel` | `#131110` | Cards / panels |
| `--color-panel-2` | `#1a1613` | Elevated / hover rows |
| `--color-line` | `#2a2421` | Subtle borders |
| `--color-line-2` | `#3a322d` | Hover borders / dividers |
| `--color-ink` | `#f4efe8` | Primary text (warm white) |
| `--color-ink-2` | `#b3a99d` | Secondary text |
| `--color-ink-3` | `#7c736a` | Muted text / labels |
| `--color-coffee` | `#c0875a` | **The one accent** — primary, links, active, rank-1 |
| `--color-coffee-2` | `#d6a276` | Accent hover (lighter) |
| `--color-on-coffee` | `#1a1108` | Text on accent fills |

Rules: no second accent. No pure `#000`. Borders, not shadows. Red/green only for error/success states.

## Typography

- Sans: **Geist** (`--font-sans`). Headings tight tracking (`tracking-tight`), `font-semibold`.
- Mono: **Geist Mono** (`--font-mono`) for numerals, scores, C-codes, eyebrows, terminal-style labels. `tabular-nums` for all numbers.
- Eyebrows: mono, uppercase, `tracking-[0.2em]`, coffee color (`.eyebrow`).

## Component classes (`@layer components`)

`.panel` `.btn-primary` `.btn-ghost` `.input` `.label` `.badge` `.eyebrow` `.navlink`

## Voice

Specific, technical, calm. Indonesian copy. No vague hype ("build the future"). Lead with the product's real output (rankings, scores, MFEP).
