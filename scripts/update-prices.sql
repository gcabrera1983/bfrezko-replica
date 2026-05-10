-- Actualizar precios de todas las playeras
-- Precio de oferta: Q150 | Precio normal (tachado): Q185

UPDATE products
SET 
  price = 150.00,
  "originalPrice" = 185.00
WHERE 1=1;

-- Verificar cambios
SELECT id, name, price, "originalPrice" FROM products;
