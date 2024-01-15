<script setup>
const { signOut } = useAuth();

const open = ref(false);

const logout = async () => {
    await signOut({ callbackUrl: '/' });
}

const toggleDropdown = () => {
    open.value = !open.value;
}

const menuItems = [
    { to: '/dashboard', icon: 'i-solar-widget-2-bold', text: 'Dashboard' },
    { to: '/users', icon: 'i-solar-shield-user-bold', text: 'Users Management' },
    { to: '/roles', icon: 'i-solar-user-id-bold', text: 'Roles Management' },
];

const dropdownItems = [
    { to: '/category', text: 'Category' },
    { to: '', text: 'Module' },
    { to: '', text: 'Content' },
];
</script>

<template>
    <div class="p-4 flex flex-col space-y-12">
        <div class="text-xl font-semibold text-center">DASHBOARD</div>
        <div class="flex flex-col space-y-4 justify-between h-full">
            <div class="flex flex-col space-y-4">
                <template v-for="item in menuItems">
                    <nuxtLink :to="item.to" class="flex items-center space-x-4 hover:bg-primary-50 group">
                        <UIcon :name="item.icon" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                        <span>{{ item.text }}</span>
                    </nuxtLink>
                </template>

                <div class="group -ml-3">
                    <UButton @click="toggleDropdown()" variant="ghost" class="w-full" size="xl">
                        <UIcon name="i-solar-box-minimalistic-bold" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                        <div class="flex items-center justify-between w-full ml-3">
                            <span class="text-sm font-normal">Project</span>
                            <UIcon v-if="!open" name="i-solar-alt-arrow-down-line-duotone" class="w-8 h-8"></UIcon>
                            <UIcon v-if="open" name="i-solar-alt-arrow-up-line-duotone" class="w-8 h-8"></UIcon>
                        </div>
                    </UButton>
                    <div class="ml-16 border-l-2 border-blue-500">
                        <ul :class="{'block': open, 'hidden': !open}" class="py-2 w-full">
                            <template v-for="item in dropdownItems">
                                <li class="flex items-center">
                                    <div class="absolute left-[65px] w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <nuxtLink :to="item.to" class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                        <div>{{ item.text }}</div>
                                    </nuxtLink>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
                <nuxtLink class="flex items-center space-x-4 hover:bg-primary-50 group">
                    <UIcon name="i-solar-chat-dots-bold" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                    <span>Chat</span>
                </nuxtLink>
            </div>
            <UButton variant="ghost" @click="logout()">
                <div class="flex items-center space-x-4 ">
                    <UIcon name="i-solar-logout-3-bold-duotone" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                    <span>Logout</span>
                </div>
            </UButton>
        </div>
    </div>
</template>

<style scoped>
a.router-link-active,
a.router-link-exact-active {
    @apply rounded-lg bg-primary-50;
}

a.router-link-exact-active span {
    @apply text-primary-900;
}

a.router-link-active>div,
a.router-link-exact-active>div {
    @apply text-primary-900;
}
</style>
