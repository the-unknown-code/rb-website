# Molecules

Molecules combine multiple atoms into a reusable UI component.

They provide a single feature while remaining generic enough to be reused.

## Characteristics

- Built from atoms
- Small amount of UI logic
- Reusable
- Stateless whenever possible

## Examples

- SearchBar.vue
- FormField.vue
- Dropdown.vue
- Pagination.vue

## Guidelines

✅ Compose atoms.

✅ Accept data through props.

✅ Emit actions to parent components.

❌ Don't fetch data.

❌ Don't contain page-specific logic.