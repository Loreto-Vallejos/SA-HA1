# Ecommerce Backend

## Descripción

Este proyecto implementa el backend para la aplicación "Eternia", un ecommerce. Proporciona una API REST completa para la gestión de productos, clientes y otras entidades relacionadas, conectándose a una base de datos PostgreSQL alojada en la nube (Neon). Incluye autenticación JWT, validaciones, manejo de errores centralizado y una arquitectura escalable siguiendo buenas prácticas de Spring Boot.

## Lo que se Pedía

- **Servicios**: Crear servicios que se conectan a los repositorios. Los servicios manejan la lógica de las operaciones de la base de datos y no proporcionan ningún error.
- **Controladores**: Crear controladores que definen los endpoints y métodos para recibir y responder peticiones HTTP.
- **Conexión**: Los controladores se conectan a los servicios para realizar operaciones como consulta, creación, modificación y borrado de datos.
- **Ejecución**: La aplicación Spring Boot compila y se ejecuta correctamente.

## Lo Logrado

✅ **API REST completa con CRUD de productos**: Implementación de endpoints para crear, leer, actualizar y eliminar productos.

✅ **Validaciones automáticas en la entrada**: Uso de anotaciones de validación para asegurar la integridad de los datos.

✅ **Respuestas consistentes con ApiResponse**: Estandarización de las respuestas HTTP utilizando una clase ApiResponse.

✅ **Manejo centralizado de errores**: Implementación de un controlador global de excepciones para manejar errores de manera uniforme.

✅ **Base de datos PostgreSQL en la nube (Neon)**: Configuración de conexión a una base de datos PostgreSQL alojada en Neon.

✅ **Arquitectura profesional y escalable**: Separación de capas (controladores, servicios, repositorios) siguiendo buenas prácticas de diseño.

✅ **Código limpio y mantenible**: Uso de principios SOLID, inyección de dependencias y documentación adecuada.

## Tecnologías Utilizadas

- **Spring Boot 3.2.0**: Framework principal para el desarrollo de la aplicación.
- **Java 21**: Versión del lenguaje utilizada.
- **Spring Data JPA**: Para el acceso a datos y mapeo objeto-relacional.
- **Spring Security**: Para autenticación y autorización con JWT.
- **Spring Validation**: Para validaciones automáticas.
- **PostgreSQL**: Base de datos relacional alojada en Neon.
- **Lombok**: Para reducir código boilerplate.
- **Maven**: Gestión de dependencias y construcción del proyecto.
- **H2 Database**: Base de datos en memoria para pruebas.

## Configuración

La aplicación se ejecuta en el puerto `8080` por defecto. La configuración de la base de datos y JWT se encuentra en `src/main/resources/application.yaml`:

- **Base de datos**: PostgreSQL en Neon (URL, usuario y contraseña configurados).
- **JPA**: `ddl-auto: update` para actualizar el esquema automáticamente, con logging de SQL habilitado.
- **JWT**: Clave secreta y tiempo de expiración configurados.
- **Logging**: Nivel DEBUG para el paquete `com.ecommerce_backend`.

## Estructura del Proyecto

- `src/main/java/com/ecommerce_backend/`:
  - `config/`: Configuraciones de la aplicación (seguridad, CORS, etc.).
  - `controller/`: Controladores REST que definen los endpoints.
  - `dto/`: Objetos de transferencia de datos (DTOs).
  - `exception/`: Manejo de excepciones personalizadas.
  - `mapper/`: Mapeadores para convertir entre entidades y DTOs.
  - `model/`: Entidades JPA.
  - `repository/`: Interfaces de repositorio para acceso a datos.
  - `security/`: Configuración de seguridad y JWT.
  - `service/`: Lógica de negocio.
  - `EcommerceBackendApplication.java`: Clase principal de Spring Boot.
- `src/main/resources/`:
  - `application.yaml`: Archivo de configuración.
- `src/test/java/`: Pruebas unitarias e integración.

## Cómo Ejecutar

1. Asegúrate de tener Java 21 y Maven instalados.
2. Clona el repositorio y navega a la carpeta `ecommerce-backend`.
3. Ejecuta `mvn clean install` para compilar y empaquetar.
4. Ejecuta `mvn spring-boot:run` para iniciar la aplicación.

La aplicación estará disponible en `http://localhost:8080`.

## Pruebas

Las pruebas se incluyen en la carpeta `src/test/java`. Utilizan H2 como base de datos en memoria.

Ejecuta `mvn test` para correr las pruebas.

## Endpoints Principales

- **Productos**: `/api/products` (GET, POST, PUT, DELETE)
- **Clientes**: `/api/customers` (GET, POST, PUT, DELETE)
- **Autenticación**: `/api/auth/login` (POST)

Consulta la documentación de la API o los controladores para detalles completos.