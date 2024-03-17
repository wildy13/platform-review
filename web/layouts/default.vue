<!-- <template>
    <div class="min-h-screen">
        <div class="w-full h-full">
            <div class="    w-full border-b-2">
                <UContainer>
                    <Navbar class="h-[8%]" />
                </UContainer>
            </div>
            <UContainer class="h-[92%]">
                <div class="h-full flex space-x-10 ">
                    <Sidebar class="border-r-2" />
                    <slot />
                </div>
            </UContainer>
        </div>
    </div>
</template> -->

<template>
    <div>
        <div class="fixed top-0 left-0 w-full border-b-2 z-50 bg-gray-100">
            <UContainer>
                <Navbar class="h-[8%]" />
            </UContainer>
        </div>
        <UContainer>
            <div class="min-h-screen flex space-x-10 pt-16 ">
                <Sidebar class="border-r-2" />
                <slot />
            </div>
        </UContainer>
    </div>
</template>