<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <button @click="count++">
    You clicked me {{ count }} times in a <b>vue</b> application!
  </button>
</template>
