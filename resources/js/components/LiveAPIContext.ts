import { defineComponent, provide, SetupContext, inject } from 'vue';
import { useLiveAPI, UseLiveAPIResults } from '../composables/useLiveAPI';
import { LiveClientOptions } from '../types/genai';

const LiveAPIKey = Symbol('LiveAPI');

export const LiveAPIProvider = defineComponent({
  props: {
    options: {
      type: Object as () => LiveClientOptions,
      required: true,
    },
  },
  setup(props, { slots }: SetupContext) {
    const liveAPI = useLiveAPI(props.options);
    provide(LiveAPIKey, liveAPI);
    return () => slots.default?.();
  },
});

export function useLiveAPIContext(): UseLiveAPIResults {
  const context = inject<UseLiveAPIResults>(LiveAPIKey);
  if (!context) {
    throw new Error('useLiveAPIContext must be used within a LiveAPIProvider');
  }
  return context;
}