<script setup>
import { watch } from 'vue';
import { useUsersStore } from '../../stores/users'
import slug from 'slug'

const { data } = useAuth()

const showEditPhotoProfile = ref(false)
const showEditProfile = ref(false)
const showChangePassword = ref(false)

const itemData = ref({});

const user = useUsersStore();

const editPhotoProfile = (item) => {
    showEditPhotoProfile.value = true;
    itemData.value = item;
};

const editProfile = (item) => {
    showEditProfile.value = true;
    itemData.value = item;
};

const changePassword = () => {
    showChangePassword.value = true;
};

</script>

<template>
    <div class="pt-4 w-full">
        <div class="pt-4 text-2xl font-semibold py-4">Profile</div>
        <UContainer class="flex flex-col items-center  w-full bg-white p-4 rounded-lg">
            <div class="flex space-x-24">
                <UAvatar :src="`/image/users/${slug(data.user.username) || user.avatar}.png`" size="xl"
                    :alt="data.user.username" :ui="{ size: { xl: 'h-72 w-72 text-4xl' } }" class="bg-contain" >
                    <UTooltip text="Edit Picture" class="absolute top-0 right-0">
                        <UButton icon="i-solar-pen-2-linear" size="xs" variant="ghost" color="gray" :padded="false"
                            @click="editPhotoProfile(data.user)" />
                    </UTooltip>
                </UAvatar>

                <div class="flex flex-col justify-between w-full">
                    <div class="h-full flex flex-col justify-center space-y-4">
                        <div>
                            <div class="text-3xl">{{ data.user.username }}</div>
                            <div class="text-lg text-gray-400">({{ data.user.role.name }})</div>
                            <div class="pt-4">
                                <div class="text-gray-400">Email address</div>
                                <div class="text-xl">{{ data.user.email }}</div>
                            </div>
                        </div>

                        <div>
                            <div class="text-gray-400">Biografy</div>
                            <div class="text-xl">{{ data.user.bio }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4 space-x-4">
                <UButton @click="editProfile(data.user)" color="white" class="w-[300px]">
                    <span class="text-center w-full">Edit Profile</span>
                </UButton>
                <UButton @click="changePassword()" color="white" class="w-[300px]">
                    <span class="text-center w-full">Edit Password</span>
                </UButton>
            </div>
        </UContainer>
        <ProfilePhoto :show="showEditPhotoProfile" :data="itemData" @close="showEditPhotoProfile = false" />
        <ProfileEdit :show="showEditProfile" :data="itemData" @close="showEditProfile = false" />
        <ProfileChangePassword :show="showChangePassword"  @close="showChangePassword = false" />
    </div>
</template>