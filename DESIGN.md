# Design System Document
 
## 1. Overview & Creative North Star: "The Digital Orchard"
 
This design system is built to bridge the gap between the raw, tactile world of agriculture and the precision of modern e-commerce. Our Creative North Star is **"The Digital Orchard"**—an editorial-first approach that favors organic breathing room over dense grids and tonal depth over rigid lines.
 
By moving away from "template-style" layouts, we evoke a sense of premium craftsmanship. We use **intentional asymmetry**, where high-quality agricultural imagery breaks the bounds of containers, and **tonal layering**, where the UI feels like stacked sheets of fine organic paper. This system doesn't just sell produce; it narrates the provenance of the land through a sophisticated, high-end digital experience.
 
---
 
## 2. Colors: Tonal Earth & Organic Depth
 
The palette is rooted in the deep forest and fertile soil, utilizing a sophisticated Material 3-based logic to ensure harmony and accessibility.
 
### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off content. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` (#f2f4f0) section should sit directly against a `surface` (#f8faf5) background. This creates a "soft edge" that feels organic and premium.
 
### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
- **Base Layer:** `surface` (#f8faf5)
- **Secondary Sections:** `surface-container-low` (#f2f4f0)
- **Interactive Cards:** `surface-container-lowest` (#ffffff)
- **Elevated Modals:** `surface-container-highest` (#e1e3df)
 
### The "Glass & Gradient" Rule
To add "soul" to the interface, use Glassmorphism for floating navigation elements and the 'Cultiv-IA' interface. 
- **Glass Effect:** Combine `surface` colors at 70% opacity with a `backdrop-blur` of 12px-20px.
- **Signature Textures:** For primary CTAs and Hero accents, use a subtle linear gradient from `primary` (#012d1d) to `primary-container` (#1b4332) at a 135-degree angle. This prevents the "flat" look of standard buttons.
 
---
 
## 3. Typography: The Editorial Voice
 
We pair the geometric authority of **Plus Jakarta Sans** for headers with the high-legibility of **Inter** for functional text.
 
*   **Display & Headlines (Plus Jakarta Sans):** These are our "Editorial Moments." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create an authoritative, magazine-like feel.
*   **Body & Titles (Inter):** Reserved for the "Functional Layer." `body-lg` (1rem) provides a clean, neutral balance to the expressive headers.
*   **Hierarchy as Identity:** Always lead with a large `headline-lg` in `primary` (#012d1d) followed by a generous `body-lg` in `on-surface-variant` (#414844). The contrast between the deep green and soft grey conveys a professional yet organic tone.
 
---
 
## 4. Elevation & Depth: Tonal Layering
 
We eschew traditional shadows in favor of **Tonal Layering**, creating a "soft lift" that feels natural.
 
*   **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f2f4f0) background. This 2% shift in brightness is enough to define a container without a harsh border.
*   **Ambient Shadows:** If a floating element (like a Cart or 'Cultiv-IA' bubble) requires a shadow, it must be "Ambient."
    *   *Shadow Specs:* `0px 12px 32px rgba(25, 28, 26, 0.06)`. 
    *   Never use pure black or grey; the shadow is a low-opacity version of `on-surface`.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` (#c1c8c2) at 15% opacity. Standard 100% opaque borders are strictly forbidden.
 
---
 
## 5. Components
 
### Primary Buttons
- **Style:** High-gloss gradient (Primary to Primary-Container), `xl` (1.5rem) rounded corners.
- **Interaction:** On hover, the button should lift slightly using an Ambient Shadow.
 
### Pricing & Quantity Selectors
- **Pricing:** Use `title-lg` for the currency value. Place the price on a `surface-container-highest` chip to make it feel like a "price tag" rather than a text string.
- **Selectors:** Use a horizontal "pill" shape (`full` roundedness) with `secondary-container` (#91f78e) for the increment/decrement icons.
 
### 'Cultiv-IA' Assistant
- **Visual Identity:** This feature uses the "Glass & Gradient" rule. The chat bubble should be a semi-transparent `tertiary-container` (#543600) with a heavy backdrop blur.
- **Typography:** Uses `label-md` for AI status and `body-sm` for chat text to distinguish it from the main commerce flow.
 
### Cards & Lists
- **Forbid Dividers:** Do not use horizontal lines. Separate product items using vertical white space (32px or 48px) and subtle shifts in surface color.
- **Imagery:** Product images should have a `md` (0.75rem) corner radius and sit slightly offset from the card center to embrace asymmetry.
 
---
 
## 6. Do’s and Don’ts
 
### Do:
*   **Do** use overlapping elements (e.g., an image of a leaf slightly covering a headline) to create depth.
*   **Do** embrace massive amounts of white space (minimum 80px between major sections).
*   **Do** use `secondary` (#006e1c) and `tertiary` (#372200) as "Earth Accents" for labels and highlights, keeping `primary` for the core brand presence.
 
### Don’t:
*   **Don’t** use 1px solid borders. It breaks the organic "Digital Orchard" feel.
*   **Don’t** use harsh, high-opacity shadows. Depth should feel like natural sunlight.
*   **Don’t** center-align everything. Use left-aligned editorial layouts to maintain a high-end look.
*   **Don’t** use standard "Select" dropdowns for quantities; use the custom pill-shaped selectors defined in the components section.