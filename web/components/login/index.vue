<script setup>
import { ref } from 'vue';
import { z } from 'zod';
import { useToggle } from '@vueuse/core';

const { signIn } = useAuth();

const form = ref();
const typePassword = ref(true);
const errorMessage = ref(null);
const state = ref({
  email: undefined,
  password: undefined,
});

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string(),
});

const togglePassword = useToggle(typePassword);

const submit = async () => {
  try {
    await form.value?.validate();

    const { email, password } = state.value;
    await signIn('credentials', { email, password, callbackUrl: '/dashboard' });
  } catch (error) {
    console.log(error);
    errorMessage.value = error?.response._data.message;
  }

  return null;
};
</script>

<template>
  <div class="min-h-screen flex justify-center items-center mx-4">
    <div class="max-w-md w-full flex flex-col space-y-[2rem]">
      <div class="flex justify-center">
        <img src="/Logo.png" alt="Logo" class="w-64 h-auto">
      </div>

      <div class="flex flex-col text-primary-400 text-center">
        <div>
          Welcome
        </div>
        <div>Please Sign In to your account</div>
      </div>

      <ErrorHandler
        v-if="errorMessage"
        :error="errorMessage"
      />

      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        class="flex flex-col space-y-[2rem]"
        @submit="submit"
      >
        <UFormGroup
          name="email"
        >
          <UInput
            v-model="state.email"
            placeholder="Email"
          />
        </UFormGroup>
        <UFormGroup
          name="password"
        >
          <UInput
            v-model="state.password"
            :type="typePassword ? 'password': 'text'"
            placeholder="Password"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template
              v-if="state.password"
              #trailing
            >
              <UButton
                color="gray"
                variant="link"
                :icon="typePassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                :padded="false"
                @click="togglePassword()"
              />
            </template>
          </UInput>
        </UFormGroup>
        <UButton
          type="submit"
          block
          class="bg-blue-800 text-white"
        >
          Sign In
        </UButton>
      </UForm>
    </div>
  </div>
</template>
