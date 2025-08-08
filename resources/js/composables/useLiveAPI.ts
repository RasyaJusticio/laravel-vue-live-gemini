import { ref, onMounted, onUnmounted, Ref } from 'vue';
import { GenAILiveClient } from '../lib/genai-live-client';
import { LiveClientOptions } from '../types/genai';
import { AudioStreamer } from '../lib/audio-streamer';
import { audioContext } from '../lib/utils';
import VolMeterWorket from '../lib/worklets/vol-meter';
import { LiveConnectConfig } from '@google/genai';

export interface UseLiveAPIResults {
  client: GenAILiveClient;
  config: Ref<LiveConnectConfig>;
  setConfig: (config: LiveConnectConfig) => void;
  model: Ref<string>;
  setModel: (model: string) => void;
  connected: Ref<boolean>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  volume: Ref<number>;
  isTalking: Ref<boolean>;
}

export function useLiveAPI(options: LiveClientOptions): UseLiveAPIResults {
  const client = new GenAILiveClient(options);
  const audioStreamer = ref<AudioStreamer | null>(null);
  const model = ref('models/gemini-2.0-flash-exp');
  const config = ref<LiveConnectConfig>({});
  const connected = ref(false);
  const isTalking = ref<boolean>(false);
  const volume = ref(0);

  onMounted(async () => {
    const audioCtx = await audioContext({ id: 'audio-out' });
    audioStreamer.value = new AudioStreamer(audioCtx);
    await audioStreamer.value.addWorklet('vumeter-out', VolMeterWorket, (ev: any) => {
      volume.value = ev.data.volume;
    });
  });

  const onOpen = () => {
    connected.value = true;
  };

  const onClose = () => {
    connected.value = false;
    stopAudioStreamer();
  };

  const onError = (error: ErrorEvent) => {
    console.error('error', error);
  };

  const stopAudioStreamer = () => {
    audioStreamer.value?.stop();
  };

  const onAudio = (data: ArrayBuffer) => {
    audioStreamer.value?.addPCM16(new Uint8Array(data));
    isTalking.value = true;
  };

  const onSetupComplete = () => {
    setTimeout(() => {
      client.send({ text: "Anda bisa memulai percakapan terlebih dahulu." }, true)
    }, 1000)
  }

  const onTurnComplete = () => {
    isTalking.value = false;
  }

  onMounted(() => {
    client
      .on('error', onError)
      .on('open', onOpen)
      .on('close', onClose)
      .on('audio', onAudio)
      .on('setupcomplete', onSetupComplete)
      .on('turncomplete', onTurnComplete);
  });

  onUnmounted(() => {
    client
      .off('error', onError)
      .off('open', onOpen)
      .off('close', onClose)
      .off('audio', onAudio)
      .off('setupcomplete', onSetupComplete)
      .off('turncomplete', onTurnComplete)
      .disconnect();
  });

  const connect = async () => {
    if (!config.value) {
      throw new Error('config has not been set');
    }
    client.disconnect();
    await client.connect(model.value, config.value);
  };

  const disconnect = async () => {
    client.disconnect();
    connected.value = false;
  };

  return {
    client,
    config,
    setConfig: (newConfig: LiveConnectConfig) => { config.value = newConfig; },
    model,
    setModel: (newModel: string) => { model.value = newModel; },
    connected,
    connect,
    disconnect,
    volume,
    isTalking,
  };
}