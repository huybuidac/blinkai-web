import { experimental_createPersister } from '@tanstack/query-persist-client-core';
import { get, set, del } from 'idb-keyval';

export const storagePersister = experimental_createPersister({
  storage: {
    getItem: (key: string) => get(key),
    setItem: (key: string, value: string) => set(key, value),
    removeItem: (key: string) => del(key)
  }
}) as any;
