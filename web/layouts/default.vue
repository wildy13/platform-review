<template>
    <div>
        <div class="fixed top-0 left-0 w-full border-b-2 z-50 bg-white">
            <Navbar class="h-[8%]" />
        </div>
        <div class="min-h-screen flex space-x-10 pt-16 ">
            <div class=" bg-white w-2/12 border-r-2">
                <Sidebar />
            </div>
            <slot />
        </div>
    </div>
</template>