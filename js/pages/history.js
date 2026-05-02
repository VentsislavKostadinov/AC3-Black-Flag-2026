import { getStore } from "../store.js";

export const renderHistoryPage = () => {
  const store = getStore();
  const { history } = store;

  return `
    <section>
      <h1>History Page</h1>
      <p>${history}</p>
    </section>
  `;
};
