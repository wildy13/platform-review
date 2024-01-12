<template>
    <div class="p-4 flex flex-col space-y-12">
        <div class="text-xl font-semibold text-center">DASHBOARD</div>
        <div class="flex flex-col space-y-4 justify-between h-full">
            <div class="flex flex-col space-y-4">
                <div class="flex items-center space-x-4">
                    <UIcon name="i-solar-widget-2-bold" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                    <span>Dashboard</span>
                </div>

                <div class="flex items-center space-x-4">
                    <UIcon name="i-solar-shield-user-bold" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                    <span>Users Management</span>
                </div>

                <div class="flex items-center space-x-4">
                    <UIcon name="i-solar-user-id-bold" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                    <span>Roles Management</span>
                </div>

            </div>
            <div class="flex items-center space-x-4">
                <UIcon name="i-solar-logout-3-bold-duotone" class="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                <span>Logout</span>
            </div>
        </div>
    </div>
</template>