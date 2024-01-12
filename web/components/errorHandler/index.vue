<script setup>
defineProps({
  error: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <UAlert
    title="Error"
    icon="i-heroicons-x-mark"
    color="red"
    variant="subtle"
  >
    <template #description>
      {{ error }}
    </template>
  </UAlert>
</template>
