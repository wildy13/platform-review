<script setup>
const { data, signOut } = useAuth();


const items = [
    [
        {
            slot: 'account',
            disabled: true
        }
    ],
    [
        {
            label: 'Sign out',
            icon: 'i-heroicons-arrow-left-on-rectangle',
            click: async () => {
                await signOut({ callbackUrl: '/' });
            }
        },
        {
            label: 'Settings',
            icon: 'i-heroicons-cog-8-tooth',
            click:  async () => {
                await navigateTo(`/profile/${data.value.user._id}`)
            }
        }
    ]
]
</script>

<template>
    <div class="h-12 p-4 w-full flex justify-between  items-center space-x-4 group">
        <div class="text-xl font-semibold">DASHBOARD</div>
        <div class="flex items-center space-x-4">
            <UIcon name="i-solar-bell-bing-bold" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
            <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                :popper="{ placement: 'bottom-start' }">
                <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" :alt="data.user.username" />

                <template #account="{ item }">
                    <div class="text-left">
                        <p>
                            Signed in as
                        </p>
                        <p class="truncate font-medium text-gray-900 dark:text-white">
                            {{ data.user.username }}
                        </p>
                    </div>
                </template>

                <template #item="{ item }">
                    <span class="truncate">{{ item.label }}</span>

                    <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                </template>
            </UDropdown>
        </div>
    </div>
</template>