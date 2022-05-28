<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Observable } from 'windowed-observable';

const observable = new Observable('AppObservable');
const count = ref(0);

const addCount = () => observable.publish(count.value + 1);
const countObserver = (_count) => (count.value = _count);

onMounted(() => observable.subscribe(countObserver));
onUnmounted(() => observable.unsubscribe(countObserver));
</script>

<template>
  <h1>This is a Vue App! {{ count }}</h1>
  <button @click="addCount">Add to count with vue</button>
</template>
