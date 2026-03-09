# Repo Mapping

Use this file to pick the correct Base UI primitive before refactoring.

| Current file | Current pattern | Target primitive | Guidance |
| --- | --- | --- | --- |
| `src/components/ui/dialog.tsx` | Hand-rolled modal with body scroll lock and manual Escape handling | `Dialog` | Replace custom focus/dismiss logic with Base UI parts. Export a local wrapper module under `src/components/ui`. |
| `src/routes/settings.tsx` | Inline destructive confirmation UI and file-input trigger flow | `Alert Dialog`, `Toast`, `Button` | Use `Alert Dialog` for clear-data confirmation. Consider `Toast` for import/export status once the app adopts transient notifications. |
| `src/components/ui/input.tsx` | Bare input wrapper with no label or error composition | `Field`, `Input` | Keep a styled input wrapper, but document that labeled usage should compose through `Field`. |
| `src/components/review/review-form.tsx` | Unlabeled textarea with ad hoc save/cancel state | `Field` plus textarea-style wrapper | Add explicit label, description, and error hooks instead of relying on placeholder text. |
| `src/components/tv/season-accordion.tsx` | Manual accordion built from buttons and state | `Accordion` | Let Base UI own disclosure semantics, expanded state, and keyboard behavior. |
| `src/components/media/media-list-filters.tsx` | Native `<select>` plus plain button toggles | `Select`, `Radio` or `Toggle Group` | Use `Select` for sort. Use `Radio` or `Toggle Group` only if the semantics match the type filter. |
| `src/components/media/status-picker.tsx` | Button row acting like single-choice selection | `Radio` or `Toggle Group` | Prefer value-selection semantics over generic buttons. Preserve the visual status chips. |
| `src/components/review/star-rating.tsx` | Unlabeled star buttons with hover-only preview | `Radio`-style rating control | Implement discrete choice semantics and expose the current value to assistive tech. |
| `src/components/media/search-input.tsx` | Search field with unlabeled clear icon button | `Field`, `Input`, `Button` | Keep clear action keyboard-accessible and named. |
| `src/components/media/media-card.tsx` | Hover-only quick-add actions over poster | `Button`, `Tooltip`, `Menu` as needed | Do not leave quick actions hover-only. Add keyboard/touch access and accessible names. |
| `src/components/tv/episode-list.tsx` | Entire row is a toggle button | `Checkbox` or button pattern with explicit state | Preserve fast toggling, but expose watched state clearly. |
| `src/routes/__root.tsx` | Router nav links | Native links | Keep route navigation as links, not menu primitives. |

## Migration Order

1. Move overlays to `Dialog` and `Alert Dialog`.
2. Standardize field composition for text inputs and textareas.
3. Replace disclosure UI with `Accordion`.
4. Replace value-selection button groups with `Radio`, `Select`, or `Toggle Group`.
5. Fix hover-only and icon-only actions.
