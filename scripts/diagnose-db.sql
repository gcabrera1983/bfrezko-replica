-- Script de diagnóstico para verificar la estructura de la DB
-- Ejecutar esto en el SQL Editor de Supabase

-- 1. Ver si la tabla 'admins' existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'admins';

-- 2. Ver las columnas de la tabla 'admins'
SELECT column_name, data_type, udt_name
FROM information_schema.columns 
WHERE table_name = 'admins';

-- 3. Ver si existe el tipo enum 'AdminRole'
SELECT typname 
FROM pg_type 
WHERE typname = 'AdminRole';

-- 4. Ver los admins existentes
SELECT id, email, name, is_active, created_at 
FROM admins 
LIMIT 5;
