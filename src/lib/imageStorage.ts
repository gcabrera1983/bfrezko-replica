// Servicio de almacenamiento de imágenes usando IndexedDB
// Permite guardar imágenes grandes sin el límite de localStorage

const DB_NAME = "AgapeStudioDB";
const DB_VERSION = 1;
const STORE_NAME = "images";

interface ImageRecord {
  id: string;
  data: string;
  timestamp: number;
}

class ImageStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
    });
  }

  async saveImage(id: string, data: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      
      const record: ImageRecord = {
        id,
        data,
        timestamp: Date.now(),
      };

      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getImage(id: string): Promise<string | null> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result as ImageRecord | undefined;
        resolve(result?.data || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteImage(id: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearOldImages(keepIds: string[]): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          const record = cursor.value as ImageRecord;
          if (!keepIds.includes(record.id)) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
}

// Generar ID único para imagen basado en producto
export function generateImageId(productId: string, index: number): string {
  return `img_${productId}_${index}`;
}

// Exportar instancia singleton
export const imageStorage = new ImageStorage();

// Función helper para guardar todas las imágenes de un producto
export async function saveProductImages(productId: string, images: string[]): Promise<string[]> {
  const savedRefs: string[] = [];
  
  for (let i = 0; i < images.length; i++) {
    const imageId = generateImageId(productId, i);
    
    // Si es base64, guardar en IndexedDB y retornar referencia
    if (images[i].startsWith("data:")) {
      await imageStorage.saveImage(imageId, images[i]);
      savedRefs.push(`ref:${imageId}`);
    } else {
      // Si es URL, guardarla directamente
      savedRefs.push(images[i]);
    }
  }
  
  return savedRefs;
}

// Función helper para cargar todas las imágenes de un producto
export async function loadProductImages(imageRefs: string[]): Promise<string[]> {
  const loadedImages: string[] = [];
  
  for (const ref of imageRefs) {
    if (ref.startsWith("ref:")) {
      // Es una referencia a IndexedDB
      const imageId = ref.substring(4);
      const data = await imageStorage.getImage(imageId);
      if (data) {
        loadedImages.push(data);
      }
    } else {
      // Es una URL directa
      loadedImages.push(ref);
    }
  }
  
  return loadedImages;
}

// Limpiar imágenes huérfanas
export async function cleanupOrphanImages(productIds: string[]): Promise<void> {
  const keepIds: string[] = [];
  for (const productId of productIds) {
    // Asumimos máximo 5 imágenes por producto
    for (let i = 0; i < 5; i++) {
      keepIds.push(generateImageId(productId, i));
    }
  }
  await imageStorage.clearOldImages(keepIds);
}
