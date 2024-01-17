<script setup>
import { z } from 'zod';
import { useModuleStore } from '../../stores/module';
import { useContentStore } from '../../stores/content';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

const module = useModuleStore();
const content = useContentStore();

const toast = useToast();

const isOpen = ref(false);
const form = ref();

const initState = {
  name: undefined,
  module: undefined
};
const state = ref({ ...initState });

watch(() => props.show, (value) => {
  isOpen.value = value;
});

const schema = z.object({
  name: z.string(),
  module: z.string(),
});

const {
  status,
  error,
  execute,
} = useLazyAsyncData(() => content.create(state.value), {
  immediate: false,
});

const {
  status: sts,
  error: err,
  execute: exct,
} = useLazyAsyncData(() => module.getAll(), {
  immediate: false,
});

const current = computed(() => module.items.find((v) => v._id === state.value.module));

const close = () => {
  Object.assign(state.value, initState);
  error.value = undefined;
  emit('close');
};
onMounted(async () => {
  await exct();
});
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
            <UFormGroup label="Module" name="module">
              <USelectMenu v-model="state.module" :options="module.items" size="lg" value-attribute="_id"
                option-attribute="name" searchable>
                <template #label>
                  {{ current?.name || 'Select...' }}
                </template>
              </USelectMenu>
            </UFormGroup>
            <UFormGroup label="Name" name="name">
              <UInput v-model="state.name" />
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