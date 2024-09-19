# backend
Repositorio utilizado para desarrollar el backend del juego El Switcher

# Descripción de organización:

`src/`: Carpeta principal para el código fuente.

`src/entidad/`: Carpeta dedicada a la entidad.

`src/core/`: Contiene configuraciones y lógica que no están específicas a una entidad en particular.

**`main.py`**: El punto de entrada de la aplicación FastAPI, donde se inicializa la app y se registran las rutas.

**`requirements.txt`**: Archivo para dependencias del proyecto.

**`README.md`**: Documentación del proyecto.

## Dentro de cada entidad

**`entidad_models.py`**: Define el modelo ORM para la entidad.

**`entidad_crud.py`**: Contiene las operaciones CRUD relacionadas con la entidad.

**`entidad_schemas.py`**: Define los esquemas de Pydantic para validar y serializar datos de la entidad.

**`entidad_endpoints.py`**: Define las rutas de la API relacionadas con la entidad.

`tests/`: Contiene pruebas específicas para la entiadad, organizadas en archivos separados para modelos, operaciones CRUD, esquemas y endpoints.

## Dentro de core

**`config.py`**: Configuraciones generales del proyecto.

**`security.py`**: Lógica de autenticación y autorización.

**`db.py`**: Configuración de la base de datos y la inicialización.

