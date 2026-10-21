# Organisms

Organisms are larger UI components composed of atoms and molecules.

They represent meaningful parts of the interface and may manage local UI state.

## Characteristics

- Built from atoms and molecules
- Can manage local state
- Reusable across pages

## Examples

- NavigationBar.vue
- LoginForm.vue
- ProductGrid.vue

## Guidelines

✅ Compose smaller components.

✅ Handle local UI interactions.

✅ Receive data through props.

❌ Avoid direct API calls.

❌ Avoid route-specific logic.