const watchSkippers: Partial<Record<string, number>> = {};

export function skipWatcher(watcher: string, durationMs = 10) {
  watchSkippers[watcher] = Date.now() + durationMs;
}

export function handleWatcher(watcher: string, handler: () => void) {
  if (watcher in watchSkippers) {
    const dateTime = watchSkippers[watcher] as number;
    if (Date.now() < dateTime)
      return;
    delete watchSkippers[watcher];
  }
  handler();
}
