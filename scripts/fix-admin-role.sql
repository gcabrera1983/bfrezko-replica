-- ============================================
-- FIX: Agregar campo 'role' a tabla admins
-- Ejecutar esto en el SQL Editor de Supabase
-- ============================================

-- 1. Crear el tipo enum AdminRole si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AdminRole') THEN
    CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'TRACKER');
  END IF;
END $$;

-- 2. Agregar columna 'role' a la tabla admins si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admins' AND column_name = 'role'
  ) THEN
    ALTER TABLE admins ADD COLUMN role "AdminRole" NOT NULL DEFAULT 'ADMIN';
  END IF;
END $$;

-- 3. (Opcional) Actualizar admins existentes para que tengan role ADMIN
UPDATE admins SET role = 'ADMIN' WHERE role IS NULL;

-- 4. Verificar que todo quedó bien
SELECT id, email, name, role, is_active FROM admins LIMIT 5;
