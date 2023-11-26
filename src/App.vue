<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import products from "@/data/products.json";
import { useCartStore } from "./stores/CartStore";
import AppButton from "./components/AppButton.vue";
const cartStore = useCartStore();
cartStore.$onAction(({ name, store, args, after, onError }) => {
  if (name === "addToCart") {
    after(() => {
      console.log(
        `addToCart - item name : ${args[1].name}, count : ${args[0]}`
      );
    });
    onError((error) => {
      console.warn(error.message);
    });
  }
});
</script>

<template>
  <div class="container">
    <TheHeader />
    <div>
      <input id="tete" v-model="text" type="text" />
      <div class="mb-5 flex justify-end">
        <AppButton @click="cartStore.undo">Undo</AppButton>
        <AppButton class="ml-2" @click="cartStore.redo">Redo</AppButton>
      </div>
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
