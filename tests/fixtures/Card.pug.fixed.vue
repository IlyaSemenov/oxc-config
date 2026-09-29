<script setup lang="ts">
import SampleWidget from "./SampleWidget.vue"

const label = "hello"
const unused = 1
</script>

<template lang="pug">
section
  sample-widget(:title='label + "!"')
  span {{ label + "!" }}
</template>
