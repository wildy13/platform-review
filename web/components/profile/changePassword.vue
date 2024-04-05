<script setup>
import { z } from 'zod';
import { useUsersStore } from '../../stores/users';

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['close']);

const store = useUsersStore();
const toast = useToast();

const isOpen = ref(false);
const form = ref();

const state = ref({
    newPassword: undefined,
    confNewPassword: undefined,
    oldPassword: undefined,
});

const schema = z.object({
    newPassword: z.string().refine((password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\[\]{};':"\\|,.<>\\/?]).{8,}$/.test(password);
    }, 'New password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one special character'),
    confNewPassword: z.string(),
    oldPassword: z.string(),
}).refine((data) => data.newPassword === data.confNewPassword, {
    message: "New Passwords don't match",
    path: ["confNewPassword"],
});



watch(() => [props.show, props.data], ([showValue, dataValue]) => {
    isOpen.value = showValue;
    state.value = { ...dataValue };
});

const {
    status,
    error,
    execute,
} = useLazyAsyncData(() => store.changePassword(state.value), {
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
                                Change Password
                            </div>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1"
                                @click="close" />
                        </div>
                    </template>

                    <div class="flex flex-col space-y-[2rem]">
                        <ErrorHandler v-if="error" :error="error?.message" />

                        <UFormGroup label="Old Password" name="oldPassword">
                            <UInput v-model="state.oldPassword" />
                        </UFormGroup>
                        <UFormGroup label="New Password" name="newPassword">
                            <UInput v-model="state.newPassword" />
                        </UFormGroup>
                        <UFormGroup label="Confirm New Password" name="confNewPassword">
                            <UInput v-model="state.confNewPassword" />
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