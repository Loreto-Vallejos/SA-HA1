# 🏛️ ETERNIA - E-Commerce de Ataúdes Personalizados

## 🎯 Descripción del Proyecto
Eternia es una plataforma de e-commerce innovadora especializada en la venta de ataúdes personalizados y temáticos. Ofrecemos diseños únicos que permiten a las familias celebrar la vida de sus seres queridos de manera personalizada y memorable.

## 🚀 Inicio Rápido

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Editor de código (recomendado: VS Code)
- Live Server o servidor HTTP local

### Instalación y Ejecución

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/eternia.git
cd eternia/SA-HA1
```

2. **Opción A: Usar Live Server (VS Code)**
   - Instala la extensión "Live Server" en VS Code
   - Abre el proyecto en VS Code
   - Clic derecho en `index.html` → "Open with Live Server"
   - El sitio se abrirá automáticamente en tu navegador

3. **Opción B: Servidor Python**
```bash
python -m http.server 8000
# Abrir http://localhost:8000 en tu navegador
```

4. **Opción C: Servidor Node.js**
```bash
npm install -g http-server
http-server -p 8000
# Abrir http://localhost:8000 en tu navegador
```

El `index.html` en la raíz redirige automáticamente a `frontend/index.html`.

## 📁 Estructura del Proyecto

```
SA-HA1/
├── 📄 index.html              # Redirección a frontend/
├── 📘 README.md               # Este archivo
│
├── 🖥️ frontend/               # Aplicación web (Ver frontend/README.md)
│   ├── index.html
│   ├── css/                  # Estilos modulares
│   ├── js/                   # JavaScript organizado
│   ├── pages/                # Páginas individuales
│   ├── data/                 # catalogo.json
│   └── assets/               # Imágenes y recursos
│
├── 💾 ecommerce-backend               # backend con API Rest
 
  
```

## 🎨 Características Principales

### Funcionalidades Implementadas
- ✅ **Catálogo de Productos**: Grid moderno con filtros, categorías y búsqueda
- ✅ **Sistema de Carrito**: Gestión completa de productos con localStorage
- ✅ **Wishlist**: Lista de deseos persistente
- ✅ **Sistema de Cotización**: Wizard de 5 pasos para cotizaciones personalizadas
- ✅ **Página de Nosotros**: Storytelling con estadísticas y valores
- ✅ **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- ✅ **Proceso de Pago**: Flujo completo con simulación de procesamiento

### Categorías de Productos
- 🎌 **Anime & Gaming**: Diseños inspirados en cultura otaku
- 🎸 **Urbano & Rock**: Estilo street y rockero
- 💎 **Lujo & Elegancia**: Diseños premium y sofisticados
- ⚽ **Deportes**: Temáticas deportivas
- 🌿 **Naturaleza**: Inspirados en la naturaleza

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modulares con metodología BEM
- **JavaScript (Vanilla)**: Sin frameworks, código limpio y modular
- **Bootstrap 5.3.8**: Framework CSS responsivo
- **Font Awesome 6.5.0**: Biblioteca de iconos
- **Google Fonts**: Outfit & Playfair Display

### Backend (Futuro)
- **Java 17+** con Spring Boot 3.x
- **Spring Data JPA**
- **Spring Security**
- **MySQL 8.0**

## 📖 Guía de Desarrollo para el Equipo

### 🆕 Cómo Agregar Nuevas Páginas

#### Paso 1: Crear la Estructura de Carpetas
```bash
cd frontend/pages
mkdir nueva-pagina
cd nueva-pagina
```

#### Paso 2: Crear el Archivo HTML
Crea `index.html` dentro de la carpeta con esta plantilla:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eternia | Nueva Página</title>

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <!-- CSS Principal (modular) -->
  <link rel="stylesheet" href="../../css/main.css">
</head>
<body>

  <!-- IMPORTANTE: Copia el navbar de otra página y ajusta las rutas -->
  <header class="header">
    <nav class="navbar navbar-expand-md navbar-dark navbar-eternia fixed-top py-3">
      <div class="container">
        <a class="navbar-brand" href="../../index.html">
          <img src="../../assets/logo-eternia-blanco.png" alt="Logo Eternia" class="navbar-logo">
        </a>
        <!-- Resto del navbar -->
      </div>
    </nav>
  </header>

  <main>
    <!-- Aquí va el contenido de tu página -->
    <section class="container py-5">
      <h1>Nueva Página</h1>
    </section>
  </main>

  <!-- IMPORTANTE: Copia el footer de otra página y ajusta las rutas -->
  <footer class="footer fondo-carbon py-5">
    <!-- Footer content -->
  </footer>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../../js/components/navbar.js"></script>
  <script src="../../js/utils/script.js"></script>
</body>
</html>
```

