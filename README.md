

# Backend
Repositorio utilizado para desarrollar el backend del laboratorio

## Requisitos previos

Antes de comenzar, asegúrate de estar en un entorno virtual.
Puedes utilizar el siguiente.
- [venv](https://docs.python.org/es/3/library/venv.html)

Crear entorno virtual:
```bash
python3 -m venv .venv
```
Activa tu entorno virtual:
```bash
source .venv/bin/activate
```
una vez activado el entorno virtual puedes verificar que estan en uno con el siguiente comando
```bash
which python
/home/user/code/awesome-project/.venv/bin/python
```
para salir del entorno virtual utiliza 
```bash
deactivate
```
## Activar el Entorno Virtual

Para activar el entorno virtual, utiliza el siguiente comando:

```bash
pip install fastapi==0.108.0
```

```bash
pip install uvicorn
pip install 'uvicorn[standard]'
```

```bash
pip install SQLalchemy
```

Asegúrate de que el directorio src esté en el PYTHONPATH para que los módulos puedan ser encontrados correctamente. Puedes hacerlo temporalmente en tu terminal antes de ejecutar pytest:

```bash
export PYTHONPATH=$PYTHONPATH:/home/santiafonso/Documents/sql/backend/src
```


y para ejecutar nuestro servidor iremos al path de nuestro archivo a corre y ejecutaremos el comando
```bash
uvicorn app:app --reload
```

en nuestro caso en ves del archivo *main.py* sera *endponint_player.py* y con esto tendremos nuestro servidor corriendo!!

Ahora para ver la documentacion del mismo con ir a la pagina
*http://127.0.0.1:8000/docs* podremos ver todos los endpoints de nuestra api.

## Runear los test

Hay que estar en la dirección `/backend/src` y ahí se ejecuta el comando:

```bash
python3 -m pytest tests_endpoints.py -v
```

## Organizacion de archivos

**`src/`**: Carpeta principal para el código fuente.

**`endpoints.py`**: Contiene todos los endpoints de la API.

**`manager_models.py`**: Contiene el manejo de Webscket.

**`"entidad"_models.py`**: Contiene la clase entidad y sus metodos.

