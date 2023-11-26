import { defineStore, acceptHMRUpdate } from "pinia";
import { groupBy } from "lodash";
import { useAuthUserStore } from "./AuthUserStore";

export const useCartStore = defineStore("CartStore", {
  state: () => {
    return {
      items: [],
    };
  },
  actions: {
    addToCart(count, item) {
      count = parseInt(count);
      this.$patch((state) => {
        for (let idx = 0; idx < count; idx++) {
          state.items.push({ ...item });
        }
      });
    },
    clearGroup(name) {
      this.$patch((state) => {
        state.items = state.items.filter((i) => i.name !== name);
      });
    },
    updateCount(count, item) {
      this.clearGroup(item.name);
      this.addToCart(count, item);
    },
    checkout() {
      const authUserStore = useAuthUserStore();
      alert(
        `${authUserStore.userName} just bought ${this.count} items at a total of $${this.priceTotal}`
      );
    },
  },
  getters: {
    count: (state) => state.items.length,
    isNotEmpty: (state) => state.items.length !== 0,
    itemGroups: (state) => {
      const grouped = groupBy(state.items, "name");
      const sorted = Object.keys(grouped).sort();
      let inOrder = {};
      sorted.forEach((key) => (inOrder[key] = grouped[key]));
      return inOrder;
    },
    itemGroupLength: (state) => (name) => state.itemGroups[name].length,
    priceTotal: (state) => state.items.reduce((p, c) => p + c.price, 0),
  },
});

// Hot Module Replacement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
