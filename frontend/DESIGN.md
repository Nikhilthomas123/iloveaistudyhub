---
name: Kinetic Logic
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin: 32px
  max_width: 1440px
---

## Brand & Style

The design system is engineered for high-performance productivity, targeting professionals who require clarity and speed. The brand personality is efficient, reliable, and intellectually sharp. 

The aesthetic follows a **Modern Minimalist** approach. It prioritizes functional density without visual clutter, utilizing generous whitespace to reduce cognitive load. The UI relies on precision alignment, subtle depth, and a disciplined color application to guide the user's focus toward data and actionable tasks. The emotional response is one of calm control and organized momentum.

## Colors

The palette is anchored by a high-clarity Blue (#2563eb) used for primary actions and state indicators. The background uses a cool Light Gray (#f8fafc) to provide a soft contrast against the pure White (#ffffff) surface containers. 

Secondary information and icons utilize Slate (#64748b) to maintain a professional hierarchy. Functional colors for error and success states are saturated enough to stand out against the neutral background while maintaining the system's clean, clinical feel.

## Typography

This design system utilizes **Inter** across all roles to leverage its exceptional legibility and systematic feel. Headlines feature slight negative letter spacing to appear more cohesive at larger scales. 

Information density is managed through a clear hierarchy: **Labels** are used for metadata and category tags, often in uppercase to differentiate from body text. **Body-md** is the workhorse for dashboard data and list items, ensuring maximum information density without sacrificing readability.

## Layout & Spacing

The layout is built on a **12-column fluid grid** with a maximum container width of 1440px. The spacing rhythm is based on a 4px baseline, ensuring all components align to a predictable vertical and horizontal scale.

- **Desktop:** 12 columns, 24px gutters, 32px side margins.
- **Tablet:** 8 columns, 16px gutters, 24px side margins.
- **Mobile:** 4 columns, 16px gutters, 16px side margins.

For complex dashboards, utilize a "Side-Nav" fixed layout where the navigation occupies a permanent left-hand column (240px - 280px) and the content area expands fluidly.

## Elevation & Depth

Visual hierarchy is established using **Tonal Layering** combined with **Ambient Shadows**. 

- **Level 0 (Background):** #f8fafc. Used for the main canvas.
- **Level 1 (Surface):** #ffffff. Used for cards, sidebars, and primary content areas. These feature a very soft, 1px border (#e2e8f0) to define edges.
- **Level 2 (Elevated):** White surface with a 4px blur, 0.05 opacity black shadow. Used for hover states on interactive cards.
- **Level 3 (Overlay):** White surface with a 12px blur, 0.1 opacity black shadow. Used for modals and dropdown menus to separate them from the workspace.

## Shapes

The shape language is consistently rounded to soften the professional environment and make the UI feel approachable. 

- **Standard Elements:** 12px (0.75rem) corner radius for buttons, input fields, and small cards.
- **Large Containers:** 16px (1rem) for main dashboard widgets and modal containers.
- **Small Elements:** 6px (0.375rem) for checkboxes and tags to maintain visual balance at scale.

## Components

### Buttons
Primary buttons use the #2563eb background with white text and a 12px radius. Secondary buttons use a white background with a subtle border (#e2e8f0) and Slate text. Active/Pressed states should darken the background by 10%.

### Input Fields
Fields feature a 12px radius, #ffffff background, and a 1px #e2e8f0 border. On focus, the border transitions to Primary Blue with a subtle 3px outer glow (0.1 opacity blue).

### Cards
Dashboard widgets (cards) are the primary container. They use a white surface, 12px or 16px rounded corners, and a light 1px border. Padding inside cards should be 24px (lg) to give data room to breathe.

### Chips & Tags
Used for status indicators (e.g., "In Progress"). These should have a 6px radius and use low-saturation background tints of the status color with high-saturation text for readability.

### Lists
Data lists should use alternating row highlights or subtle separators (#f1f5f9). Interactive rows should have a hover state of #f8fafc.

### Dashboard Specifics
- **Progress Bars:** Use a 4px height with rounded caps.
- **Tooltips:** Dark slate background (#1e293b) with 6px rounded corners to contrast against the light UI.