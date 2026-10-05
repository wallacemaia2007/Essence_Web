<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Visual theme convention

Use `ThemedSection` from `src/components/common` as the source of truth for
section-level brand themes. Alternate `theme="patrimony"` and
`theme="territory"` between adjacent home sections and internal page blocks;
never add two neighboring content sections with the same theme. The global
header, home hero, and footer are the fixed patrimony/beige frame around the
alternating content flow. The section wrapper owns local CSS variables for
background, foreground, brand accents, card colors, and list bullets,
independent of the global `.dark` mode.
