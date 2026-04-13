import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "he-loved-me-so-much",
    name: "He Loved Me So Much",
    description: "Playera negra con el mensaje 'He Loved Me So Much'. Confeccionada en 100% algodón de 342g. Un recordatorio poderoso del amor incondicional del Padre.",
    price: 185.00,
    originalPrice: 250.00,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop",
    ],
    category: "Colección Principal",
    tags: ["He Loved Me So Much", "Algodón 100%", "Nuevo"],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Negro", value: "#000000" },
    ],
    inStock: true,
    isNew: true,
    isBestseller: true
  },
  {
    id: "gods-with-me",
    name: "God's With Me",
    description: "Playera blanca con el mensaje 'God's With Me'. 100% algodón de 342g. Un recordatorio constante de que no estamos solos, Él está con nosotros.",
    price: 185.00,
    originalPrice: 250.00,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop",
    ],
    category: "Colección Principal",
    tags: ["God's With Me", "Algodón 100%", "Nuevo"],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Blanco", value: "#FFFFFF" },
    ],
    inStock: true,
    isNew: true,
    isBestseller: true
  },
  {
    id: "the-agape-foundation",
    name: "The Agape Foundation",
    description: "Playera con el logo oficial de Ágape Studio. 100% algodón de 342g. Representa los valores de amor incondicional, fe y esperanza.",
    price: 185.00,
    originalPrice: 250.00,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop",
    ],
    category: "Colección Principal",
    tags: ["The Agape Foundation", "Logo", "Algodón 100%"],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Negro", value: "#000000" },
      { name: "Beige", value: "#D4A574" },
      { name: "Blanco", value: "#FFFFFF" },
    ],
    inStock: true,
    isBestseller: true
  },
];

export const categories = [
  { name: "Todas", slug: "all" },
  { name: "Colección Principal", slug: "coleccion-principal" },
  { name: "Edición Especial", slug: "edicion-especial" },
  { name: "Manga Larga", slug: "manga-larga" },
  { name: "Performance", slug: "performance" },
];
