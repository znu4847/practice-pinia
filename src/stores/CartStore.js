import { defineStore } from "pinia";
import { groupBy } from "lodash";

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
  },
  getters: {
    count: (state) => state.items.length,
    isNotEmpty: (state) => state.items.length !== 0,
    itemGroups: (state) => groupBy(state.items, "name"),
    itemGroupLength: (state) => (name) => state.itemGroups[name].length,
    priceTotal: (state) => {
      let priceTotal = 0;
      state.items
        .map((item) => parseFloat(item.price))
        .forEach((price) => (priceTotal += price));
      return priceTotal;
    },
  },
});
