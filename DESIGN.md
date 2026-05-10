---
version: alpha
name: Terminal Signal
description: A restrained terminal-inspired design system for a personal AI engineering publication, combining soft charcoal surfaces, monospace typography, sage-green signal accents, hard borders, and command-line interaction patterns.
colors:
  primary: "#A8B9A8"
  on-primary: "#18191A"
  primary-hover: "#C5D4C5"
  secondary: "#8B949E"
  on-secondary: "#18191A"
  tertiary: "#5C6370"
  on-tertiary: "#D4D4D4"
  background: "#18191A"
  on-background: "#D4D4D4"
  surface: "#18191A"
  surface-container: "#202224"
  surface-container-high: "#2A2C2F"
  surface-container-highest: "#31353A"
  on-surface: "#D4D4D4"
  on-surface-variant: "#8B949E"
  on-surface-muted: "#5C6370"
  outline: "#3E4451"
  outline-variant: "#505765"
  selection: "#3E4451"
  on-selection: "#FFFFFF"
  success: "#A8B9A8"
  warning: "#505050"
  error: "#FF5555"
  info: "#8B949E"
  inverse-surface: "#FFFFFF"
  inverse-on-surface: "#000000"
  overlay-scrim: "#000000"
  light-background: "#FFFFFF"
  light-surface: "#F7F7F8"
  light-on-surface: "#000000"
  light-on-surface-variant: "#40414F"
  light-on-surface-muted: "#8E8EA0"
  light-outline: "#E5E5E5"
  blue-accent: "#2563EB"
  blue-accent-hover: "#1D4ED8"
  dracula-background: "#282A36"
  dracula-surface: "#44475A"
  dracula-primary: "#FF79C6"
  dracula-primary-hover: "#BD93F9"
typography:
  display-hero:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.03em
  display-name:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0em
  title-lg:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.01em
  title-md:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0em
  title-sm:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: 0em
  body-lg:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: 0em
  body-md:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  label-lg:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.05em
  label-md:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0.08em
  label-sm:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 10px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0.1em
  telemetry:
    fontFamily: JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0.05em
    fontFeature: '"tnum"'
spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md-sm: 12px
  md: 20px
  lg: 40px
  xl: 80px
  2xl: 128px
  3xl: 192px
  4xl: 256px
  content-padding-mobile: 8px
  content-padding-tablet: 20px
  content-padding-desktop: 40px
  content-max-width: 1000px
  sidebar-width: 280px
  status-bar-y: 7px
  status-bar-x: 16px
  card-padding: 24px
  module-gap: 32px
rounded:
  none: 0px
  xxs: 2px
  xs: 3px
  sm: 4px
  md: 8px
  full: 9999px
borders:
  hairline: 1px
  strong: 2px
  double: 3px
  corner-accent: 2px
shadows:
  none: none
  divider-top: "0 -1px 0 #3E4451"
  card-block: 4px 4px 0 rgba(0, 0, 0, 0.2)
  card-block-hover: 6px 6px 0 rgba(0, 0, 0, 0.3)
  card-block-mobile: 2px 2px 0 rgba(0, 0, 0, 0.2)
  modal-block: 12px 12px 0 rgba(0, 0, 0, 0.5)
  dropdown: 0 -4px 16px rgba(0, 0, 0, 0.15)
  glow-primary: "0 0 8px #A8B9A8"
elevation:
  flat:
    shadow: none
    borderWidth: 1px
  raised-card:
    shadow: 4px 4px 0 rgba(0, 0, 0, 0.2)
    borderWidth: 1px
  raised-card-hover:
    shadow: 6px 6px 0 rgba(0, 0, 0, 0.3)
    translateY: -2px
  modal:
    shadow: 12px 12px 0 rgba(0, 0, 0, 0.5)
    borderWidth: 3px
motion:
  duration-instant: 100ms
  duration-fast: 150ms
  duration-standard: 200ms
  duration-slow: 300ms
  duration-page: 400ms
  duration-fill: 900ms
  easing-standard: ease
  easing-emphasized: cubic-bezier(0.2, 0, 0, 1)
  easing-material: cubic-bezier(0.4, 0, 0.2, 1)
  easing-stepped-terminal: steps(15)
  blink-duration: 1s
