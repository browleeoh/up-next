---
name: base-ui-accessibility
description: Repo-specific guidance for building and refactoring accessible React primitives in Up Next using @base-ui/react. Use when replacing hand-rolled controls, dialogs, accordions, selects, fields, ratings, toggles, menus, tooltips, or other accessibility-sensitive UI in this app, especially when preserving the src/components/ui wrapper layer and Tailwind CSS v3 compatibility.
---

# Base UI Accessibility

## Overview

Use this skill to replace custom accessibility behavior with Base UI primitives while keeping the repo's local design-system seam intact.

## Default Workflow

1. Inspect the current component and its call sites before choosing a replacement primitive.
2. Keep reusable primitives under `src/components/ui` so feature code does not drift into one-off Base UI usage.
3. Prefer Base UI-managed keyboard, focus, dismissal, and ARIA behavior over custom `useState` plus DOM event logic.
4. Preserve app behavior first, then restyle with Tailwind classes and Base UI `data-*` attributes.
5. Verify the interaction with keyboard-only navigation, visible focus, and a screen-reader-friendly accessible name.

## Repo Rules

- Use thin wrappers for shared primitives. Preserve current imports from `@/components/ui/*` where possible.
- Export compound primitives with Base UI-style parts instead of inventing new boolean-only APIs unless a temporary compatibility shim is necessary.
- Keep links for navigation and buttons for actions.
- Wrap labeled controls with `Field` or `Fieldset`. Do not rely on placeholders as labels.
- Give every icon-only button an accessible name with visible text or `aria-label`.
- Treat hover-only actions as incomplete until there is a keyboard and touch path.
- Use `Tooltip` only for supplemental help, never as the only label.
- Style state with Base UI attributes such as `data-[popup-open]`, `data-[highlighted]`, or `data-[starting-style]` instead of ad hoc state classes when possible.

## Primitive Selection

- Use `Dialog` for standard modals and `Alert Dialog` for destructive confirmation.
- Use `Accordion` or `Collapsible` for disclosure UI instead of manual open-state buttons.
- Use `Field`, `Input`, `Checkbox`, `Radio`, `Switch`, `Select`, and `Number Field` for form controls.
- Use `Select` for the current sort-dropdown pattern.
- Use `Toggle Group` only when the UI is a pressed-state control group. Use `Radio` or `Select` when the user is choosing one value from a set.
- Use `Popover` or `Menu` for anchored action surfaces. Do not repurpose them for route navigation unless the interaction is actually a menu.
- Use `Toast` for non-blocking success or info feedback, not for critical confirmation.

## Tailwind v3 Rules

The app uses Tailwind CSS `3.4.17`. Base UI docs are generally compatible, but convert unsupported utility tokens before copying examples.

- Convert `z-1` to `z-[1]`.
- Convert `outline-1` to `outline-[1px]`.
- Convert `-outline-offset-1` to `outline-offset-[-1px]`.
- Keep arbitrary `data-[...]`, `supports-[...]`, and CSS variable classes when Tailwind accepts them.
- If a docs example uses a token Tailwind v3 does not ship, replace it with an arbitrary value instead of extending Tailwind for a one-off case.

Read [references/tailwind-v3-compat.md](references/tailwind-v3-compat.md) when copying Base UI examples.

## Repo Targets

Start with the mappings in [references/repo-mapping.md](references/repo-mapping.md). The current high-value targets are:

- `src/components/ui/dialog.tsx`
- `src/routes/settings.tsx`
- `src/components/ui/input.tsx`
- `src/components/review/review-form.tsx`
- `src/components/tv/season-accordion.tsx`
- `src/components/media/media-list-filters.tsx`
- `src/components/media/status-picker.tsx`
- `src/components/review/star-rating.tsx`

Read [references/component-patterns.md](references/component-patterns.md) for the current app set of Base UI primitives and official docs links.

## Acceptance Checklist

- Confirm every interactive element has a programmatic name.
- Confirm keyboard-only operation works without hover.
- Confirm focus is visible and restored or trapped correctly for overlays.
- Confirm labels, descriptions, and errors are associated with the control.
- Confirm disabled, selected, and expanded states are announced correctly.
- Confirm touch and mobile behavior still works after the refactor.
