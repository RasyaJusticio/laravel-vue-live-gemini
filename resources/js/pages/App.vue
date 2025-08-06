<script setup lang="ts">
import MainApp from '@/components/MainApp.vue';
import { Head } from '@inertiajs/vue3';
</script>

<template>

    <Head title="Laravel Vue Live Gemini"></Head>
    <div class="flex h-screen flex-col items-center bg-blue-100 p-6 text-[#1b1b18] lg:justify-center lg:p-8">
        <MainApp />
    </div>
</template>
