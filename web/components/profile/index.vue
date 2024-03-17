<script setup>
import slug from 'slug'
const route = useRoute();
const { data } = useAuth()

const showEdit = ref(false)
const itemData = ref({});

const editDialog = (item) => {
    showEdit.value = true;
    itemData.value = item;
};

</script>

<template>
    <div class="pt-4 w-full">
        <div class="flex space-x-24 w-full">
            <UAvatar  :src="`/image/users/${slug(data.user.username)}.png`" size="xl" :alt="data.user.username"
                :ui="{ size: { xl: 'h-72 w-72 text-4xl' } }" class="bg-contain" />
            <div class="flex flex-col justify-between w-full">
                <div class="flex flex-col space-y-12">
                    <div>
                        <div   class="text-3xl">{{ data.user.username }}</div>
                        <div class="text-lg text-gray-400">({{ data.user.role.name }})</div>
                    </div>

                    <div class="text-xl">{{ data.user.bio }}</div>
                </div>
                <div class="flex justify-between items-center w-full space-x-4">
                    <UButton class="w-1/2 h-12 bg-white flex  items-center justify-center rounded-lg" @click="editDialog(data.user)">edit  profile</UButton>
                    <div class="w-1/2 h-12 bg-white flex  items-center justify-center rounded-lg">change password</div>
                </div>
            </div>
        </div>

        <ProfileEdit :show="showEdit" :data="itemData" @close="showEdit = false" />
    </div>
</template>