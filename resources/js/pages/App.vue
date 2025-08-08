<script setup lang="ts">
import { LiveAPIProvider } from '@/components/LiveAPIContext';
import MainApp from '@/components/MainApp.vue';
import { LiveClientOptions } from '@/types/genai';
import { Head } from '@inertiajs/vue3';

interface Props {
    token: string;
}

const props = defineProps<Props>();

const options: LiveClientOptions = {
    apiKey: props.token,
    httpOptions: {
        apiVersion: 'v1alpha'
    }
}

</script>

<template>

    <Head title="Laravel Vue Live Gemini"></Head>
    <div class="flex h-screen flex-col items-center bg-blue-100 p-6 text-[#1b1b18] lg:justify-center lg:p-8">
        <LiveAPIProvider :options="options">
            <MainApp />
        </LiveAPIProvider>
    </div>
</template>
