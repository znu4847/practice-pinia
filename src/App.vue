<script setup>
import { ref, reactive } from "vue";
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import products from "@/data/products.json";
import { useCartStore } from "./stores/CartStore";
import AppButton from "./components/AppButton.vue";
const cartStore = useCartStore();
const history = reactive([]);
const isHistoryMode = ref(false);
history.push(JSON.stringify(cartStore.$state));
const future = reactive([]);
cartStore.$subscribe((mutation, state) => {
  if (isHistoryMode.value) return;
  history.push(JSON.stringify(state));
  future.splice(0, future.length); // reset future
});
const undo = () => {
  if (history.length === 1) return;
  isHistoryMode.value = true;
  future.push(history.pop());
  cartStore.$state = JSON.parse(history.at(-1));
  isHistoryMode.value = false;
};
const redo = () => {
  const latestState = future.pop();
  if (!latestState) return;
  isHistoryMode.value = true;
  history.push(latestState);
  cartStore.$state = JSON.parse(latestState);
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
      <input id="tete" v-model="text" type="text" />
      <AppButton @click="undo()">undo</AppButton>
      <AppButton @click="redo()">redo</AppButton>
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
