<script setup>
import { z } from 'zod';
import { useUsersStore } from '../../stores/users';
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

const store = useUsersStore();
const roles = useRolesStore();
const toast = useToast();

const isOpen = ref(false);
const form = ref();

const state = ref({
  username: undefined,
  email: undefined,
  role: undefined,
});

watch(() => [props.show, props.data], ([showValue, dataValue]) => {
  isOpen.value = showValue;
  state.value = {
    _id: dataValue._id,
    username: dataValue.username,
    email: dataValue.email,
    role: dataValue.role._id
  };
});

const schema = z.object({
  username: z.string(),
  role: z.string()
});

const {
  status,
  error,
  execute,
} = useLazyAsyncData(() => store.update(state.value), {
  immediate: false,
});

const current = computed(() => roles.items.find((v) => v._id === state.value.role));

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
                Edit Users
              </div>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="close" />
            </div>
          </template>

          <div class="flex flex-col space-y-[2rem]">
            <ErrorHandler v-if="error" :error="error?.message" />

            <UFormGroup label="Username" name="username">
              <UInput v-model="state.username" />
            </UFormGroup>
            <UFormGroup label="Email" name="email">
              <UInput v-model="state.email" disabled />
            </UFormGroup>
            <UFormGroup label="Role" name="role">
              <USelectMenu v-model="state.role" :options="roles.items" size="lg" value-attribute="_id"
                option-attribute="name" searchable>
                <template #label>
                  {{ current?.name || 'Select...' }}
                </template>
              </USelectMenu>
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