# Tailwind v3 Compatibility

This repo uses Tailwind CSS `3.4.17`. Base UI docs examples are close, but not every utility token can be copied verbatim.

## Safe to Keep

- Arbitrary `data-[...]` variants such as `data-[popup-open]:...`
- Arbitrary `supports-[...]` variants such as `supports-[-webkit-touch-callout:none]:...`
- Arbitrary values such as `bg-[canvas]`, `origin-[var(--transform-origin)]`, and `h-[var(--accordion-panel-height)]`

## Convert Before Copying

- Convert `z-1` to `z-[1]`
- Convert `outline-1` to `outline-[1px]`
- Convert `-outline-offset-1` to `outline-offset-[-1px]`

## Conversion Rules

- Replace unsupported scale, z-index, or outline tokens with arbitrary values instead of changing Tailwind config for one component.
- Preserve Base UI state hooks such as `data-[starting-style]`, `data-[ending-style]`, and `data-[highlighted]` because they are part of the component behavior and animation model.
- Keep the docs' accessibility-driven state styling even if the exact utility spelling changes for Tailwind v3.

## Example

Use this style of translation when copying from docs:

```tsx
className="focus-visible:z-[1] outline outline-[1px] outline-offset-[-1px]"
```
