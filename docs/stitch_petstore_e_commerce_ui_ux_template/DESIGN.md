---
name: The Sophisticated Caretaker
colors:
  surface: '#f8f9ff'
  surface-dim: '#d1dbea'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e4effe'
  surface-container-high: '#dfe9f9'
  surface-container-highest: '#d9e3f3'
  on-surface: '#121c27'
  on-surface-variant: '#574239'
  inverse-surface: '#27313d'
  inverse-on-surface: '#e9f1ff'
  outline: '#8a7268'
  outline-variant: '#e0c0b2'
  surface-tint: '#a14000'
  primary: '#7b2f00'
  on-primary: '#ffffff'
  primary-container: '#f26d21'
  on-primary-container: '#ffceb9'
  inverse-primary: '#ffb694'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#9af1c6'
  on-secondary-container: '#0b714e'
  tertiary: '#5c4300'
  on-tertiary: '#ffffff'
  tertiary-container: '#795900'
  on-tertiary-container: '#ffd275'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb694'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7b2f00'
  secondary-fixed: '#9df4c9'
  secondary-fixed-dim: '#81d8ae'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005237'
  tertiary-fixed: '#ffdfa0'
  tertiary-fixed-dim: '#ecc165'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#f8f9ff'
  on-background: '#121c27'
  surface-variant: '#d9e3f3'
  soft-peach: '#FFF7ED'
  success-emerald: '#10B981'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  margin-mobile: 16px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style
The brand identity centers on a premium, warm, and trustworthy e-commerce experience for pet owners who view their animals as family members. The style is **Corporate / Modern** with a strong infusion of **Soft Minimalism**. It balances professional reliability with emotional warmth through the use of soft peach tones, playful organic imagery, and a spacious layout. The aesthetic is clean and high-end, avoiding the cluttered "discount" look of traditional retailers in favor of a curated, boutique-like atmosphere.

## Colors
The palette uses a sophisticated "Terracotta and Emerald" pairing. The **Primary** color is a deep, earthy burnt orange, supported by a vibrant **Primary-Container** orange used for calls to action and brand highlights. **Secondary** is a deep forest green, providing a sense of growth and health, used for promotional banners and success states. The neutral foundation is built on cool-toned blues and greys (`surface-bright`, `surface-container`) to keep the interface feeling airy, while `soft-peach` provides a warm, inviting background for high-impact hero sections.

## Typography
The system relies exclusively on **Inter** to maintain a clean, systematic, and highly legible appearance. 
- **Headlines:** Use heavy weights (600-700) with slight negative letter spacing for display roles to create a "locked-in," premium feel.
- **Body:** Standardized at 16px for optimal readability with generous line heights (1.5x) to prevent visual fatigue.
- **Labels:** Utilizes semi-bold weights and increased letter spacing (0.05em) for uppercase utility text and category tags.

## Layout & Spacing
The system follows a **Fixed Grid** philosophy for desktop with a maximum container width of 1280px. 
- **Mobile:** 16px side margins with a single-column vertical stack.
- **Desktop:** 24px gutters. Use a 4-column grid for product cards and a 2-column layout for hero sections.
- **Vertical Rhythm:** Defined by `stack` increments. Use `stack-xl` (64px) to separate major sections and `stack-md` (16px) for internal component spacing (e.g., between a headline and its description).

## Elevation & Depth
Hierarchy is established through **Ambient Shadows** and **Tonal Layering**.
- **Surfaces:** Use `surface-white` for primary interaction cards against `background-subtle` or `soft-peach` sections to create immediate separation.
- **Shadows:** Avoid harsh, dark shadows. Use `shadow-ambient` (low opacity, large blur) for cards and `shadow-glow` (tinted with the primary-container color) for primary buttons to make them appear to float slightly above the surface.
- **Backdrop:** Use semi-transparent white (80% opacity) with a `backdrop-blur-md` for the sticky header to maintain context while scrolling.

## Shapes
The shape language is friendly and approachable. 
- **Standard Cards/Buttons:** Use `rounded-lg` (0.5rem / 8px).
- **Secondary Containers:** Use `rounded-2xl` (1.5rem / 24px) for product cards and larger promo banners.
- **Specialty Shapes:** Use extremely high roundedness (3rem / 48px) for hero images and `rounded-full` for search bars, category icons, and circular floating action buttons to emphasize the soft, "pet-friendly" nature of the brand.

## Components
- **Buttons:** Primary buttons use `primary-container` background with white text and `shadow-glow`. Hover states should include a subtle lift (`-translate-y-1`) and a transition to a deeper `shadow-ambient`.
- **Product Cards:** Feature a background-subtle image container with a 1:1 aspect ratio. Include a "favorite" icon in the top right.
- **Category Icons:** Circular `rounded-full` avatars with a border that transitions from neutral to the primary color on hover.
- **Floating Action Button (FAB):** A 56x56px circular button in `secondary` green, anchored to the bottom right for immediate expert help.
- **Inputs:** Search bars use `rounded-full` with a subtle `outline-variant` border (30% opacity) and leading icons for a clean, modern look.
- **Promo Banners:** Use large `rounded-[2rem]` containers with organic background shapes (low-opacity blurs) to add visual interest without competing with text content.