# Actualización de Dependencias

## Problema
Advertencias de paquetes obsoletos en Vercel:
- rimraf@3.0.2
- glob@7.2.3 / glob@10.3.10
- eslint@8.57.1
- inflight@1.0.6

## Solución

### Opción A: Ignorar (Seguro para producción)
Estas advertencias no afectan el funcionamiento. Son dependencias internas de Next.js 14.

### Opción B: Actualizar a Next.js 15

```bash
# 1. Actualizar package.json
npm install next@latest react@latest react-dom@latest

# 2. Actualizar ESLint
npm install eslint@latest eslint-config-next@latest --save-dev

# 3. Verificar compatibilidad
npm run build
```

### Opción C: Forzar versiones nuevas

Agregar a `package.json`:

```json
{
  "overrides": {
    "glob": "^11.0.0",
    "rimraf": "^6.0.1",
    "inflight": "^2.0.0"
  }
}
```

Luego:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Verificación

```bash
npm run build
```

Si compila sin errores, el deploy funcionará correctamente.