components:
  app-shell:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-background}"
    typography: "{typography.body-md}"
  status-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.telemetry}"
    padding: 7px 16px
    rounded: "{rounded.none}"
    borderColor: "{colors.outline}"
    borderWidth: 1px
  mode-indicator-normal:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xxs}"
    padding: 2px 9px
  frame-standard:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
    borderColor: "{colors.outline}"
    borderWidth: 1px
  frame-label:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label-sm}"
    padding: 0 8px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 10px 20px
    borderColor: "{colors.primary}"
    borderWidth: 1px
  button-primary-hover:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
  button-terminal-outline:
    backgroundColor: transparent
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 8px 20px
    borderColor: "{colors.outline}"
    borderWidth: 1px
  button-terminal-outline-hover:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
  post-card:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding}"
    borderColor: "{colors.outline}"
    borderWidth: 1px
    shadow: 4px 4px 0 rgba(0, 0, 0, 0.2)
  post-card-hover:
    borderColor: "{colors.primary}"
    shadow: 6px 6px 0 rgba(0, 0, 0, 0.3)
    translateY: -2px
  tag-chip:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 2px 8px
    borderColor: "{colors.outline}"
    borderWidth: 1px
  command-line:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 7px 16px
    borderColor: "{colors.outline}"
    borderWidth: 1px
    shadow: "0 -1px 0 #3E4451"
  command-input:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
  cli-tab:
    backgroundColor: transparent
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 6px 16px
  cli-tab-active:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
  keyboard-badge:
    backgroundColor: transparent
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 0 5px
    borderColor: "{colors.outline}"
  code-block:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    borderColor: "{colors.outline}"
    borderWidth: 1px
  article-callout:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
    borderColor: "{colors.outline}"
    borderWidth: 1px
  quote-callout:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 20px 40px
    borderColor: "{colors.primary}"
    borderWidth: 3px
  search-field:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 8px 12px
    borderColor: "{colors.outline}"
  table:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    borderColor: "{colors.outline}"
  progress-track:
    backgroundColor: "{colors.surface-container}"
    rounded: "{rounded.none}"
    height: 4px
    borderColor: "{colors.outline}"
  progress-fill:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.none}"
    height: 4px
  sidebar:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    width: "{spacing.sidebar-width}"
    borderColor: "{colors.outline}"
    borderWidth: 3px
  command-palette:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    borderColor: "{colors.primary}"
    borderWidth: 3px
    shadow: 12px 12px 0 rgba(0, 0, 0, 0.5)
---

## Overview

Terminal Signal is a personal engineering publication interface that feels like a polished text user interface rather than a marketing site. It should read as technical, precise, quiet, and intentionally constrained: a dark console canvas, monospace rhythm, sharp rectangular boundaries, bracketed commands, status telemetry, log streams, and small pulses of sage-green signal.

The design should not feel retro for its own sake. Its terminal cues are functional: they create hierarchy, express authorship, and make navigation feel like operating a small system. The product voice is calm and builder-focused, with just enough motion and accent color to suggest a live environment.

## Colors

The default identity is a dark charcoal terminal palette. Use Soft Charcoal (`#18191A`) as the page canvas and Slightly Lighter Charcoal (`#202224`) for raised panels, cards, command surfaces, blockquotes, and module interiors. Primary text is Soft White Gray (`#D4D4D4`), with Slate Gray (`#8B949E`) for secondary copy and Dim Structure Gray (`#5C6370`) for metadata, dividers, hints, timestamps, and inactive controls.

Sage Signal (`#A8B9A8`) is the primary accent. It should mark active mode, current state, selected items, prompts, important links, progress fills, and high-value calls to action. The accent should be sparse; most of the UI remains monochrome and border-driven. The lighter sage hover value (`#C5D4C5`) is only for stronger interactive feedback.

Borders use Structural Gray (`#3E4451`) and are central to the visual system. Prefer lines, dashed dividers, double borders, and block shadows over filled color. Error red (`#FF5555`) is reserved for terminal-like error states, not decorative emphasis.

Alternate themes may invert or recolor the palette, but the core design language remains: monospace text, hard outlines, restrained accent usage, and command-oriented interaction.

## Typography

