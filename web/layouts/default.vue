<template>
    <UContainer class="flex w-full min-h-screen">
        <Sidebar class="w-2/12"/>
        <div class="flex flex-col w-10/12">
            <Navbar />
            <slot />
        </div>
    </UContainer>
</template>