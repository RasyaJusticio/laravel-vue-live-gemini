<script setup lang="ts">
import { Mic, Video } from 'lucide-vue-next';

</script>

<template>
    <div class="relative w-full h-full border-2 border-blue-950 rounded-xl">
        <button class="absolute rounded-xl bg-blue-700 border border-blue-700 text-white cursor-pointer outline-0 p-3 hover:bg-transparent hover:text-blue-700 transition-colors disabled:opacity-50 disabled:pointer-events-none top-4 left-1/2 -translate-x-1/2">
            Connect
        </button>
        <div class="absolute flex gap-2 left-1/2 -translate-1/2 bottom-2 border-blue-950 rounded-xl border-2 p-2">
            <button
                class="rounded-xl bg-blue-700 border border-blue-700 text-white cursor-pointer outline-0 p-3 hover:bg-transparent hover:text-blue-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                <Mic />
            </button>
            <button
                class="rounded-xl bg-blue-700 border border-blue-700 text-white cursor-pointer outline-0 p-3 hover:bg-transparent hover:text-blue-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                <Video />
            </button>
        </div>
    </div>
</template>