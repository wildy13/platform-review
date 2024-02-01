<script setup>
const items = [
    {
        label: 'Dashboard',
        to: '/dashboard',
    },
    {
        label: 'Project',
        subs: [
            { label: 'Category', to: '/project/category' },
            { label: 'Module', to: '/project/module' },
            { label: 'Content', to: '/project/content' },
        ],
    },
];

const adminItems = [
    {
        label: 'Management',
        subs: [
            { label: 'User', to: '/management/users' },
            { label: 'Roles', to: '/management/roles' },
        ],
    }
];

const route = useRoute();
const { data } = useAuth();
const scope = effectScope();

const allItems = computed(() => (data.value?.user.role.name === 'admin' ? [...items, ...adminItems] : items));

const statuses = ref(allItems.value.map(() => ({ isOpen: false, isActive: false })));

const toggleOpen = (index) => {
    const { isOpen } = statuses.value[index];
    statuses.value = statuses.value.map((status, idx) => (idx === index
        ? { ...status, isOpen: allItems.value[index].to ? true : !isOpen, isActive: true }
        : { ...status, isOpen: false, isActive: false }));
};

const findMatchingIndex = (path) => allItems.value.findIndex(
    (item) => path.includes(item.to) || (item.subs?.some((sub) => path.includes(sub.to))),
);

scope.run(() => {
    watch(() => route.path, (value) => {
        const index = findMatchingIndex(value);
        statuses.value = statuses.value.map((status, idx) => (idx === index
            ? { ...status, isOpen: true, isActive: true }
            : { ...status, isOpen: false, isActive: false }));
    });
});

onMounted(() => {
    const index = findMatchingIndex(route.path);
    if (index !== -1) {
        statuses.value[index] = { isOpen: true, isActive: true };
    }
});

onScopeDispose(() => scope.stop());
</script>

<template>
    <div class="p-4">
        <ul>
            <li v-for="(item, index) in allItems" :key="index" class="mt-4">
                <UButton color="gray" variant="ghost" square :label="item.label" :to="item.to" :padded="false"
                    :class="[statuses[index].isActive && 'text-blue-600']"
                    class="w-full hover:text-blue-600 hover:bg-transparent" @click="toggleOpen(index)">
                    <template v-if="!item.to" #trailing>
                        <UIcon name="i-solar-alt-arrow-down-line-duotone"
                            class="w-5 h-5 ms-auto transform transition-transform duration-200"
                            :class="[statuses[index].isOpen && 'rotate-90']" />
                    </template>
                </UButton>
                <ul v-show="statuses[index].isOpen && !item.to" class="border-l">
                    <li v-for="(sub, idx) in item.subs" :key="idx" class="mt-4">
                        <ULink :to="sub.to" active-class="text-blue-600 border-l border-blue-400"
                            inactive-class="text-gray-700 border-l border-transparent" class="flex items-center w-full pl-4 space-x-3 relative
                  hover:text-blue-600 hover:border-l hover:border-blue-400">
                            <span>{{ sub.label }}</span>
                        </ULink>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