The whole interface is monospaced. JetBrains Mono is the intended primary face, with system monospace fallbacks. Avoid pairing it with decorative display fonts; consistency is part of the product identity.

Headlines are uppercase or command-like when they function as system labels. Large page titles may use tight negative letter spacing, but compact labels and telemetry use positive tracking to create the familiar terminal/HUD feel. Body copy stays readable through generous line height, especially in long-form articles.

Labels are often short, uppercase, and prefixed with terminal conventions such as `///`, brackets, file-like names, counters, hashes, or prompt syntax. Numeric telemetry should use tabular figures so clocks, percentages, and counters do not jitter.

## Layout

Layouts are content-first and centered, with a maximum readable width of 1000px. Desktop pages breathe through large top and side padding, while mobile collapses aggressively to compact spacing so terminal modules remain usable on small screens.

The primary structure is modular: status bar at the top, scrollable content in the middle, command input and tab rail at the bottom. Within pages, use two-column grids for dashboards and single-column frames for articles. Dividers are often horizontal rules, dashed separators, timelines, or grid overlays.

Spacing follows a compact terminal rhythm with occasional large vertical breaks for readability. Modules can be dense, but long-form content should maintain generous paragraph spacing and line height.

## Elevation & Depth

Depth is mostly mechanical rather than atmospheric. Standard UI is flat and outlined. Important cards use hard offset block shadows, not soft material shadows. Hover states may lift by 2px and increase the block shadow, creating a tactile but still terminal-like response.

Modal command surfaces are the strongest elevation layer: double accent borders, dark overlay scrims, and large block shadows. Dropdowns and suggestions may use modest blurless shadows, but avoid soft floating glass effects.

Glows are rare and tied to active signal elements such as progress indicators, pulses, and reading progress. Do not apply glow as generic decoration.

## Shapes

The shape language is square. Containers, cards, buttons, tags, code blocks, tables, scrollbars, and article frames use zero radius by default. Tiny radii are allowed only for small utility elements that mimic physical keys or compact badges.

Circles are reserved for semantic dots: status beacons, timeline markers, code-window dots, and compact indicators. A circular shape should communicate state or position, not act as decoration.

Corner accents are part of the frame language: small L-shaped sage corners may expand on hover to show focus. Keep them crisp and geometric.

## Components

Status bars should feel like a modal editor or terminal HUD: small uppercase labels, separators, active mode pill, scroll position, clock, and compact buttons. Use hard borders and minimal fills.

Buttons are rectangular command controls. Primary buttons may be filled sage or transparent with a sage border depending on context. Secondary buttons are outline-only and become brighter on hover. Brackets around command labels are encouraged when the button represents an explicit action.

Cards are data blocks. Post cards use a darker panel fill, hard border, dashed metadata separator, uppercased metadata, and a small square marker in the bottom-right corner. On hover, the card shifts upward and the marker/accent border turns sage.

Frames are reusable content containers with a one-pixel outline, label tab, and optional sage corner brackets. They should feel like terminal windows, not rounded cards.

The command line is a persistent bottom control. The prompt is sage, the input is transparent, and tabs use underline indicators rather than filled pills. Keyboard badges can use a small radius because they represent keycaps.

Article content uses the same terminal vocabulary with calmer pacing: framed headers, uppercase titles, dashed heading separators, bordered tables, terminal code blocks, and callouts with accent borders. Code blocks should look like terminal panes with a header row and small window dots.

## Do's and Don'ts

- Do keep most surfaces dark, flat, rectangular, and bordered.
- Do use sage as a signal color for active state, prompts, progress, links, and primary actions.
- Do prefer uppercase labels, bracketed controls, hashes, counters, and command-like microcopy.
- Do use dashed and double borders when they reinforce the terminal metaphor.
- Do keep long-form reading comfortable with generous line height and measured content width.
- Don't introduce large rounded cards, pill-heavy layouts, glassmorphism, gradients, or decorative blobs.
- Don't use accent color as a background wash across whole sections.
- Don't mix in casual display typography; the monospace voice is the identity.
- Don't rely on soft shadows for hierarchy when borders, contrast, and block shadows are more consistent.
- Don't make every element blink, glitch, or pulse; motion should imply live system state, not visual noise.
