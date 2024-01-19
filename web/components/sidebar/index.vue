<script setup>
const { signOut, data } = useAuth();

const open = ref(false);

const logout = async () => {
    await signOut({ callbackUrl: '/' });
}

const toggleDropdown = () => {
    open.value = !open.value;
}

const dropdownItems = [
    { to: '/category', text: 'Category' },
    { to: '/module', text: 'Module' },
    { to: '/content', text: 'Content' },
];
</script>

<template>
    <div class="p-4 flex flex-col space-y-12">
        <div class="text-xl font-semibold text-center">DASHBOARD</div>
        <div class="flex flex-col space-y-4 justify-between h-full">
            <div class="flex flex-col space-y-4">
                <nuxtLink to="/dashboard" class="flex items-center space-x-4 hover:bg-slate-50 group">
                    <UIcon name="i-solar-widget-2-bold" class="w-8 h-8 text-slate-600 group-hover:text-slate-900" />
                    <span>Dashboard</span>
                </nuxtLink>
                <nuxtLink v-if="data?.user?.role.name === 'admin'" to="/users" class="flex items-center space-x-4 hover:bg-slate-50 group">
                    <UIcon name="i-solar-shield-user-bold" class="w-8 h-8 text-slate-600 group-hover:text-slate-900" />
                    <span>Users Management</span>
                </nuxtLink>
                <nuxtLink v-if="data?.user?.role.name === 'admin'" to="/roles" class="flex items-center space-x-4 hover:bg-slate-50 group">
                    <UIcon name="i-solar-user-id-bold" class="w-8 h-8 text-slate-600 group-hover:text-slate-900" />
                    <span>Roles Management</span>
                </nuxtLink>

                <div v-if="data?.user?.role.name === 'admin'" class="group -ml-3">
                    <UButton @click="toggleDropdown()" variant="ghost" class="w-full" size="xl">
                        <UIcon name="i-solar-box-minimalistic-bold"
                            class="w-8 h-8 text-slate-600 group-hover:text-slate-900" />
                        <div class="flex items-center justify-between w-full ml-3">
                            <span class="text-sm font-normal">Project</span>
                            <UIcon v-if="!open" name="i-solar-alt-arrow-down-line-duotone" class="w-8 h-8"></UIcon>
                            <UIcon v-if="open" name="i-solar-alt-arrow-up-line-duotone" class="w-8 h-8"></UIcon>
                        </div>
                    </UButton>
                    <div class="ml-4">
                        <ul :class="{ 'block': open, 'hidden': !open }" class="py-2 w-full">
                            <template v-for="item in dropdownItems">
                                <li class="flex items-center text-slate-600 ">
                                    <nuxtLink :to="item.to"
                                        class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-slate-50">
                                        <span>{{ item.text }}</span>
                                    </nuxtLink>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
            </div>
            <UButton variant="ghost" @click="logout()">
                <div class="flex items-center space-x-4 ">
                    <UIcon name="i-solar-logout-3-bold-duotone" class="w-8 h-8 text-slate-600 group-hover:text-slate-900" />
                    <span>Logout</span>
                </div>
            </UButton>
        </div>
    </div>
</template>

<style scoped>
a.router-link-active,
a.router-link-exact-active {
    @apply rounded-lg bg-slate-50 ;
}

a.router-link-exact-active span {
    @apply text-slate-900 text-blue-500;
}

a.router-link-active>div,
a.router-link-exact-active>div {
    @apply text-slate-900;
}
</style>
