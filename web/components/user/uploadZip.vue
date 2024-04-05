<script setup>
import { z } from 'zod';
import { useContentStore } from '../../stores/content';

const { data } = useAuth();

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  dt: {
    type: Object,
    required: true
  }
});





const emit = defineEmits(['close']);

const content = useContentStore();


const toast = useToast();

const isOpen = ref(false);
const form = ref();

const initState = {
  contentZip: undefined,
};
const state = ref();

watch(() => [props.show, props.dt], ([showValue, dataValue]) => {
  isOpen.value = showValue;

  state.value = {...dataValue};
});
const compressedTypes = ['application/zip', 'application/x-zip-compressed'];

const schema = z.object({
  contentZip: z.any()
    .refine((file) => file, 'Required')
    .refine((file) => compressedTypes.includes(file?.type), 'Only .zip formats are supported'),
});

const {
  status,
  error,
  execute,
} = useLazyAsyncData(() => content.upload(state.value), {
  immediate: false,
});

const close = () => {
  Object.assign(state.value, initState);
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
      description: 'Data has been saved successfully',
      icon: 'i-solar-check-circle-linear',
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
                Create Content
              </div>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="close" />
            </div>
          </template>

          <div class="flex flex-col space-y-[2rem]">
            <ErrorHandler v-if="error" :error="error?.message" />
            <UFormGroup v-if="data.user.role.name === 'users'" label="Content Zip" name="contentZip">
              <Upload v-model="state.contentZip" accept=".zip,.rar" />
            </UFormGroup>
          </div>

          <template #footer>
            <div class="flex space-x-[1rem]">
              <div class="flex-1" />
              <UButton label="Close" color="white" @click="close" />
              <UButton label="Save" :loading="status === 'pending'" type="submit" />
            </div>
          </template>
        </UCard>
      </UForm>
    </UModal>
  </div>
</template>