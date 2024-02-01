<script setup>
import { z } from 'zod';
import { useRolesStore } from '../../stores/roles';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close']);

const store = useRolesStore();
const toast = useToast();

const isOpen = ref(false);
const form = ref();

const state = ref({
  name: undefined,
});

watch(() => [props.show, props.data], ([showValue, dataValue]) => {
  isOpen.value = showValue;
  state.value = { ...dataValue };
});

const schema = z.object({
  name: z.string(),
});

const {
  status,
  error,
  execute,
} = useLazyAsyncData(() => store.update(state.value), {
  immediate: false,
});

const close = () => {
  error.value = undefined;
  emit('close');
};

const submit = async () => {
  await form.value?.validate();
  await execute();

  if (!error.value) {
    close();

    toast.add({
      title: 'Done',
      description: 'Data has been updated successfully',
      icon: 'i-solar-check-circle-linear',
      color: 'green',
    });
  }

  return null;
};
</script>

<template>
  <div>
    <UModal v-model="isOpen" prevent-close>
      <UForm ref="form" :schema="schema" :state="state" class="flex flex-col space-y-[2rem]" @submit="submit">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="text-base">
                Edit Roles
              </div>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="close" />
            </div>
          </template>

          <div class="flex flex-col space-y-[2rem]">
            <ErrorHandler v-if="error" :error="error?.message" />

            <UFormGroup label="Name" name="name">
              <UInput v-model="state.name" />
            </UFormGroup>
          </div>

          <template #footer>
            <div class="flex space-x-[1rem]">
              <div class="flex-1" />
              <UButton label="Close" color="white" @click="close" />
              <UButton label="Save" :loading="status === 'pending'" @click="submit" />
            </div>
          </template>
        </UCard>
      </UForm>
    </UModal>
  </div>
</template>