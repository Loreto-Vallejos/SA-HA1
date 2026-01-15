# 🏛️ ETERNIA - Arquitectura del Proyecto

## 📋 Tabla de Contenidos
1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Convenciones y Estándares](#convenciones-y-estándares)
3. [Guía para Agregar Nuevas Páginas](#guía-para-agregar-nuevas-páginas)
4. [Guía para Agregar Componentes](#guía-para-agregar-componentes)
5. [Sistema CSS Modular](#sistema-css-modular)
6. [Organización de JavaScript](#organización-de-javascript)
7. [Gestión de Assets](#gestión-de-assets)
8. [Inicio Rápido](#inicio-rápido)

---

## 🏗️ Estructura del Proyecto

```
SA-HA1/
├── 📄 index.html                    # Redirección automática a frontend/
├── 📘 README.md                     # Este archivo
│
├── 🖥️ frontend/                     # FRONTEND - Aplicación web
│   ├── 📄 index.html                # Página principal (Home)
│   ├── 📄 blog.html                 # Página de blog
│   │
│   ├── 🎨 css/                      # Estilos modulares
│   │   ├── 📄 main.css              # Importa todos los módulos
│   │   ├── 📁 global/               # Estilos globales
│   │   │   ├── variables.css        # Variables CSS (colores, espaciado, etc.)
│   │   │   └── reset.css            # Reset y estilos base
│   │   ├── 📁 components/           # Componentes reutilizables
│   │   │   ├── navbar.css
│   │   │   ├── footer.css
│   │   │   ├── buttons.css
│   │   │   ├── cards.css
│   │   │   └── hero.css
│   │   └── 📁 pages/                # Estilos específicos por página
│   │       ├── home.css
│   │       ├── catalogo.css
│   │       ├── nosotros.css
│   │       ├── cotizacion.css
│   │       ├── cart.css
│   │       └── payment.css
│   │
│   ├── 💻 js/                       # JavaScript modular
│   │   ├── 📁 components/           # Componentes JS
│   │   │   └── navbar.js            # Lógica del navbar (scroll, móvil)
│   │   ├── 📁 pages/                # Lógica específica por página
│   │   │   ├── catalogo.js          # Filtros, búsqueda, paginación
│   │   │   ├── cuenta.js            # Dashboard de usuario
│   │   │   ├── wishlist.js          # Lista de deseos
│   │   │   ├── crear-producto.js    # Admin de productos
│   │   │   ├── productos.js         # Detalle de producto
│   │   │   └── cotizacion.js        # Wizard de cotización
│   │   └── 📁 utils/                # Utilidades y helpers
│   │       └── script.js            # Funciones comunes (localStorage, etc.)
│   │
│   ├── 📁 pages/                    # Páginas organizadas por carpeta
│   │   ├── 📁 catalogo/
│   │   │   └── index.html
│   │   ├── 📁 cuenta/
│   │   │   └── index.html
│   │   ├── 📁 nosotros/
│   │   │   └── index.html
│   │   ├── 📁 contactanos/
│   │   │   └── index.html
│   │   ├── 📁 wishlist/
│   │   │   └── index.html
│   │   ├── 📁 carrito/
│   │   │   └── index.html
│   │   ├── 📁 politica-privacidad/
│   │   │   └── index.html
│   │   ├── 📁 crear-producto/
│   │   │   └── index.html
│   │   └── 📁 producto/
│   │       └── index.html           # Detalle de producto
│   │
│   ├── 📦 data/                     # Datos JSON
│   │   └── catalogo.json            # Base de datos de productos
│   │
│   ├── 🖼️ assets/                   # Recursos multimedia
│   │   ├── logo-eternia-blanco.png
│   │   ├── logo-web-pay-plus.png
│   │   ├── *.png                    # Imágenes de productos
│   │   └── *.svg                    # Iconos
│   │
│   └── 🗄️ _backup/                  # Archivos legacy
│       └── style.css                # CSS antiguo monolítico
│
├── 📁 backend/                      # BACKEND - Spring Boot (futuro)
│   ├── src/
│   ├── pom.xml
│   └── README.md
│
├── 📁 database/                     # Scripts de base de datos
│   ├── diagrams/
│   ├── docker/
│   │   └── docker-compose.yml
│   └── scripts/
│       ├── 01_create_database.sql
│       └── 02_insert_data.sql
│
└── 📁 bruno/                        # Colección API para testing
    └── proyecto-api/
```

---

## 📏 Convenciones y Estándares

### Nomenclatura de Archivos
- **HTML**: Siempre `index.html` dentro de su carpeta
- **CSS**: `kebab-case.css` (ej: `home-hero.css`)
- **JavaScript**: `camelCase.js` para páginas, `PascalCase.js` para clases
- **Imágenes**: `descriptive-name.png` en inglés

### Estructura de Carpetas de Páginas
Cada página debe tener su propia carpeta con `index.html`:
```
pages/
  └── nombre-pagina/
      └── index.html
```

### Rutas Relativas
- **Desde `frontend/index.html`**: 
  - CSS: `css/main.css`
  - JS: `js/components/navbar.js`
  - Assets: `assets/logo.png`
  - Páginas: `pages/catalogo/`

- **Desde `frontend/pages/*/index.html`**:
  - CSS: `../../css/main.css`
  - JS: `../../js/components/navbar.js`
  - Assets: `../../assets/logo.png`
  - Otras páginas: `../catalogo/`
  - Home: `../../index.html`

---

## 🆕 Guía para Agregar Nuevas Páginas

### Paso 1: Crear la Estructura
```bash
# Ejemplo: Agregar página "servicios"
mkdir -p frontend/pages/servicios
```

### Paso 2: Crear el HTML
Crea `frontend/pages/servicios/index.html` con esta plantilla:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Eternia | Servicios</title>
  
  <!-- Meta tags -->
  <meta name="description" content="Descripción de la página" />
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
  
  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  
  <!-- CSS Modular -->
  <link rel="stylesheet" href="../../css/main.css" />
</head>

<body>
  <!-- Header con Navbar -->
  <header class="header">
    <nav class="navbar navbar-expand-md navbar-dark navbar-eternia fixed-top py-3">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="../../index.html">
          <img src="../../assets/logo-eternia-blanco.png" alt="Logo Eternia" class="navbar-logo">
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav ms-auto mb-2 mb-md-0 align-items-md-center">
            <li class="nav-item">
              <a class="nav-link nav-anim" href="../../index.html">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link nav-anim" href="../catalogo/">Catálogo</a>
            </li>
            <li class="nav-item">
              <a class="nav-link nav-anim" href="../nosotros/">Nosotros</a>
            </li>
            <li class="nav-item d-flex align-items-center gap-2 ms-md-2 navbar-icons">
              <a class="nav-link nav-icon" href="../cuenta/">
                <i class="fa-regular fa-user"></i>
              </a>
              <a class="nav-link nav-icon position-relative" href="../wishlist/">
                <i class="fa-regular fa-heart"></i>
                <span id="wishlistCount" class="badge-wishlist">0</span>
              </a>
              <a class="nav-link nav-icon position-relative" href="../carrito/">
                <i class="fa-solid fa-cart-shopping"></i>
              </a>
            </li>
            <li class="nav-item ms-md-2">
              <a class="btn btn-eternia-cta px-3" href="../contactanos/">Cotizar</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <!-- CONTENIDO PRINCIPAL -->
  <main>
    <!-- Tu contenido aquí -->
  </main>

  <!-- Footer -->
  <footer class="footer footer--modern py-5">
    <div class="container">
      <div class="footer__topline"></div>
      <div class="row g-4 align-items-start pt-4">
        <div class="col-12 col-lg-5">
          <a href="../../index.html" class="footer__brand">
            <img src="../../assets/logo-eternia-blanco.png" alt="Logo Eternia" class="navbar-logo">
          </a>
          <p class="footer__desc mt-3 mb-4">
            Tu último viaje, a tu manera.<br>
            Ataúdes personalizados que celebran la vida.
          </p>
        </div>
        <div class="col-6 col-lg-3">
          <h6 class="footer__title">Explorar</h6>
          <ul class="list-unstyled footer__list mb-0">
            <li><a class="footer__link" href="../../index.html">Inicio</a></li>
            <li><a class="footer__link" href="../catalogo/">Catálogo</a></li>
            <li><a class="footer__link" href="../nosotros/">Nosotros</a></li>
            <li><a class="footer__link" href="../contactanos/">Contacto</a></li>
          </ul>
        </div>
        <div class="col-6 col-lg-4">
          <h6 class="footer__title">Legal</h6>
          <ul class="list-unstyled footer__list mb-3">
            <li><a class="footer__link" href="../politica-privacidad/">Política de privacidad</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom mt-5 pt-4">
        <p class="mb-0 footer__copy">© 2025 Eternia. Todos los derechos reservados.</p>
        <img src="../../assets/logo-web-pay-plus.png" alt="Logo webpay" class="footer__logo_wp">
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../../js/components/navbar.js"></script>
  <script src="../../js/utils/script.js"></script>
  <script src="../../js/pages/wishlist.js"></script>
  <!-- Script específico de la página (opcional) -->
  <script src="../../js/pages/servicios.js"></script>
</body>
</html>
```

### Paso 3: Crear CSS Específico (si es necesario)
Si la página necesita estilos únicos:

1. Crea `frontend/css/pages/servicios.css`
2. Agrégalo a `frontend/css/main.css`:
```css
@import url('./pages/servicios.css');
```

### Paso 4: Crear JavaScript Específico (si es necesario)
Si la página necesita lógica propia:

1. Crea `frontend/js/pages/servicios.js`
2. Inclúyelo en el HTML (ya incluido en la plantilla)

### Paso 5: Actualizar Navegación
Agrega el enlace en:
- `frontend/index.html` (navbar)
- Todas las páginas en `frontend/pages/*/index.html` (navbar)
- Footer de todas las páginas

---

## 🧩 Guía para Agregar Componentes

### Componentes CSS

#### Crear un Nuevo Componente CSS
```bash
# Ejemplo: agregar componente "modal"
```

1. Crea `frontend/css/components/modal.css`:
```css
/* ================================================
   COMPONENTE: MODAL
   ================================================ */

.modal-custom {
  /* Estilos del modal */
}

.modal-custom__header {
  /* Estilos del header */
}

.modal-custom__body {
  /* Estilos del body */
}
```

2. Impórtalo en `frontend/css/main.css`:
```css
@import url('./components/modal.css');
```

### Componentes JavaScript

#### Crear un Nuevo Componente JS
```bash
# Ejemplo: agregar componente "dropdown"
```

1. Crea `frontend/js/components/dropdown.js`:
```javascript
// ================================================
// COMPONENTE: DROPDOWN
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown-custom');
  
  dropdowns.forEach(dropdown => {
    // Lógica del dropdown
  });
});
```

2. Inclúyelo en las páginas que lo necesiten:
```html
<script src="../../js/components/dropdown.js"></script>
```

---

## 🎨 Sistema CSS Modular

### Organización del CSS
El CSS está dividido en tres niveles:

1. **Global** (`css/global/`): Variables y estilos base
2. **Components** (`css/components/`): Componentes reutilizables
3. **Pages** (`css/pages/`): Estilos específicos de páginas

### Variables CSS Disponibles
Ver `frontend/css/global/variables.css`:

```css
/* Colores */
--color-primary: #054060;
--color-accent: #d4af37;
--gradient-primary: linear-gradient(135deg, #3b82f6, #06b6d4);

/* Espaciado */
--spacing-sm: 1rem;
--spacing-md: 2rem;
--spacing-lg: 4rem;

/* Transiciones */
--transition-normal: 0.3s ease;
```

### Convención BEM
Usamos metodología BEM para nombrar clases:

```css
/* Bloque */
.card { }

/* Elemento */
.card__header { }
.card__body { }

/* Modificador */
.card--featured { }
.card__header--dark { }
```

---

## 💻 Organización de JavaScript

### Tipos de Archivos JS

1. **Components** (`js/components/`):
   - Componentes reutilizables
   - Ejemplo: `navbar.js` (lógica del menú)

2. **Pages** (`js/pages/`):
   - Lógica específica de páginas
   - Ejemplo: `catalogo.js` (filtros, paginación)

3. **Utils** (`js/utils/`):
   - Funciones auxiliares
   - Ejemplo: `script.js` (localStorage, helpers)

### Convenciones JavaScript

```javascript
// Constantes en UPPER_CASE
const API_URL = '/api/productos';

// Funciones en camelCase
function renderProductos() { }

// Clases en PascalCase
class ProductManager { }

// Event listeners organizados
document.addEventListener('DOMContentLoaded', () => {
  // Tu código aquí
});
```

### localStorage Keys
- `eternia_cart` - Carrito de compras
- `eternia_wishlist` - Lista de deseos
- `eternia_orders` - Historial de pedidos
- `eternia_quotes` - Cotizaciones

---

## 🖼️ Gestión de Assets

### Organización
```
assets/
  ├── logo-eternia-blanco.png       # Logo principal
  ├── logo-web-pay-plus.png         # Logo Webpay
  ├── *.png                          # Imágenes de productos
  └── *.svg                          # Iconos vectoriales
```

### Optimización
- Comprimir imágenes antes de subir
- Usar formatos modernos (WebP cuando sea posible)
- Lazy loading para imágenes grandes

### Rutas
- Desde `frontend/index.html`: `assets/imagen.png`
- Desde `pages/*/index.html`: `../../assets/imagen.png`

---

## 🚀 Inicio Rápido

### Desarrollo Local

#### Opción 1: Live Server (VS Code)
1. Instala la extensión "Live Server"
2. Abre el proyecto en VS Code
3. Clic derecho en `index.html` → "Open with Live Server"
4. El sitio se abrirá en `http://localhost:5500`

#### Opción 2: Python HTTP Server
```bash
# En la raíz del proyecto
python -m http.server 8000

# Abrir: http://localhost:8000
```

#### Opción 3: Node.js http-server
```bash
# Instalar globalmente
npm install -g http-server

# En la raíz del proyecto
http-server -p 8000

# Abrir: http://localhost:8000
```

### Estructura de URLs
- **Home**: `http://localhost:5500/` → redirige a `frontend/index.html`
- **Catálogo**: `http://localhost:5500/frontend/pages/catalogo/`
- **Cuenta**: `http://localhost:5500/frontend/pages/cuenta/`
- **Cotización**: `http://localhost:5500/frontend/pages/contactanos/`

### Checklist Pre-Deploy
- [ ] Todas las rutas son relativas (no absolutas)
- [ ] No hay rutas rotas (verificar con herramientas)
- [ ] Imágenes optimizadas
- [ ] CSS y JS minificados (producción)
- [ ] Meta tags completos (SEO)
- [ ] Pruebas en múltiples navegadores
- [ ] Responsive en móviles y tablets

---

## 🐛 Troubleshooting

### Las imágenes no cargan
- Verifica la ruta relativa según el nivel de la página
- Asegúrate de que los archivos existan en `frontend/assets/`
- Revisa la consola del navegador para errores 404

### Los estilos no se aplican
- Verifica que `main.css` esté correctamente enlazado
- Revisa que todos los `@import` en `main.css` sean correctos
- Limpia la caché del navegador (Ctrl+Shift+R)

### JavaScript no funciona
- Abre la consola del navegador (F12)
- Verifica errores en la consola
- Asegúrate de que las rutas a los archivos JS sean correctas
- Verifica que los scripts se carguen en el orden correcto

### catalogo.json no carga
- Verifica la ruta: `/frontend/data/catalogo.json`
- Asegúrate de que el servidor esté corriendo desde la raíz del proyecto
- Revisa permisos de archivos

---

## 📚 Recursos Adicionales

### Librerías Utilizadas
- **Bootstrap 5.3.8**: Framework CSS responsivo
- **Font Awesome 6.5.0**: Iconos
- **Google Fonts**: Outfit (sans-serif) y Playfair Display (serif)

### Documentación
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3/)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 🤝 Contribución

### Workflow Recomendado
1. Crea una rama para tu funcionalidad: `git checkout -b feature/nueva-pagina`
2. Desarrolla siguiendo las convenciones de este README
3. Prueba en local antes de hacer commit
4. Commit con mensajes descriptivos: `git commit -m "feat: agregar página de servicios"`
5. Push y crea Pull Request

### Convención de Commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `style:` Cambios de estilos
- `refactor:` Refactorización de código
- `docs:` Cambios en documentación

---

## 📞 Contacto y Soporte

Para preguntas sobre la arquitectura del proyecto:
- **Email**: desarrollo@eternia.cl
- **GitHub Issues**: [Reportar problema](https://github.com/eternia/proyecto/issues)

---

**Última actualización**: Enero 2026
**Versión**: 2.0.0 (Arquitectura Modular)
