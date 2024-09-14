# backend
Repositorio utilizado para desarrollar el backend del laboratorio

# Descripción de cada carpeta:

app/: Carpeta principal que contiene la aplicación. Dentro de esta carpeta, se organiza el código en módulos lógicos.

api/: Aquí se organizan los endpoints de la API, potencialmente versionados (v1, v2, etc.). Dentro de cada versión, los endpoints están agrupados por dominio o funcionalidad.

core/: Aquí se colocan configuraciones globales y la lógica central, como la configuración de la seguridad, gestión de tokens JWT, y las configuraciones de entorno.

models/: Contiene los modelos ORM (como los modelos de SQLAlchemy) que representan las tablas de la base de datos.

crud/: Contiene las operaciones básicas de CRUD (Create, Read, Update, Delete) para interactuar con los modelos de la base de datos.

schemas/: Define los esquemas de entrada/salida de datos utilizando Pydantic, que ayuda a validar y serializar los datos que se envían o reciben en la API.

db/: Configuración de la conexión a la base de datos, así como la inicialización de los modelos.

tests/: Aquí se colocan las pruebas del proyecto. Es recomendable escribir pruebas unitarias e integrales para cada módulo importante.

main.py: Punto de entrada de la aplicación FastAPI. Aquí se inicializa la aplicación, se registran las rutas, middlewares, etc.

requirements.txt: Lista de dependencias necesarias para el proyecto, puedes usar Pipfile si prefieres pipenv.