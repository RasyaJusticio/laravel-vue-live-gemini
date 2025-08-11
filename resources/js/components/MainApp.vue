<script setup lang="ts">
import { Mic, MicOff, Video } from 'lucide-vue-next';
import { useLiveAPIContext } from './LiveAPIContext';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { AudioRecorder } from '@/lib/audio-recorder';
import { Modality } from '@google/genai';

const liveAPI = useLiveAPIContext();

const client = computed(() => liveAPI.client);
const connected = computed(() => liveAPI.connected.value);
const isTalking = computed(() => liveAPI.isTalking.value);

const audioRecorder = ref<AudioRecorder>(new AudioRecorder());
const volume = ref<number>(0);
const muted = ref<boolean>(false);

const onAudioRecorderData = (base64: string) => {
    if (muted.value || isTalking.value) {
        return;
    }

    client.value.sendRealtimeInput([
        {
            mimeType: "audio/pcm;rate=16000",
            data: base64,
        },
    ]);
}

const setInVolume = (amount: number) => {
    volume.value = volume.value + amount;
}

const setMuted = (value: boolean) => {
    muted.value = value;
}

const start = () => {
    liveAPI.setConfig({
        responseModalities: [Modality.AUDIO],
        temperature: 0.7,
        inputAudioTranscription: {
            model: "models/gemini-transcribe-001",
            languageCode: 'id-ID',
        },
        outputAudioTranscription: {
            model: "models/gemini-transcribe-001",
            languageCode: 'id-ID',
        },
        speechConfig: {
            languageCode: 'id-ID',
        },
    })
    liveAPI.connect();
}

watch(connected, () => {
    if (connected.value) {
        audioRecorder.value.on("data", onAudioRecorderData)
        audioRecorder.value.on("volume", setInVolume);
        audioRecorder.value.start();
    } else {
        audioRecorder.value.stop();
    }
});

onMounted(() => {
    setTimeout(() => {
        start();
    }, 3000)
})

onUnmounted(() => {
    audioRecorder.value.off("data", onAudioRecorderData)
    audioRecorder.value.off("volume", setInVolume);
});

</script>

<template>
    <div class="relative w-full h-full border-2 border-blue-950 rounded-xl">
        <div class="absolute flex gap-2 left-1/2 -translate-1/2 bottom-2 border-blue-950 rounded-xl border-2 p-2">
            <button
                class="rounded-xl bg-blue-700 border border-blue-700 text-white cursor-pointer outline-0 p-3 hover:bg-transparent hover:text-blue-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                @click="muted ? setMuted(false) : setMuted(true)">
                <MicOff v-if="muted" />
                <Mic v-else />
            </button>
            <button
                class="rounded-xl bg-blue-700 border border-blue-700 text-white cursor-pointer outline-0 p-3 hover:bg-transparent hover:text-blue-700 transition-colors disabled:opacity-50 disabled:pointer-events-none">
                <Video />
            </button>
        </div>
    </div>
</template>