/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface Navigator {
  standalone?: boolean;
}

interface Window {
  BeforeInstallPromptEvent: typeof BeforeInstallPromptEvent;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
    'pwa-need-refresh': CustomEvent<boolean>;
    'pwa-offline-ready': CustomEvent<boolean>;
    'force-show-pwa-notification': CustomEvent;
  }
}
