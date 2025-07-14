## Tivex

A Small, JSX library for creating Reactive-UIs.

[![ci](https://img.shields.io/github/actions/workflow/status/herudi/tivex/ci.yml?branch=master)](https://github.com/herudi/tivex)
[![npm version](https://img.shields.io/badge/npm-0.0.3-blue.svg)](https://npmjs.org/package/tivex)
[![License](https://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org)
[![download-url](https://img.shields.io/npm/dm/tivex.svg)](https://npmjs.org/package/tivex)
[![gzip](https://deno.bundlejs.com/badge?q=tivex&config={%22compression%22:%22brotli%22})](https://github.com/herudi/tivex)

## Core Concepts

`Tivex` uses Fine-Grained Reactivity as a strategy, instead of
DOM-Diffing/Virtual-DOM.

Tivex is reactive UI library that allows you to build user interfaces using JSX
syntax. It provides a simple and efficient way to create reactive components
without the overhead of a virtual DOM or complex state management systems. Tivex
is designed to be lightweight and easy to use, making it a great choice for
building modern web applications.

## Features

- **Fine-Grained Reactivity**: Automatically tracks dependencies and updates
  only the necessary parts of the UI.
- **JSX Syntax**: Write components using familiar JSX syntax, similar to React.
- **Simple State Management**: Use `$state` to create reactive state objects
  that automatically update the UI when changed.
- **Automatic Dependency Tracking**: Use `$effect` to create reactive effects
  that automatically re-run when their dependencies change.
- **Control Flow Components**: Use `<For>`, `<Show>`, `<Switch>`, and
  `<ErrorBoundary>` for conditional rendering and list rendering.
- **Lazy Loading**: Use `$lazy` to load components asynchronously, improving
  performance and reducing initial load time.
- **DOM Interaction**: Use `$mount` and `$unmount` for managing DOM interactions
  and cleanup.
- **Data Binding**: Use `bind:*` for two-way data binding in forms and inputs.
- **TypeScript Support**: Fully typed with TypeScript for better development
  experience and type safety.

## Create a Tivex Project

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

---

### What is Fine-Grained Reactivity?

Fine-grained reactivity minimizes unnecessary computations and DOM updates by
tracking dependencies at a granular level. When a state value changes, only the
computations or UI elements directly dependent on that value are updated,
avoiding the need to re-run entire components or functions.

Key benefits:

- **Performance**: Reduces redundant work, especially in large applications.
- **Simplicity**: Eliminates manual dependency management (e.g., React's
  `useMemo` or `useCallback`).
- **Predictability**: Changes propagate precisely to dependent parts of the
  application.

## Reactivity

`Signal` is the core of reactivity. inspired by
[@preact/signals](https://github.com/preactjs/signals).

### `$state(object)`

`$state` is a reactive state object. it is like `useState` in React, but
automatically tracks dependencies and updates the UI when the state changes.

`$state` is a Proxy object, so you can access the state properties directly. you
can use `$state` inside or outside components.

`Example 1: basic $state`

```tsx
import { $effect, $state, render } from 'tivex';

const state = $state({ count: 0 });

$effect(() => {
  console.log(`Count: ${state.count}`);
});

const Counter = () => {
  state.count++; // Logs: "Count: 1"
  state.count++; // Logs: "Count: 2"

  return <p>{state.count}</p>;
};

render(<Counter />, document.body);
```

`Example 2: peek/untrack`

```ts
import { $effect, $state, $untrack } from 'tivex';

const state = $state({ count: 0 });

// peek/untrack count.
$effect(() => {
  // peek
  console.log(`Count peek: ${state.$peek('count')}`);

  // untrack
  console.log(`Count untrack: ${$untrack(() => state.count + 2)}`);
});

state.count++; // no effect
state.count++; // no effect
```

`Example 3: reset and json in $state`.

```ts
import { $state } from 'tivex';

const user = $state({
  name: null,
  age: null,
});

user.name = 'John Doe';
user.age = 32;

console.log(user.$json()); // { name: "John Doe", age: 32 }

user.$reset();

console.log(user.$json()); // { name: null, age: null }
```

### `$effect(cb)`

`$effect` is a reactive effect that automatically tracks dependencies and
re-runs when the dependencies change. it is like `useEffect` in React, but
without the need to specify dependencies manually.

```ts
import { $effect, $state } from 'tivex';

const state = $state({ count: 0 });

$effect(() => {
  console.log(`Count: ${state.count}`);
});

state.count++; // Logs: "Count: 1"
state.count++; // Logs: "Count: 2"
```

`Cleanup Effect`

```ts
...

$effect(() => {
  const count = state.count;
  console.log(count);
  return () => {
    console.log("cleanup", count);
  }
});

...
```

`Dispose Effect`

```ts
...

const dispose = $effect(() => {...});

dispose();
// now, effect is disposed.

...
```

### `$batch(cb)`

`$batch` is used to batch multiple state updates into a single effect run. This
is useful for reducing the number of re-renders and improving performance when
updating multiple state properties at once.

```ts
import { $batch, $effect, $state } from 'tivex';

const state = $state({ x: 0, y: 0 });

$effect(() => {
  console.log(`x: ${state.x}, y: ${state.y}`);
});

$batch(() => {
  state.x = 1;
  state.y = 2;
}); // Logs: "x: 1, y: 2" (once)
```

### `$computed(cb)`

`$computed` is used to create a derived value that automatically updates when
its dependencies change. It is useful for creating values that depend on other
reactive state values and need to be recalculated when those values change.

```ts
import { $computed, $effect, $state } from 'tivex';

const user = $state({
  firstName: 'John',
  lastName: 'Doe',
});

const getFullname = $computed(() => `${user.firstName} ${user.lastName}`);

$effect(() => {
  console.log(`Fullname: ${getFullname()}`);
});

user.firstName = 'Jane'; // Logs: "Full name: Jane Doe"
user.lastName = 'Smith'; // Logs: "Full name: Jane Smith"
```

### `$ref(curValue?)`

`$ref` is a reactive reference that can be used to create a mutable reference to
a value. It is similar to `useRef` in React, but it automatically tracks
dependencies and updates the UI when the value changes. It is useful for
creating mutable references to values that need to be updated in the UI, such as
form inputs or DOM elements.

```tsx
import { $ref } from 'tivex';

const data = $ref('john');

data.current += ' doe';

console.log(data.current); // Logs: john doe
```

### `$mount(cb)`

`$mount` is used to run a callback function when the component is mounted. It is
useful for performing side effects or DOM manipulations when the component is
first rendered.

```tsx
import { $mount, $ref } from 'tivex';

const Home = () => {
  const input = $ref<HTMLInputElement>();

  // now, input is focused.
  $mount(() => {
    input.current.focus();
  });

  return <input ref={input} />;
};
```

### `$unmount(cb)`

`$unmount` is used to run a callback function when the component is unmounted.
It is useful for performing cleanup tasks or removing event listeners when the
component is no longer needed. It is similar to the cleanup function in
`useEffect` in React, but it is specifically designed for unmounting components
in Tivex.

```tsx
import { $effect, $unmount } from 'tivex';

const Home = () => {
  $unmount(() => {
    console.log('Cleanup Home from $unmount');
  });

  $effect(() => {
    return () => {
      console.log('Cleanup Home from $effect');
    };
  });

  return <h1>Home</h1>;
};
```

### `$context(ctx)`

`$context` is used to access the current context value in a component. It is
similar to React's `useContext` hook, but it is designed for Tivex's reactive
system. It allows you to access the state provided by a context in components,
making it easy to share state across components without prop drilling.

```tsx
import { $context, $state, createContext } from 'tivex';

const ThemeContext = createContext();

const InnerComponent = () => {
  const theme = $context(ThemeContext);
  return <div>Current theme: {theme.value}</div>;
};

const App = () => {
  const themeState = $state({ value: 'light' });

  const switchTheme = () => {
    themeState.value = themeState.value === 'light' ? 'dark' : 'light';
  };
  return (
    <div>
      <h1>My App</h1>
      <button onClick={switchTheme}>Switch Theme</button>
      <ThemeContext state={themeState}>
        <InnerComponent />
      </ThemeContext>
    </div>
  );
};
```

### `bind:*` for data-binding

`bind:*` is used for two-way data binding in forms and inputs. It allows you to
bind the value of an input element to a reactive state property, so that when
the input value changes, the state property is automatically updated, and vice
versa. This is similar to the `value` and `onChange` props in React, but it is
more concise and easier to use in Tivex.

```tsx
const UserForm = () => {
  const user = $state({
    name: null,
    age: null,
    gender: null,
  });

  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    console.log(user.$json());
    user.$reset();
  };

  return (
    <form onSubmit={submit}>
      <input bind:value={user.name} placeholder="Name" />
      <input bind:value={user.age} type="number" placeholder="Age" />
      <select bind:value={user.gender}>
        <option>---</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};
```

### `$lazy(importFn)`

`$lazy` is used to load components asynchronously, improving performance and
reducing initial load time. It is similar to `React.lazy` but designed for
Tivex. It allows you to define a component that will be loaded only when it is
needed, which can help reduce the initial bundle size and improve the loading
speed of your application.

> Note: `$lazy` requires `<Suspense>`.

```tsx
import { $lazy } from 'tivex';
import { Suspense } from 'tivex/flow';

const Home = $lazy(() => import('./Home'));

const App = () => {
  return (
    <div>
      <h1>My App</h1>
      <Suspense fallback={<div>loading...</div>}>
        <Home />
      </Suspense>
    </div>
  );
};
```

## Control-Flow

Control-flow components are used to manage the rendering of UI elements based on
conditions or lists. They provide a way to conditionally render elements,
iterate over lists, and handle asynchronous loading of components. Tivex
provides several control-flow components, including `<For>`, `<Show>`,
`<Switch>`, `<Match>`, and `<ErrorBoundary>`.

Control-Flow inspired by
[solid-js](https://docs.solidjs.com/concepts/control-flow/list-rendering).
import control-flow from `tivex/flow`.

### `<For>`

The `<For>` component is used for iterating over a list of items and rendering
each item in the list. It takes an `each` prop that defines the list to iterate
over, and it can also take a `fallback` prop that defines what to render when
the list is empty. The children of the `<For>` component are rendered for each
item in the list, and the current item and index are passed as arguments to the
children function. It is <i>recommended</i> if your array is interactive with
`add`/`update`/`delete`.

```tsx
import { For } from 'tivex/flow';

const User = () => {
  const state = $state({ users: [] });

  return (
    <For each={state.users} fallback={<div>No Data</div>}>
      {(user, i) => {
        return (
          <div>
            <p>ID: {i}</p>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
          </div>
        );
      }}
    </For>
  );
};
```

### `<Suspense>`

The `<Suspense>` component is used to handle asynchronous loading of components.
It takes a `fallback` prop that defines what to render while the component is
loading. The children of the `<Suspense>` component are the components that will
be loaded asynchronously. It allows you to define a loading state for components
that are loaded asynchronously, which can help improve the user experience by
providing feedback while the component is loading.

```tsx
import { $lazy } from 'tivex';
import { Suspense } from 'tivex/flow';

const Home = $lazy(() => import('./Home'));

const App = () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Home />
    </Suspense>
  );
};
```

`Handle Async Component`

```tsx
import { $computed, type AsyncFC } from 'tivex';
import { Suspense } from 'tivex/flow';

const AsyncComp: AsyncFC = async () => {
  const user = await fetch('https://api.com/users').then((res) => res.json());

  return $computed(() => {
    $effect(() => {
      console.log(user);
    });

    return (
      <div>
        <p>Name: {user.name}</p>
        <p>Age: {user.age}</p>
      </div>
    );
  });
};

const App = () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <AsyncComp />
    </Suspense>
  );
};
```

### `<Show>`

The `<Show>` component is used for conditionally rendering UI elements. It takes
a when prop that defines the condition for rendering. When the when prop is
truthy, the children of the `<Show>` component are displayed. Additionally, an
optional fallback prop can be provided to specify an element that is shown when
the condition is falsy.

```tsx
import { Show } from 'tivex/flow';

<Show when={state.show} fallback={<p>Falsy</p>}>
  <p>Truthy</p>
</Show>;
```

### `<Switch>` & `<Match>`

The `<Switch>` component is used for conditional rendering based on multiple
conditions. It takes a fallback prop that defines what to render when none of
the conditions match. Inside the `<Switch>`, you can use `<Match>` components to
define individual conditions. Each `<Match>` takes a when prop that specifies
the condition to match. When a condition is met, the corresponding children of
the `<Match>` component are rendered. If no conditions match, the fallback
content of the `<Switch>` is displayed. This is similar to a switch statement in
JavaScript, where you can have multiple cases and a default case.

```tsx
import { Match, Switch } from 'tivex/flow';

<Switch fallback={<p>Default {state.count}</p>}>
  <Match when={state.count === 2}>
    <p>Count is two</p>
  </Match>
  <Match when={state.count > 5 && state.count <= 10}>
    <p>Greather then 5 and Less then equals 10</p>
  </Match>
  <Match when={state.count > 10}>
    <p>Greather then 10</p>
  </Match>
</Switch>;
```

### `<ErrorBoundary>`

The `<ErrorBoundary>` component is used to catch errors in the component tree
and display a fallback UI when an error occurs. It takes a fallback prop that
defines what to render when an error is caught. The children of the
`<ErrorBoundary>` are the components that will be monitored for errors. If an
error occurs in any of the children, the fallback UI is displayed instead of the
erroring component.

`Simple Catch`

```tsx
import { ErrorBoundary } from "tivex/flow";

function Comp() {

  throw new Error("Bad Component!");

  return "Foo"
}

const App = () => {
  return (
    <div>
      <h1>My App</div>
      <ErrorBoundary fallback={err => <h1>{err}</h1>}>
        <Comp/>
      </ErrorBoundary>
    </div>
  )
}
```

`Using <Throw>`

```tsx
import { $state } from "tivex";
import { ErrorBoundary, Show, Throw } from "tivex/flow";

function Counter() {
  const state = $state({ count: 0 });

  return (
    <div>
      <button onClick={() => state.count++}>
        increment
      </button>
      <Show
        when={state.count < 5}
        fallback={<Throw error={`Bad value for ${state.count}`} />}
      >
        <p>{state.count}</p>
      </Show>
    </div>
  );
}

const App = () => {
  return (
    <div>
      <h1>My App</div>
      <ErrorBoundary fallback={err => <h1>{err}</h1>}>
        <Counter/>
      </ErrorBoundary>
    </div>
  )
}
```

### Example Todo App

```tsx
import { $batch, $state, render } from 'tivex';
import { For } from 'tivex/flow';

type Todo = { name: string };
type MyState = { todos: Todo[] };

const Todo = () => {
  const state = $state<MyState>({ todos: [] });
  const todo = $state<Todo>({ name: '' });

  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    $batch(() => {
      state.todos = [todo.$json(), ...state.todos];
      todo.$reset();
    });
  };

  const remove = (i: number) => () => {
    const prev = [...state.todos];
    prev.splice(i, 1);
    state.todos = prev;
  };

  return (
    <div>
      <form onSubmit={submit}>
        <input bind:value={todo.name} />
        <button type="submit">Add</button>
      </form>
      <For each={state.todos} fallback={<div>No Data</div>}>
        {(todo, i) => {
          return (
            <div>
              <p>Task: {todo.name}</p>
              <button onClick={remove(i)}>remove</button>
            </div>
          );
        }}
      </For>
    </div>
  );
};

render(<Todo />, document.body);
```

---

## Props

Props in Tivex are reactive `$computed` and behind the Proxy is because it needs
to update reactivity. can be used to pass data to components.

> Props are not supported for destructuring when updating reactivity.

```tsx
import { $state, render } from 'tivex';

const Double = (props) => <p>{props.double}</p>;

const Counter = () => {
  const state = $state({ count: 0 });

  return (
    <div>
      <button onClick={() => state.count++}>increment</button>
      <p>{state.count}</p>
      <Double double={state.count * 2} />
    </div>
  );
};
render(<Counter />, document.body);
```

```tsx
// ☑️
const Double = (props) => <p>{props.double}</p>;

// ❌ because tivex only one render
const Double = ({ double }) => <p>{double}</p>;

// ☑️
const Double = ({ $props }) => <p>{$props.double}</p>;
```

### `props.$props`

`$props` is original props.

### `props.$set`

`$set` is used to update props before updating reactivity.

```tsx
const Double = (props) => {
  props.$set({ double: (prev) => prev + 10 });
  return <p>{props.double}</p>;
};
```

### `props.$default`

`$default` is used to set default props for a component. it is called when the
component is first rendered and can be used to set initial values for props.

```tsx
const Double = (props) => {
  props.$default({ double: 0 });
  return <p>{props.double}</p>;
};
```

### `props.children`

`children` is used to pass children elements to a component. it is similar to
the `children` prop in React, but it is reactive and can be used to update the
children dynamically.

```tsx
const Wrapper = (props) => {
  return (
    <div>
      <h1>Wrapper</h1>
      {props.children}
    </div>
  );
};
const App = () => {
  return (
    <Wrapper>
      <p>This is a child element</p>
    </Wrapper>
  );
};
render(<App />, document.body);
```

## Limitation

### Behind the transform

Tivex uses a transform to convert JSX into a reactive format. This means that
some features of JSX may not work as expected, or may require additional syntax
to work correctly. For example, you cannot use JSX expressions directly in the
children of a component, and you need to use a function to access the state
properties.

```tsx
// before
<h1>{state.count} x 2 = {state.count * 2}</h1>

// after
<h1>{()=> state.count} x 2 = {()=> state.count * 2}</h1>
```

## Thanks and Inspired By

- [@preact/signals](https://github.com/preactjs/signals)
- [solid-js](https://www.solidjs.com/)

## License

[MIT](LICENSE)