#### Paso 3: Reglas de Rutas (MUY IMPORTANTE)

Desde `frontend/pages/tu-pagina/index.html`:

| Recurso | Ruta Correcta |
|---------|---------------|
| Inicio | `../../index.html` |
| Otra página | `../otra-pagina/` |
| CSS | `../../css/main.css` |
| Imágenes | `../../assets/imagen.png` |
| JavaScript componente | `../../js/components/navbar.js` |
| JavaScript página | `../../js/pages/script.js` |
| JSON (fetch) | `/frontend/data/catalogo.json` (absoluta) |

#### Paso 4: Agregar Enlaces de Navegación
Actualiza el navbar en todas las páginas:
```html
<li class="nav-item">
  <a class="nav-link" href="../nueva-pagina/">Nueva Página</a>
</li>
```

### 🧩 Cómo Agregar Nuevos Componentes

#### Componente CSS

1. **Crear archivo CSS** en `frontend/css/components/`:
```bash
cd frontend/css/components
touch mi-componente.css
```

2. **Escribir estilos** usando metodología BEM:
```css
/* mi-componente.css */
.mi-componente {
  background: var(--color-carbon);
  padding: 2rem;
  border-radius: var(--radius-md);
}

.mi-componente__titulo {
  font-size: 1.5rem;
  color: var(--color-champagne);
  margin-bottom: 1rem;
}

.mi-componente__contenido {
  color: var(--color-text-light);
}

.mi-componente--destacado {
  border: 2px solid var(--color-sandia);
}
```

3. **Importar en main.css**:
```css
/* En frontend/css/main.css */
@import "components/mi-componente.css";
```

#### Componente JavaScript

1. **Crear archivo JS** en `frontend/js/components/`:
```bash
cd frontend/js/components
touch mi-componente.js
```

2. **Escribir código modular**:
```javascript
// mi-componente.js
console.log("✅ mi-componente.js cargado");

function initMiComponente() {
  const elementos = document.querySelectorAll('.mi-componente');

  elementos.forEach(elemento => {
    elemento.addEventListener('click', () => {
      elemento.classList.toggle('mi-componente--activo');
    });
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initMiComponente);
```

3. **Incluir en HTML**:
```html
<script src="../../js/components/mi-componente.js"></script>
```

### 🛍️ Cómo Agregar Nuevos Productos

#### Método 1: Editar catalogo.json (Dinámico)

1. **Abrir** `frontend/data/catalogo.json`

2. **Agregar nuevo producto** siguiendo esta estructura:
```json
{
  "id": 9,
  "nombre": "Nuevo Diseño Personalizado",
  "descripcion": "Descripción breve del producto",
  "precio": 3500000,
  "precioAnterior": 4000000,
  "descuento": "-15%",
  "badgeColor": "sandia",
  "categoria": "anime",
  "imagen": "/frontend/assets/nuevo-producto.png",
  "detalles": {
    "material": "Madera de Roble Premium",
    "medidas": "200cm x 80cm x 60cm",
    "peso": "45kg",
    "garantia": "10 años"
  }
}
```

3. **Campos importantes**:
   - `id`: Número único (incrementa del último)
   - `imagen`: Ruta absoluta `/frontend/assets/...`
   - `badgeColor`: `sandia`, `denim`, `champagne`
   - `categoria`: `anime`, `urbano`, `lujo`, `deportes`, `naturaleza`

4. **Agregar imagen** en `frontend/assets/`:
```bash
cp mi-imagen.png frontend/assets/
```

5. **El producto aparecerá automáticamente** en:
   - Página de catálogo
   - Resultados de búsqueda
   - Filtros por categoría

#### Método 2: Producto Hardcoded (Home)

Para productos destacados en el home (`frontend/index.html`):

