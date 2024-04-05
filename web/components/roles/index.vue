<script setup>
import { useRolesStore } from '../../stores/roles';

const store = useRolesStore();

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
}, {
    key: 'name',
    label: 'Name',
}, {
    key: 'actions',
    label: 'Actions',
}];

const items = computed(() => useFilter(store.items, search.value, ['name']) || []);
const rows = computed(() => items.value.slice((page.value - 1) * pageCount.value, (page.value) * pageCount.value));
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() => Math.min(page.value * pageCount.value, items.value.length));

const {
    pending,
    error,
    execute,
} = useLazyAsyncData(() => store.getAll(), {
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
    <div class="w-full">
        <div class="p-4 pt-24">
            <div class="p-10 bg-white rounded-lg border-2">
                <!-- Header -->
                <div class="flex justify-between">
                    <div class="text-2xl font-semibold">Roles Management</div>
                    <div class="flex items-center space-x-4">
                        <UButton @click="showCreate = true" icon="i-solar-add-square-bold" size="sm" color="primary"
                            label="Create" :trailing="false">
                        </UButton>
                        <UButton icon="i-solar-trash-bin-2-bold" size="sm" color="red" label="Remove" :disabled="!selected.length" @click="showRemove = true" />
                    </div>
                </div>
                <!-- Table -->
                <UTable v-model="selected" :rows="rows" :columns="columns" :loading="pending" class="max-h-96">
                    <template #index-data="{ index }">
                        <div class="text-center">
                            {{ index + 1 }}
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

            <RolesCreate :show="showCreate" @close="showCreate = false" />
            <RolesEdit :show="showEdit" :data="itemData" @close="showEdit = false" />
            <RolesRemove :show="showRemove" :data="selected" @close="showRemove = false" />
        </div>
    </div>
</template>