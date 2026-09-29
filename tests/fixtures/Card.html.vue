<script setup lang="ts">
import SampleWidget from "./SampleWidget.vue"

const label = "hello"
const unused = 1
</script>

<template>
  <section>
    <SampleWidget :title="label+  label"></SampleWidget>
    <span>{{  label+  "!"  }}</span>
  </section>
</template>
