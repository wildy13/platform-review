<script setup>
import { useRolesStore } from '../../stores/roles';
import { useUsersStore } from '../../stores/users';
import { useProjectStore } from '../../stores/projects.js'

const roles = useRolesStore();
const users = useUsersStore();
const project = useProjectStore();

const {
    pending,
    error,
    execute,
} = useLazyAsyncData(() => Promise.all([roles.getAll(), users.getAll(), project.getAll()]), {
    immediate: false,
});

const breadcrumb = [{
    icon: 'i-heroicons-home',
    to: '/dashboard'
}, {
    label: 'Dashbboard',
    icon: 'i-solar-alt-arrow-right-outline'
}, {
    label: 'Default',
    icon: 'i-solar-alt-arrow-right-outline',
    class: 'text-blue-500'
}]

onMounted(async () => {
    await execute();
});

</script>

<template>
    <div>
        <div class="flex justify-end px-4">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li class="inline-flex items-center space-x-2">
                    <div v-for="item in breadcrumb">
                        <nuxtLink :to="item.to" class="text-base flex items-center">
                            <UIcon :name="item.icon" />
                            <span :class="item.class">{{ item.label }}</span>
                        </nuxtLink>
                    </div>
                </li>
            </ol>
        </div>
        <div class="p-12">
            <div class="flex space-x-4 justify-center items-center">
                <div class="w-72 h-32 bg-white rounded-xl text-gray-500 p-2 flex justify-between shadow drop-shadow-xl">
                    <div class="flex flex-col space-y-4">
                        <div class="text-base font-semibold">USERS SUMMARY</div>
                        <div class="text-xl">{{ users.items.length }}</div>
                    </div>
                    <div class="self-center">
                        <UIcon name="i-solar-users-group-rounded-bold" class="w-12 h-12" />
                    </div>
                </div>
                <div class="w-72 h-32 bg-white rounded-xl text-gray-500 p-2 flex justify-between drop-shadow-xl">
                    <div class="flex flex-col space-y-4">
                        <div class="text-base font-semibold">ROLES SUMMARY</div>
                        <div class="text-xl">{{ roles.items.length }}</div>
                    </div>
                    <div class="self-center">
                        <UIcon name="i-solar-user-id-bold" class="w-12 h-12" />
                    </div>
                </div>
                <div class="w-72 h-32 bg-white rounded-xl text-gray-500 p-2 flex justify-between drop-shadow-xl">
                    <div class="flex flex-col space-y-4">
                        <div class="text-base font-semibold">PROJECT SUMMARY</div>
                        <div class="text-xl">{{ project.items.length }}</div>
                    </div>
                    <div class="self-center">
                        <UIcon name="i-solar-folder-2-bold" class="w-12 h-12" />
                    </div>
                </div>
                <div class="w-72 h-32 bg-white rounded-xl text-gray-500 p-2 flex justify-between">
                    <div class="flex flex-col space-y-4">
                        <div class="text-base font-semibold">MODULE SUMMARY</div>
                        <div class="text-xl">500</div>
                    </div>
                    <div class="self-center">
                        <UIcon name="i-solar-folder-2-bold" class="w-12 h-12" />
                    </div>
                </div>
                <div class="w-72 h-32 bg-white rounded-xl text-gray-500 p-2 flex justify-between">
                    <div class="flex flex-col space-y-4">
                        <div class="text-base font-semibold">CONTENT SUMMARY</div>
                        <div class="text-xl">3000</div>
                    </div>
                    <div class="self-center">
                        <UIcon name="i-solar-file-bold" class="w-12 h-12" />
                    </div>
                </div>
            </div>

            <div class="mt-12 w-full h-96 bg-white rounded-xl"></div>
        </div>
    </div>
</template>