const createStore = () => {
  let data = null;

  const initStore = async () => {
    if (data) {
      return data;
    }

    const res = await fetch(import.meta.env.VITE_API_URL);

    if (!res.ok) {
      throw new Error("Failed to load app data");
    }

    data = await res.json();
    return data;
  };

  const getStore = () => {
    if (!data) {
      throw new Error("Store not initialized. Call initStore() first.");
    }
    return data;
  };

  return {
    initStore,
    getStore,
  };
};

const store = createStore();

export const { initStore, getStore } = store;
