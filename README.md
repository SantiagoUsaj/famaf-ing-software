

# Backend
Repositorio utilizado para desarrollar el backend del laboratorio

## Requisitos previos

Antes de comenzar, asegúrate de estar en un entorno virtual.
Puedes utilizar el siguiente.
- [venv](https://docs.python.org/es/3/library/venv.html)

Activa tu entorno virtual:
```bash
$ source .venv/bin/activate
```
una vez activado el entorno virtual puedes verificar que estan en uno con el siguiente comando
```bash
$ which python
/home/user/code/awesome-project/.venv/bin/python
```
para salir del entorno virtual utiliza 
```bash
$ deactivate
```
## Activar el Entorno Virtual

Para activar el entorno virtual, utiliza el siguiente comando:

```bash
$ pip install fastapi
```

```bash
$ pip install uvicorn
```

y para ejecutar nuestro servidor iremos al path de nuestro archivo a corre y ejecutaremos el comando
```bash
$ uvicorn main:app --reload
```

en nuestro caso en ves del archivo *main.py* sera *endponint_player.py* y con esto tendremos nuestro servidor corriendo!!

Ahora para ver la documentacion del mismo con ir a la pagina
*http://127.0.0.1:8000/docs* podremos ver todos los endpoints de nuestra api.

