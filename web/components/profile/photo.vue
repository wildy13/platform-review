<script setup>
import { z } from 'zod';
import { useUsersStore } from '../../stores/users';

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
const toast = useToast();

const isOpen = ref(false);
const form = ref();

const state = ref({
    usersImg: undefined,
});

watch(() => [props.show, props.data], ([showValue, dataValue]) => {
    isOpen.value = showValue;
    state.value = { ...dataValue };
});

const {
    status,
    error,
    execute,
} = useLazyAsyncData(() => store.profile(state.value), {
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
            <UForm ref="form" :state="state" class="flex flex-col space-y-[2rem]" @submit="submit">
                <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <div class="text-base">
                                Edit Pofile
                            </div>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="close" />
                        </div>
                    </template>

                    <div class="flex flex-col space-y-[2rem]">
                        <ErrorHandler v-if="error" :error="error?.message" />

                        <UFormGroup label="Image" name="imageFile">
                            <Upload v-model="state.imageFile" accept="image/*" />
                        </UFormGroup>
                    </div>

                    <template #footer>
                        <div class="flex space-x-[1rem]">
                            <div class="flex-1" />
                            <UButton label="Close" color="white" @click="close" class="bg-white" />
                            <UButton label="Save" :loading="status === 'pending'" @click="submit" />
                        </div>
                    </template>
                </UCard>
            </UForm>
        </UModal>
    </div>
</template>