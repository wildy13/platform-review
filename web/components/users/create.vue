<script setup>
import { z } from 'zod';
import { useUsersStore } from '../../stores/users';
import { useRolesStore } from '../../stores/roles';

import { useToggle } from '@vueuse/core';

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
});

const form = ref();
const typePassword1 = ref(true);
const typePassword2 = ref(true);
const isOpen = ref(false);

const emit = defineEmits(['close']);
const togglePassword1 = useToggle(typePassword1);
const togglePassword2 = useToggle(typePassword2);

const store = useUsersStore();
const role = useRolesStore();
const toast = useToast();

const initState = {
    username: undefined,
    email: undefined,
    password: undefined,
    confPassword: undefined,
    role: undefined,
};
const state = ref({ ...initState });

watch(() => props.show, (value) => {
    isOpen.value = value;
});


const schema = z.object({
    username: z.string(),
    email: z.string().email('Invalid email'),
    password: z.string().refine((password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    }, 'Password does not meet criteria'),
    confPassword: z.string().refine((password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    }, 'Password does not meet criteria'),
    role: z.string(),
}).refine((data) => data.password === data.confPassword, {
    message: "Passwords don't match",
    path: ["confPassword"],
});


const {
    pending,
    error,
    execute,
} = useLazyAsyncData(() => store.create(state.value), {
    immediate: false,
},
);


const current = computed(() => role.items.find((v) => v._id === state.value.role));

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
                                Create User
                            </div>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="close" />
                        </div>
                    </template>

                    <div class="flex flex-col space-y-[2rem]">
                        <ErrorHandler v-if="error" :error="error?.message" />
                        <UFormGroup label="Username" name="usernamme">
                            <UInput v-model="state.username" />
                        </UFormGroup>
                        <UFormGroup label="Email" name="email">
                            <UInput v-model="state.email" />
                        </UFormGroup>
                        <UFormGroup label="Password" name="password">
                            <UInput v-model="state.password" :type="typePassword1 ? 'password' : 'text'"
                                placeholder="Password" :ui="{ icon: { trailing: { pointer: '' } } }">
                                <template v-if="state.password" #trailing>
                                    <UButton color="gray" variant="link"
                                        :icon="typePassword1 ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" :padded="false"
                                        @click="togglePassword1()" />
                                </template>
                            </UInput>
                            <div class="text-sm text-gray-400">at least 8 characters, containing uppercase, lowercase, and a
                                number</div>
                        </UFormGroup>
                        <UFormGroup label="Confirm Password" name="confPassword">
                            <UInput v-model="state.confPassword" :type="typePassword2 ? 'password' : 'text'"
                                placeholder="Password" :ui="{ icon: { trailing: { pointer: '' } } }">
                                <template v-if="state.confPassword" #trailing>
                                    <UButton color="gray" variant="link"
                                        :icon="typePassword2 ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" :padded="false"
                                        @click="togglePassword2()" />
                                </template>
                            </UInput>
                            <div class="text-sm text-gray-400">at least 8 characters, containing uppercase, lowercase, and a
                                number</div>
                        </UFormGroup>
                        <UFormGroup label="Role" name="role">
                            <USelectMenu v-model="state.role" :options="role.items" size="lg" value-attribute="_id"
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
                            <UButton label="Save" :loading="pending === 'pending'" type="submit" />
                        </div>
                    </template>
                </UCard>
            </UForm>
        </UModal>
    </div>
</template>