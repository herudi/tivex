## Tivex

A Small, JSX library for creating Reactive-UIs.

## Core Concepts

`Tivex` uses Fine-Grained Reactivity as a strategy, instead of
DOM-Diffing/Virtual-DOM.

Tivex is reactive UI library that allows you to build user interfaces
using JSX syntax. It provides a simple and efficient way to create reactive
components without the overhead of a virtual DOM or complex state management
systems. Tivex is designed to be lightweight and easy to use, making it a great choice for building modern web applications.

## Features

- **Fine-Grained Reactivity**: Automatically tracks dependencies and updates
  only the necessary parts of the UI.
- **JSX Syntax**: Write components using familiar JSX syntax, similar to React.
- **Simple State Management**: Use `$state` to create reactive state objects
  that automatically update the UI when changed.
- **Automatic Dependency Tracking**: Use `$effect` to create reactive effects
  that automatically re-run when their dependencies change.
- **Control Flow Components**: Use `<For>`, `<Show>`, `<Switch>`, and `<ErrorBoundary>` for conditional rendering and list rendering.
- **Lazy Loading**: Use `$lazy` to load components asynchronously, improving
  performance and reducing initial load time.
- **DOM Interaction**: Use `$mount` and `$unmount` for managing DOM interactions
  and cleanup.
- **Data Binding**: Use `bind:*` for two-way data binding in forms and inputs.
- **TypeScript Support**: Fully typed with TypeScript for better development
  experience and type safety.

## Create a tivex project

```bash
npm create tivex
```

## Usage

```tsx
import { $effect, $state, render } from 'tivex';

function Counter() {
  const state = $state({ count: 0 });

  $effect(() => {
    console.log(state.count);
  });

  console.log('Only one render');

  return (
    <div>
      <button onClick={() => state.count++}>increment</button>
      <h1>
        {state.count} x 2 = {state.count * 2}
      </h1>
    </div>
  );
}

render(<Counter />, document.body);
```

more docs => https://github.com/herudi/tivex
