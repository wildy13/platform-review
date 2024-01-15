<script setup>
import { useRolesStore } from '../../stores/roles';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['close']);

const store = useRolesStore();
const toast = useToast();

const isOpen = ref(false);

watch(() => props.show, (showValue) => {
  isOpen.value = showValue;
});

const {
  status,
  error,
  execute,
} = useLazyAsyncData(() => store.remove(props.data), {
  immediate: false,
});

const submit = async () => {
  await execute();

  if (!error.value) {
    emit('close');

    toast.add({
      title: 'Done',
      description: 'Data has been removed successfully',
      icon: 'i-solar-check-circle-linear',
      color: 'red',
    });
  }

  return null;
};
</script>

<template>
  <div>
    <UModal
      v-model="isOpen"
      prevent-close
    >
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="text-base">
              Remove Roles
            </div>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              class="-my-1"
              @click="$emit('close');"
            />
          </div>
        </template>

        <div class="flex flex-col space-y-[2rem]">
          <ErrorHandler
            v-if="status === 'error'"
            :error="error?.message"
          />

          <div>
            This action will delete the data permanently, Continue?
          </div>
        </div>

        <template #footer>
          <div class="flex space-x-[1rem]">
            <div class="flex-1" />
            <UButton
              label="Close"
              color="white"
              @click="$emit('close');"
            />
            <UButton
              label="Yes"
              color="red"
              :loading="status === 'pending'"
              @click="submit"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>