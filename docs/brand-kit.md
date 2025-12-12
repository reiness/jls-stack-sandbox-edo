# Identity: Name, Purpose, Tone

## Product Name
Art Box

## One-Line Purpose
An art playground where JLS devs learn to build stack-aligned apps quickly and correctly.

## Three Adjectives
Playful, Myriad, Cartoony

---

# Visual Tokens: Colors, Type, Spacing, Radii

## Color Tokens
* **primary** (Purple 500 - #a855f7)
  * usage: primary buttons, key CTAs
  * classes: bg-primary text-primary-foreground border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all rounded-lg font-black tracking-wide
* **background** (Yellow 100 - #fef9c3)
  * usage: main app background
  * classes: bg-background text-foreground font-medium
* **surface** (White - #ffffff)
  * usage: cards, panels, sections
  * classes: bg-card border-2 border-border shadow-hard rounded-3xl p-6
* **accent** (Sky 400 - #38bdf8)
  * usage: badges, highlights, secondary buttons
  * classes: bg-accent text-accent-foreground border-2 border-border shadow-hard-sm rounded-lg font-bold hover:bg-accent/80
* **border** (Black - #000000)
  * usage: dividers, borders
  * classes: border-2 border-border
* **muted-text** (Slate 500 - #64748b)
  * usage: muted text, disabled states
  * classes: text-muted-foreground font-bold opacity-80
* **danger** (Red 500 - #ef4444)
  * usage: error states
  * classes: bg-destructive text-destructive-foreground border-2 border-border shadow-hard rounded-xl font-bold

---

## Font Family
* **main**:
  * usage: default font for headers and body
  * source: Google Fonts (Fredoka)
  * classes: font-['Fredoka']

## Type Scale
* **pageTitle**:
  * usage: top-level page headings
  * classes: text-3xl font-bold tracking-tight text-foreground
* **sectionTitle**:
  * usage: section headings inside a page
  * classes: text-xl font-semibold text-foreground
* **cardTitle**:
  * usage: titles inside cards
  * classes: text-sm font-semibold text-foreground
* **body**:
  * usage: normal text
  * classes: text-sm text-foreground
* **small**:
  * usage: helper text, labels
  * classes: text-xs text-muted-foreground

---

## Spacing & Radii
* **sectionGap**:
  * usage: vertical space between main sections
  * classes: space-y-8
* **cardPadding**:
  * usage: standard card inner padding
  * classes: p-6
* **compactCardPadding**:
  * usage: small cards or badges
  * classes: p-3
* **cornerRadius**:
  * usage: cards, modals, containers
  * classes: rounded-lg (maps to --radius: 0.75rem)