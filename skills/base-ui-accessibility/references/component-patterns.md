# Component Patterns

Target official Base UI docs for the current stable release line. Start from these pages:

- Quick start: <https://base-ui.com/react/overview/quick-start.md>
- Accessibility: <https://base-ui.com/react/overview/accessibility.md>
- Dialog: <https://base-ui.com/react/components/dialog.md>
- Alert Dialog: <https://base-ui.com/react/components/alert-dialog.md>
- Field: <https://base-ui.com/react/components/field.md>
- Input: <https://base-ui.com/react/components/input.md>
- Accordion: <https://base-ui.com/react/components/accordion.md>
- Select: <https://base-ui.com/react/components/select.md>
- Checkbox: <https://base-ui.com/react/components/checkbox.md>
- Radio: <https://base-ui.com/react/components/radio.md>
- Switch: <https://base-ui.com/react/components/switch.md>
- Toggle Group: <https://base-ui.com/react/components/toggle-group.md>
- Popover: <https://base-ui.com/react/components/popover.md>
- Menu: <https://base-ui.com/react/components/menu.md>
- Tooltip: <https://base-ui.com/react/components/tooltip.md>
- Toast: <https://base-ui.com/react/components/toast.md>

## Dialog and Alert Dialog

- Use `Dialog` for regular modal content and `Alert Dialog` for destructive confirmation.
- Export compound wrappers that preserve Base UI parts such as `Root`, `Trigger`, `Portal`, `Backdrop`, `Popup`, `Title`, `Description`, and `Close`.
- Stop writing custom Escape handlers, body scroll locking, and focus-trap logic when Base UI already owns that behavior.

## Field and Input

- Build labeled controls with `Field.Root`, `Field.Label`, optional description text, and error text.
- Keep a local `Input` wrapper for styling, but treat the label and description as part of the control contract.
- Apply the same pattern to textarea-style wrappers even if the repo keeps textarea as an app-owned primitive.

## Accordion

- Replace manual disclosure state with `Accordion.Root`, `Accordion.Item`, `Accordion.Header`, `Accordion.Trigger`, and `Accordion.Panel`.
- Style expanded state with group and `data-*` attributes instead of local class toggles.

## Select

- Use `Select` for predefined value selection such as sort order.
- Keep the trigger, popup, list, and item styling local, but let Base UI handle highlighting, selection, positioning, and keyboard movement.

## Radio, Checkbox, Switch, and Toggle Group

- Use `Radio` when exactly one option should be selected.
- Use `Checkbox` for independent on or off choices.
- Use `Switch` only for binary settings, not generic selection.
- Use `Toggle Group` for pressed-state button groups when the UI is still conceptually a set of toggles.

## Popover, Menu, and Tooltip

- Use `Popover` for anchored contextual content.
- Use `Menu` for lists of actions, not for route navigation.
- Use `Tooltip` only as extra help for already-labeled controls.

## Toast

- Use `Toast` for non-blocking success or informational feedback such as import or export completion.
- Keep blocking or destructive confirmation in `Dialog` or `Alert Dialog`.
