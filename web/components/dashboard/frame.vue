<script setup>
const route = useRoute();
const config = useRuntimeConfig();
</script>

<template>
    <div class="w-full">
        <iframe :src="`${config.public.auth.origin}/digital-content/${route.params.projectName}/${route.params.moduleName}`" class="w-full h-full" />
    </div>
</template>
