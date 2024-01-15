<script setup>
const { signOut } = useAuth();

const open = ref(false);

const logout = async () => {
    await signOut({ callbackUrl: '/' })
}

const toggleDropdown = () => {
    open.value = !open.value
}
</script>

<template>
    <div class="p-4 flex flex-col space-y-12">
        <div class="text-xl font-semibold text-center">DASHBOARD</div>
        <div class="flex flex-col space-y-4 justify-between h-full">
            <div class="flex flex-col space-y-4">
                <nuxtLink to="/dashboard" class="flex items-center space-x-4 hover:bg-primary-50 group">
                    <UIcon name="i-solar-widget-2-bold" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                    <span>Dashboard</span>
                </nuxtLink>

                <nuxtLink to="/users" class="flex items-center space-x-4 group">
                    <UIcon name="i-solar-shield-user-bold" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                    <span>Users Management</span>
                </nuxtLink>

                <nuxtLink to="/roles" class="flex items-center space-x-4 group">
                    <UIcon name="i-solar-user-id-bold" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                    <span>Roles Management</span>
                </nuxtLink>
                <div class="w-full">
                    <UButton @click="toggleDropdown()" variant="ghost" class="w-full">
                        <div class="flex items-center justify-between w-full">
                            <span>Project</span>
                            <UIcon v-if="!open" name="i-solar-alt-arrow-down-line-duotone" class="w-8 h-8"></UIcon>
                            <UIcon v-if="open" name="i-solar-alt-arrow-up-line-duotone" class="w-8 h-8"></UIcon>
                        </div>
                    </UButton>
                    <div>
                        <ul :class="{'block': open, 'hidden' : !open}" class="py-2 space-y-2">
                            <li>
                                <nuxtLink 
                                    to=""
                                    class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                    <div>Category</div>
                                </nuxtLink>
                            </li>
                            <li>
                                <nuxtLink 
                                    to=""
                                    class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                    <div>Module</div>
                                </nuxtLink>
                            </li>
                            <li>
                                <nuxtLink 
                                    to=""
                                    class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                    <div class="border-l-2">Content</div>
                                </nuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
            <UButton variant="ghost" @click="logout()">
                <div class="flex items-center space-x-4 ">
                    <UIcon name="i-solar-logout-3-bold-duotone"
                        class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
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
}</style>