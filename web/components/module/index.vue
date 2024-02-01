<script setup>
import { useModuleStore } from '../../stores/module'

const module = useModuleStore();

const search = ref('');
const showCreate = ref(false);
const showEdit = ref(false);
const showRemove = ref(false);
const selected = ref([]);
const itemData = ref({});
const page = ref(1);
const pageCount = ref(10);

const columns = [{
    key: 'index',
    label: '#',
    class: 'text-center',
},
{
    key: 'project',
    label: 'Topic'
},
{
    key: 'name',
    label: 'Name',
},
{
    key: 'signTo',
    label: 'Assignment',
},
{
    key: 'signBy',
    label: 'Assignment By',
},
{
    key: 'actions',
    label: 'Actions',
}];
const data = computed(() => module.items.map((val) => ({
    ...val,
    project: val.project.name
}
)));
const items = computed(() => useFilter(data.value, search.value, ['name', 'project']) || []);
const rows = computed(() => items.value.slice((page.value - 1) * pageCount.value, (page.value) * pageCount.value));
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() => Math.min(page.value * pageCount.value, items.value.length));

const {
    pending,
    error,
    execute,
} = useLazyAsyncData(() => module.getAll(), {
    immediate: false,
});

const editDialog = (item) => {
    showEdit.value = true;
    itemData.value = item;
};

onMounted(async () => {
    await execute();
});

const breadcrumb = [{
    icon: 'i-heroicons-home',
    to: '/project/module'
}, {
    label: 'Project',
    icon: 'i-solar-alt-arrow-right-outline'
},
{
    label: 'Module',
    icon: 'i-solar-alt-arrow-right-outline'
},
{
    label: 'Default',
    icon: 'i-solar-alt-arrow-right-outline',
    class: 'text-blue-500'
}]

</script>

<template>
    <div class="w-full">
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
        <div class="p-4 mt-24">
            <div class="p-10 bg-white rounded-lg">
                <!-- Header -->
                <div class="flex justify-between">
                    <div class="text-2xl font-semibold">Module Management</div>
                    <div class="flex items-center">
                        <div>
                            <UInput v-model="search" placeholder="Search..." icon="i-heroicons-magnifying-glass-20-solid"
                                :ui="{ icon: { trailing: { pointer: '' } } }">
                                <template #trailing>
                                    <UButton v-show="search !== ''" color="gray" variant="link"
                                        icon="i-heroicons-x-mark-20-solid" :padded="false" @click="search = ''" />
                                </template>
                            </UInput>
                        </div>
                        <UTooltip text="Create">
                            <UButton variant="ghost" @click="showCreate = true">
                                <UIcon name="i-solar-add-square-bold"
                                    class="w-8 h-8 text-primary-600 hover:text-primary-900" />
                            </UButton>
                        </UTooltip>
                        <UTooltip text="Remove">
                            <UButton variant="ghost" :disabled="!selected.length" @click="showRemove = true">
                                <UIcon name="i-solar-trash-bin-2-bold"
                                    class="w-8 h-8 text-primary-600 hover:text-red-600" />
                            </UButton>
                        </UTooltip>
                    </div>
                </div>
                <!-- Table -->
                <UTable v-model="selected" :rows="rows" :columns="columns" :loading="pending" class="max-h-96">
                    <template #index-data="{ index }">
                        <div class="text-center">
                            {{ index + 1 }}
                        </div>
                    </template>
                    <template #signTo-data="{ row }">
                        <div v-for="users in row.signTo" class="flex items-center -space-x-4">
                            <UAvatar :alt="users.username" />
                        </div>
                    </template>
                    <template #signBy-data="{ row }">
                        <div class="flex items-center -space-x-4">
                            <UAvatar :alt="row.signBy.username" />
                        </div>
                    </template>
                    <template #actions-data="{ row }">
                        <div class="flex space-x-[1rem]">
                            <UTooltip text="Edit">
                                <UButton icon="i-solar-pen-2-linear" size="xs" variant="ghost" color="gray" :padded="false"
                                    @click="editDialog(row)" />
                            </UTooltip>
                        </div>
                    </template>
                </UTable>

                <!-- Pagination -->
                <div v-if="rows.length" class="flex items-center justify-end py-4 gap-8">
                    <div class="text-primary-600">
                        Showing {{ pageFrom }} to {{ pageTo }} of {{ items.length }} results
                    </div>
                    <USelectMenu v-model="pageCount" :options="[10, 20, 30, 40, 50]" class="w-20" />
                    <UPagination v-model="page" :page-count="pageCount" :total="items.length" />
                </div>

            </div>

            <ModuleCreate :show="showCreate" @close="showCreate = false" />
            <ModuleEdit :show="showEdit" :data="itemData" @close="showEdit = false" />
            <ModuleRemove :show="showRemove" :data="selected" @close="showRemove = false" />

        </div>
    </div>
</template>