```html
<div class="col-12 col-md-6 col-lg-3">
  <article>
    <div class="galeria-productos">
      <figure class="producto">
        <div class="contenedor-imagen">
          <img src="assets/nuevo-producto.png" alt="Nombre del Producto">
          <span class="info sandia">-20%</span>
        </div>

        <figcaption>
          <h3>Nombre del Producto</h3>
          <p>Descripción breve y atractiva</p>
          <p class="precio">
            $2.990.000 <span>$3.490.000</span>
          </p>
        </figcaption>

        <div class="overlay">
          <a href="./carrito.html" class="add-to-cart" data-id="9">Add to cart</a>

          <ul class="acciones">
            <li><a href="#"><img src="assets/share.svg" alt="Compartir"></a></li>
            <li><a href="#"><img src="assets/compare.svg" alt="Comparar"></a></li>
            <li>
              <button class="wishlist-btn" type="button" data-id="9">
                <i class="fa-regular fa-heart"></i>
              </button>
            </li>
          </ul>
        </div>
      </figure>
    </div>
  </article>
</div>
```

### 🎨 Cómo Agregar Estilos Globales

#### Variables CSS

Edita `frontend/css/global/variables.css`:

```css
:root {
  /* Paleta de Colores */
  --color-carbon: #1a1a1a;
  --color-petroleo: #102a34;
  --color-denim: #1e3a5f;
  --color-champagne: #f7e7ce;
  --color-sandia: #c1666b;
  --tu-nuevo-color: #hexcode;

  /* Espaciado */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
```

#### Reset CSS

Edita `frontend/css/global/reset.css` para estilos base globales.

### 📝 Cómo Agregar Scripts de Utilidad

1. **Crear archivo** en `frontend/js/utils/`:
```bash
cd frontend/js/utils
touch mi-utilidad.js
```

2. **Escribir funciones reutilizables**:
```javascript
// mi-utilidad.js

// Formatear precios
export function formatearPrecio(numero) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(numero);
}

// Sanitizar HTML
export function escaparHTML(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

// Validar email
export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

### 🧪 Checklist Antes de Hacer Commit

- [ ] **Probé la página en móvil** (F12 → modo responsive)
- [ ] **Probé la página en desktop** (1920px)
- [ ] **Todos los enlaces funcionan** (navbar, footer)
- [ ] **Las imágenes cargan correctamente**
- [ ] **No hay errores en la consola** (F12)
- [ ] **El código tiene comentarios claros**
- [ ] **Los nombres son descriptivos** (no `cosa.js`)
- [ ] **Las rutas son relativas correctas** (`../../`)
- [ ] **El CSS está modularizado** (no todo en un archivo)
- [ ] **Los IDs son únicos** (no duplicados)

### 🚨 Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| "Cannot GET /..." | Ruta incorrecta | Usar `../` o `../../` correctamente |
| Imagen no carga | Ruta relativa mal | Verificar `../../assets/` |
| CSS no aplica | No importado en main.css | Agregar `@import` |
| JS no ejecuta | Script no incluido | Agregar `<script src="...">` |
| Fetch falla | Ruta JSON relativa | Usar ruta absoluta `/frontend/data/` |
| Navbar roto en móvil | Falta Bootstrap JS | Incluir `bootstrap.bundle.min.js` |

### 📚 Recursos Adicionales

Para información más detallada sobre arquitectura frontend:
- **[Frontend README](frontend/README.md)**: Guía completa de arquitectura
- **Bootstrap 5 Docs**: https://getbootstrap.com/docs/5.3
- **Font Awesome Icons**: https://fontawesome.com/icons

## 🤝 Contribución

### Workflow de Desarrollo
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

### Convención de Commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `style:` Cambios de estilos (CSS)
- `refactor:` Refactorización de código
- `docs:` Cambios en documentación

## 📄 Licencia

Este proyecto es académico. Todos los derechos reservados © 2025 Eternia.

## 👥 Contacto

- **Email**: desarrollo@eternia.cl
- **GitHub**: [Repositorio del Proyecto](https://github.com/tu-usuario/eternia)

---

**Última actualización**: Enero 2026
**Versión**: 2.0.0 (Arquitectura Modular)
**Estado**: ✅ Frontend Completo | 🔜 Backend Pendiente
 
