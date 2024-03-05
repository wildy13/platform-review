<script setup>
import { useContentStore } from '../../stores/content';

const store = useContentStore();
const { data } = useAuth({ immediate: true })

const search = ref('');
const showCreate = ref(false);
const showEdit = ref(false);

const selected = ref([]);
const itemData = ref({});
const page = ref(1);
const pageCount = ref(10);
const contentData = ref([]);
const dt = ref({});

const columns = [{
    key: 'index',
    label: '#',
    class: 'text-center',
},
{
    key: 'project',
    label: 'Project',
},
{
    key: 'module',
    label: 'Module',
},
{
    key: 'name',
    label: 'Name',
},
{
    key: 'status',
    label: 'File'
}
    , {
    key: 'actions',
    label: 'Actions',
}];

contentData.value = store.items
    .filter(val => val.module.signTo.includes(data.value.user._id))
    .map(val => val);


const items = computed(() => useFilter(contentData.value, search.value, ['name', 'project', 'module']) || []);
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
    dt.value = item;
};

onMounted(async () => {
    await execute();
    if (data.value) {
        contentData.value = store.items
            .filter(val => val.module.signTo.includes(data.value.user._id))
            .map(val => val);
    }
});


const toggleUpload = (row) => {
    showCreate.value = true;
    dt.value = row
}
</script>

<template>
    <div class="w-full">
        <div class="p-4 pt-24">
            <div class="p-10 bg-white rounded-lg">
                <!-- Header -->
                <div class="flex justify-between">
                    <div class="text-2xl font-semibold">Content Management</div>
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
                    </div>
                </div>
                <!-- Table -->
                <UTable v-model="selected" :rows="rows" :columns="columns" :loading="pending" class="max-h-96">
                    <template #index-data="{ index }">
                        <div class="text-center">
                            {{ index + 1 }}
                        </div>
                    </template>
                    <template #project-data="{ row }">
                        <div class="text-center">
                            {{ row.module.project.name }}
                        </div>
                    </template>
                    <template #module-data="{ row }">
                        <div class="text-center">
                            {{ row.module.name }}
                        </div>
                    </template>
                    <template #status-data="{ row }">
                        <div v-if="row.status === true">
                            <UTooltip text="Click me to show">
                                <NuxtLink :to="`/digital-content/${row.module.project.slug}/${row.module.slug}/pages/content/${row.slug}/index.php`">
                                    <UIcon name="i-solar-eye-broken" class="w-5 h-5" />
                                </NuxtLink>
                            </UTooltip>
                        </div>
                        <div v-if="row.status === false">
                            <UTooltip text="upload zip">
                                <div @click="toggleUpload(row)">
                                    <UIcon name="i-solar-upload-bold" class="w-5 h-5" />
                                </div>
                            </UTooltip>
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

            <UserUploadZip :show="showCreate" @close="showCreate = false" :dt="dt" />
            <UserEdit :show="showEdit" @close="showEdit = false" :data="dt" />
        </div>
    </div>
</template>