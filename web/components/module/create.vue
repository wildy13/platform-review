<script setup>
import { z } from 'zod';
import { useProjectStore } from '../../stores/projects';
import { useModuleStore } from '../../stores/module';
import { useUsersStore } from '../../stores/users';

const { data } = useAuth();

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

const project = useProjectStore();
const module = useModuleStore();
const users = useUsersStore();

const toast = useToast();

const isOpen = ref(false);
const form = ref();

const initState = {
  name: undefined,
  project: undefined,
  signTo: undefined,
  signBy: data.value.user._id
};
const state = ref({ ...initState });

watch(() => props.show, (value) => {
  isOpen.value = value;
});

const schema = z.object({
  name: z.string(),
  project: z.string(),
  signTo: z.string(),
  signBy: z.string(),
});

const {
  status,
  error,
  execute,
} = useLazyAsyncData(() => module.create(state.value), {
  immediate: false,
});

const {
  status: sts,
  error: err,
  execute: exct,
} = useLazyAsyncData(() => Promise.all([project.getAll(), users.getAll()]), {
  immediate: false,
});

onMounted(async () => {
  await exct();
});

const currentProject = computed(() => project.items.find((v) => v._id === state.value.project));
const currentSignTo = computed(() => users.items.find((v) => v._id === state.value.signTo));
const currentSignBy = computed(() => users.items.find((v) => v._id === state.value.signBy));

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
                Create Module
              </div>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="close" />
            </div>
          </template>

          <div class="flex flex-col space-y-[2rem]">
            <ErrorHandler v-if="error" :error="error?.message" />
            <UFormGroup label="Project" name="project">
              <USelectMenu v-model="state.project" :options="project.items" size="lg" value-attribute="_id"
                option-attribute="name" searchable>
                <template #label>
                  {{ currentProject?.name || 'Select...' }}
                </template>
              </USelectMenu>
            </UFormGroup>
            <UFormGroup label="Name" name="name">
              <UInput v-model="state.name" />
            </UFormGroup>
            <UFormGroup label="Assignment" name="signTo">
              <USelectMenu v-model="state.signTo" :options="users.items" size="lg" value-attribute="_id"
                option-attribute="username" searchable>
                <template #label>
                  {{ currentSignTo?.username || 'Select...' }}
                </template>
              </USelectMenu>
            </UFormGroup>
            <UFormGroup label="Assignment By" name="signBy">
              <USelectMenu v-model="state.signBy" :options="users.items" size="lg" value-attribute="_id"
                option-attribute="username" searchable disabled>
                <template #label>
                  {{ currentSignBy?.username || 'Select...' }}
                </template>
              </USelectMenu>
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