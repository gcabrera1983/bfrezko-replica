// Almacenamiento de imágenes usando IndexedDB (más espacio que localStorage)
// Fallback a localStorage para móviles con problemas de IndexedDB

const DB_NAME = 'agape-images-db';
const DB_VERSION = 1;
const STORE_NAME = 'images';
const FALLBACK_KEY = 'agape-images-fallback';

let db: IDBDatabase | null = null;
let useFallback = false;

// Verificar si IndexedDB está disponible (no en modo privado)
const isIndexedDBAvailable = (): boolean => {
  try {
    return !!window.indexedDB;
  } catch {
    return false;
  }
};

// Fallback storage usando localStorage con compresión básica
const fallbackStorage = {
  get: (id: string): string | null => {
    try {
      const data = localStorage.getItem(`${FALLBACK_KEY}-${id}`);
      return data;
    } catch {
      return null;
    }
  },
  set: (id: string, dataUrl: string): boolean => {
    try {
      localStorage.setItem(`${FALLBACK_KEY}-${id}`, dataUrl);
      return true;
    } catch {
      console.warn('[imageStorage] Fallback lleno, limpiando...');
      // Limpiar imágenes antiguas del fallback
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(FALLBACK_KEY)) {
          localStorage.removeItem(key);
        }
      }
      try {
        localStorage.setItem(`${FALLBACK_KEY}-${id}`, dataUrl);
        return true;
      } catch {
        return false;
      }
    }
  }
};

// Inicializar IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (useFallback) {
      reject(new Error('Using fallback'));
      return;
    }
    
    if (db) {
      resolve(db);
      return;
    }

    if (!isIndexedDBAvailable()) {
      useFallback = true;
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      useFallback = true;
      reject(request.error);
    };
    
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    
    // Timeout para móviles lentos
    setTimeout(() => {
      if (!db) {
        useFallback = true;
        reject(new Error('IndexedDB timeout'));
      }
    }, 3000);
  });
};

// Guardar imagen
export const saveImage = async (id: string, dataUrl: string): Promise<void> => {
  try {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ id, dataUrl, timestamp: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Usar fallback
    fallbackStorage.set(id, dataUrl);
  }
};

// Obtener imagen
export const getImage = async (id: string): Promise<string | null> => {
  try {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.dataUrl : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Usar fallback
    return fallbackStorage.get(id);
  }
};

// Eliminar imagen
export const deleteImage = async (id: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Limpiar imágenes antiguas
export const cleanupOldImages = async (maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<void> => {
  const database = await initDB();
  const transaction = database.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.openCursor();
  const now = Date.now();

  request.onsuccess = (event) => {
    const cursor = (event.target as IDBRequest).result;
    if (cursor) {
      if (now - cursor.value.timestamp > maxAge) {
        cursor.delete();
      }
      cursor.continue();
    }
  };
};

// Verificar si una URL es una imagen en base64 almacenada
export const isStoredImage = (url: string | undefined | null): boolean => {
  return typeof url === 'string' && url.startsWith('indexeddb://');
};

// Obtener ID de imagen almacenada desde URL
export const getStoredImageId = (url: string | undefined | null): string | null => {
  if (isStoredImage(url)) {
    return url.replace('indexeddb://', '');
  }
  return null;
};

// Crear URL de imagen almacenada
export const createStoredImageUrl = (id: string): string => {
  return `indexeddb://${id}`;
};
