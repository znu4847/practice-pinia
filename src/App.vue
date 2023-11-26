<script setup>
import { ref, reactive } from "vue";
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import products from "@/data/products.json";
import { useCartStore } from "./stores/CartStore";
import AppButton from "./components/AppButton.vue";
const cartStore = useCartStore();
const history = reactive([]);
let isHistoryMode = ref(false);
history.push(JSON.stringify(cartStore.$state));
cartStore.$subscribe((mutation, state) => {
  if (isHistoryMode.value) {
    return;
  }
  history.push(JSON.stringify(state));
});
const undo = () => {
  isHistoryMode.value = true;
  if (history.length === 1) return;
  history.pop();
  cartStore.$state = JSON.parse(history.at(-1));
  isHistoryMode.value = false;
};
cartStore.$onAction(({ name, store, args, after, onError }) => {
  if (name === "addToCart") {
    after(() => {
      // console.log(
      //   `addToCart - item name : ${args[1].name}, count : ${args[0]}`
      // );
    });
    onError((error) => {
      console.warn(error.message);
    });
  }
});

let text = ref("");
</script>

<template>
  <div class="container">
    <TheHeader />
    <div>
      <input v-model="text" type="text" />
      <AppButton @click="undo()">undo</AppButton>
    </div>
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard
        v-for="product in products"
        :key="product.name"
        :product="product"
        @addToCart="cartStore.addToCart($event, product)"
      />
    </ul>
  </div>
</template>
