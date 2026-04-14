// Almacenamiento de imágenes usando IndexedDB (más espacio que localStorage)

const DB_NAME = 'agape-images-db';
const DB_VERSION = 1;
const STORE_NAME = 'images';

let db: IDBDatabase | null = null;

// Inicializar IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
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
  });
};

// Guardar imagen
export const saveImage = async (id: string, dataUrl: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id, dataUrl, timestamp: Date.now() });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Obtener imagen
export const getImage = async (id: string): Promise<string | null> => {
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
export const isStoredImage = (url: string): boolean => {
  return url.startsWith('indexeddb://');
};

// Obtener ID de imagen almacenada desde URL
export const getStoredImageId = (url: string): string | null => {
  if (isStoredImage(url)) {
    return url.replace('indexeddb://', '');
  }
  return null;
};

// Crear URL de imagen almacenada
export const createStoredImageUrl = (id: string): string => {
  return `indexeddb://${id}`;
};
