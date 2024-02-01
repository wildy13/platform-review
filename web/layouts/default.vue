<template>
    <UContainer class="w-full min-h-screen">
        <Navbar />
        <div class="flex w-full">
            <Sidebar class="w-2/12" />
            <slot class="w-10/12" />
        </div>
    </UContainer>
</template>