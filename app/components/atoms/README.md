# Atoms

Atoms are the smallest reusable UI components.

They represent a single UI element with minimal logic and should be easy to reuse throughout the application.

## Characteristics

- Single responsibility
- Highly reusable
- No business logic
- No data fetching
- No store access
- Configured through props and emits

## Examples

- Button.vue
- Input.vue
- Badge.vue
- Avatar.vue
- Icon.vue
- Spinner.vue

## Guidelines

✅ Keep components simple.

✅ Use props for customization.

✅ Emit events instead of handling application logic.

❌ Don't import stores.

❌ Don't call APIs.

❌ Don't depend on larger components.