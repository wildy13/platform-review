<script setup>
import { useFileDialog } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  accept: {
    type: String,
    required: true,
    default: 'image/*',
  },
});

const emit = defineEmits(['update:modelValue']);

const {
  files, open, reset, onChange,
} = useFileDialog({
  multiple: false,
  accept: props.accept,
});

onChange((file) => {
  emit('update:modelValue', file[0]);
});

const cancel = () => {
  emit('update:modelValue', {});
};

</script>

<template>
  <div class="flex border-t border-r border-b border-gray-200 bg-primary-800 rounded-lg">
    <UButton
      label="Choose file"
      :value="modelValue"
      @click="open"
    />
    <div class="flex items-center w-full justify-between text-sm text-white pl-4">
      <div>
        {{ modelValue.name || 'No file chosen' }}
      </div>
      <UButton
        v-if="modelValue?.name"
        variant="ghost"
        size="xs"
        icon="i-heroicons-x-mark"
        @click="cancel"
      />
    </div>
  </div>
</template>
