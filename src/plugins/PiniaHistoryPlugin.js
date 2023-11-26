import { ref, reactive } from "vue";
export default function PiniaHistoryPlugin({ pinia, app, store, options }) {
  if (!options.historyEnabled) return;
  const history = reactive([]);
  const isHistoryMode = ref(false);
  history.push(JSON.stringify(store.$state));
  const future = reactive([]);
  store.$subscribe((mutation, state) => {
    if (isHistoryMode.value) return;
    history.push(JSON.stringify(state));
    future.splice(0, future.length); // reset future
  });
  return {
    undo: () => {
      if (history.length === 1) return;
      isHistoryMode.value = true;
      future.push(history.pop());
      store.$state = JSON.parse(history.at(-1));
      isHistoryMode.value = false;
    },
    redo: () => {
      const latestState = future.pop();
      if (!latestState) return;
      isHistoryMode.value = true;
      history.push(latestState);
      store.$state = JSON.parse(latestState);
      isHistoryMode.value = false;
    },
  };
}

// https://pinia.vuejs.org/core-concepts/plugins.html
