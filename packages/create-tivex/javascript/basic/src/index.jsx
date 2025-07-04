import './style.css';

import { $state, render } from 'tivex';
import { Show } from 'tivex/flow';
import { Counter } from './Counter';

function App() {
  const state = $state({ show: false });

  return (
    <>
      <h1>Tivex App</h1>
      <div className="card">
        <button type="button" onClick={() => (state.show = !state.show)}>
          {state.show ? 'Stop' : 'Start'} Counter
        </button>
      </div>
      <Show when={state.show}>
        <Counter />
      </Show>
      <p className="footer">
        Thanks for using{' '}
        <a href="https://github.com/herudi/tivex" target="_blank">
          tivex
        </a>
        .
      </p>
    </>
  );
}

render(<App />, document.getElementById('app'));
