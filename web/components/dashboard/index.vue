<script setup>
import { useRolesStore } from '../../stores/roles';
import { useUsersStore } from '../../stores/users';
import { useProjectStore } from '../../stores/projects.js';
import { useModuleStore } from '../../stores/module.js';
import { useContentStore } from '../../stores/content.js'

const roles = useRolesStore();
const users = useUsersStore();
const project = useProjectStore();
const module = useModuleStore();
const content = useContentStore();

const scope = effectScope();
const statuses = ref([]);

const {
    pending,
    error,
    execute,
} = useLazyAsyncData(() => Promise.all([roles.getAll(), users.getAll(), project.getAll(), module.getAll()]), {
    immediate: false,
});



const projectList = computed(() => project.items.map((items) => ({ ...items, isOpen: false, isActive: false })));

onMounted(async () => {
    await execute();
    statuses.value = projectList.value
});

</script>

<template>
    <div>
        <div class="pt-4 max-w-5xl">
            <div class="flex flex-auto space-x-4 justify-center items-center">
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
                <div class="w-72 h-32 bg-white rounded-xl text-gray-500 p-2 flex justify-between drop-shadow-xl">
                    <div class="flex flex-col space-y-4">
                        <div class="text-base font-semibold">MODULE SUMMARY</div>
                        <div class="text-xl">{{ module.items.length }}</div>
                    </div>
                    <div class="self-center">
                        <UIcon name="i-solar-folder-2-bold" class="w-12 h-12" />
                    </div>
                </div>
                <div class="w-72 h-32 bg-white rounded-xl text-gray-500 p-2 flex justify-between drop-shadow-xl">
                    <div class="flex flex-col space-y-4">
                        <div class="text-base font-semibold">CONTENT SUMMARY</div>
                        <div class="text-xl">{{ content.items.length }}</div>
                    </div>
                    <div class="self-center">
                        <UIcon name="i-solar-file-bold" class="w-12 h-12" />
                    </div>
                </div>
            </div>

            <div class="mt-12 w-full h-96 rounded-xl flex flex-col space-y-4">
                <div class="text-2xl font-semibold">Project Tree</div>
                <UAccordion :items="project.items" class="flex flex-col space-y-[1rem]">
                    <template #default="{ item: project, open }">
                        <UButton color="gray" variant="ghost" :padded="false"
                            :ui="{ variant: { ghost: 'hover:bg-transparent' } }">
                            <template #leading>
                                <UIcon name="i-heroicons-chevron-right-20-solid" :class="[open && 'rotate-90']" />
                            </template>
                            <div class="flex space-x-[.5rem]">
                                <div class="truncate">
                                    {{ project.name }}
                                </div>
                            </div>
                        </UButton>
                    </template>

                    <template #item="{ item: project }">
                        <UAccordion :items="project.module" class="ml-[2rem] flex flex-col space-y-[1rem]">
                            <template #default="{ item: module, open }">
                                <UButton color="gray" variant="ghost" :padded="false"
                                    :ui="{ variant: { ghost: 'hover:bg-transparent' } }">
                                    <template #leading>
                                        <UIcon name="i-heroicons-chevron-right-20-solid" :class="[open && 'rotate-90']" />
                                    </template>
                                    <div class="flex space-x-[.5rem] w-full">
                                        <div class="flex justify-between w-full items-center">
                                            <div class="truncate">
                                                {{ module.name }}
                                            </div>
                                            <UTooltip v-if="module.name" text="Click me to show">
                                                <NuxtLink :to="`/project/${project.slug}/${module.slug}/${module._id}`">
                                                    <UIcon name="i-solar-eye-broken" class="w-5 h-5" />
                                                </NuxtLink>
                                            </UTooltip>
                                        </div>
                                    </div>
                                </UButton>
                            </template>


                            <template #item="{ item: module }">
                                <ul class="ml-[3rem] flex flex-col space-y-[.5rem]">
                                    <li v-for="scene in module.content" :key="scene._id">
                                        <div class="flex space-x-[.5rem]">
                                            <div class="truncate">
                                                {{ scene.name }}
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </template>
                        </UAccordion>
                    </template>
                </UAccordion>
            </div>
        </div>
    </div>
</template>