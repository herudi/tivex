import { $effect, $state, $unmount, type FC } from 'tivex';

export const Counter: FC = () => {
  const state = $state({ count: 0 });

  const i = setInterval(() => {
    state.count++;
  }, 1000);

  $effect(() => {
    console.log('Count Is: ', state.count);
  });

  $unmount(() => {
    console.log('clear', i);
    clearInterval(i);
  });

  return (
    <div>
      <h2>Count Is {state.count}</h2>
      <h2>Double Is {state.count * 2}</h2>
    </div>
  );
};
