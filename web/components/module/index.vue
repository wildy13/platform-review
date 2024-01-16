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
    key: 'project.name',
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

const items = computed(() => useFilter(module.items, search.value, ['name']) || []);
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

</script>

<template>
    <div class="p-4 ">
        <div class="p-10 bg-white rounded-lg">
            <!-- Header -->
            <div class="flex justify-between">
                <div class="text-2xl font-semibold">Module Management</div>
                <div class="flex items-center">
                    <UTooltip text="Create">
                        <UButton variant="ghost" @click="showCreate = true">
                            <UIcon name="i-solar-add-square-bold" class="w-8 h-8 text-primary-600 hover:text-primary-900" />
                        </UButton>
                    </UTooltip>
                    <UTooltip text="Remove">
                        <UButton variant="ghost" :disabled="!selected.length" @click="showRemove = true">
                            <UIcon name="i-solar-trash-bin-2-bold" class="w-8 h-8 text-primary-600 hover:text-red-600" />
                        </UButton>
                    </UTooltip>
                </div>
            </div>
            <!-- Table -->
            <UTable v-model="selected" :rows="rows" :columns="columns" :loading="pending">
                <template #index-data="{ index }">
                    <div class="text-center">
                        {{ index + 1 }}
                    </div>
                </template>
                <template #signTo-data="{ row }">
                    <div v-for="users in row.signTo" class="flex items-center -space-x-4" >
                        <UAvatar  :alt="users.username" />
                    </div>
                </template>
                <template #signBy-data="{ row }">
                    <div class="flex items-center -space-x-4" >
                        <UAvatar  :alt="row.signBy.username" />
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
</template>