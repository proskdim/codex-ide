# TailwindCSS Rules

- Always use Tailwind classes for styling HTML elements; avoid using custom CSS or inline styles.
- Use Tailwind's utility-first approach and leverage composition over inheritance.
- Prioritize readability by using consistent ordering of utility classes
- Apply proper responsive design using Tailwind's responsive prefixes (sm:, md:, lg:, xl:).
- Use Container Queries (`@container`, `@md:`) for reusable components to ensure they adapt to their parent size.
- Always use DaisyUI for components.
- Use Tailwind's state variants (:hover, :focus, :active, etc.) consistently.
- Strict Class Ordering: Follow the official Tailwind Prettier plugin order:
    1. Layout (position, z-index, display, flex/grid)
    2. Spacing (margin, padding, gap)
    3. Sizing (width, height)
    4. Typography (font, text alignment)
    5. Colors & Backgrounds
    6. Effects (shadow, opacity)
    7. Variants (hover:, focus:, dark:, sm:)
- Interactive States: Consistently use state variants (`hover:`, `focus-visible:`, `active:`, `disabled:`). Use `group-hover` and `peer-hover` for complex interactions.
- Performance: Avoid arbitrary values (e.g., `h-[123px]`) unless absolutely necessary. Use the standard spacing scale.
