const createStore = () => {
  let data = null;

  const resolveDataUrl = () => {
    const env = import.meta?.env ?? {};
    const explicitUrl = typeof env.VITE_API_URL === "string" ? env.VITE_API_URL.trim() : "";

    if (explicitUrl) {
      return explicitUrl;
    }

    const baseUrl = typeof env.BASE_URL === "string" && env.BASE_URL ? env.BASE_URL : "./";
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    return `${normalizedBaseUrl}data.json`;
  };

  const initStore = async () => {
    if (data) {
      return data;
    }

    const dataUrl = resolveDataUrl();
    const res = await fetch(dataUrl);

    if (!res.ok) {
      throw new Error(`Failed to load app data from ${dataUrl}`);
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
