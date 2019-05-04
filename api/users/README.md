# API (Users)

Creado: @antony999k

[![version](https://img.shields.io/badge/version-1.0.0-ff69b4.svg)]()
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/wasabeef/awesome-android-ui)

Gestiona el registro de usuarios, perfiles de usuarios

# Microservicio en Docker

Se debe crear el Dockerfile con su respectivo .dockerignore que incluya node_modules

- Hacer build de la imagen:  `docker build -t pf_api_user:<version_api> .`
- Correr docker: `docker run -p 8000:8000 pf_api_user:<version_api>`

# Endpoints

Ruta Desarrollo: http://127.0.0.1:8000/

## Registar Usuario (POST) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /user
    
### Header
    'N/A'
    
### Body
    {
        "mail":"antony999k@gmail.com",
        "username": "antony999k",
        "password":"querty",
        "name": "Antony Adrian Morales", **Opcional**
        "description": "el hijo del papá" **Opcional**
    }

#### Respuesta esperada
    {
    "status": 201,
    "name": "Created",
    "customMessage": "El usuario fue creado con exito",
    "message": "Recurso creado",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFudG9ueTk5OWsiLCJpYXQiOjE1NTY5MTg4NDYsImV4cCI6MTU1NzAwNTI0Nn0.6m0updWXTGkI441XXI4CkSsyGiYIBmjdDjyXVqrgHaA"
    }

## Login Usuario (POST) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /user/login
    
### Header
    'N/A'
    
### Body
    {
	"username":"antony999k",
	"password":"querty"
    }
    
#### Respuesta esperada
    {
        "status": 200,
        "name": "Ok",
        "customMessage": "Autenticación correcta",
        "message": "Ok",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3JyZW8iOiJhbnRvbnk5OTlrQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiYW50b255OTk5ayIsImlhdCI6MTU1NjkxODkwOCwiZXhwIjoxNTU3MDA1MzA4fQ.FO4gVBM9-H_b_ASIVFOfA67IJU7p8pmIN0jNJ4AVqxg"
    }

## Obtener un usuario (GET) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /user/:id
    
### Header
    N/A
    
### Body
    'N/A'
    
#### Respuesta esperada
    {
        "keys": [
            "n"
        ],
        "length": 1,
        "_fields": [
            {
                "identity": {
                    "low": 0,
                    "high": 0
                },
                "labels": [
                    "User"
                ],
                "properties": {
                    "name": "Antony Adrian Morales",
                    "description": "el hijo del papá",
                    "created_at": "2019-05-02T18:55:05.805Z",
                    "password": "$2b$13$5enGKok6D2Wfogpj0/gzZuPMBuBrLBO0RBbmkU9TPAa34b0aX5qlS",
                    "mail": "antony999k@gmail.com",
                    "username": "antony999k"
                }
            }
        ],
        "_fieldLookup": {
            "n": 0
        }
    }
    
## Obtener propio usuario (GET) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /user/me
    
### Header
    Authorization: $token
    
### Body
    'N/A'
    
#### Respuesta esperada
    {
        "keys": [
            "n"
        ],
        "length": 1,
        "_fields": [
            {
                "identity": {
                    "low": 0,
                    "high": 0
                },
                "labels": [
                    "User"
                ],
                "properties": {
                    "name": "Antony Adrian Morales",
                    "description": "el hijo del papá",
                    "created_at": "2019-05-02T18:55:05.805Z",
                    "password": "$2b$13$5enGKok6D2Wfogpj0/gzZuPMBuBrLBO0RBbmkU9TPAa34b0aX5qlS",
                    "mail": "antony999k@gmail.com",
                    "username": "antony999k"
                }
            }
        ],
        "_fieldLookup": {
            "n": 0
        }
    }

## Follow a un usuario (POST) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /user/follow
    
### Header
    'N/A'
    
### Body
    {
        "username": "$username",
        "usernameTarget": "usernameASeguir"
    }
    
#### Respuesta esperada
    {
        "status": 201,
        "name": "Created",
        "customMessage": "Se siguio al usuario con éxito",
        "message": "Recurso creado"
    }

## Unfollow a un usuario (DELETE) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /user/follow
    
### Header
    'N/A'
    
### Body
    {
        "username": "$username",
        "usernameTarget": "usernameASeguir"
    }
    
#### Respuesta esperada
    {
        "status": 200,
        "name": "Created",
        "customMessage": "Se dejo de seguir al usuario con éxito",
        "message": "Recurso eliminado"
    }


## Revisar estado del api (GET) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
/health

#### Respuesta esperada
    {
    "status": 200,
    "name": "OK",
    "message": "i'm healthy",
    "customMessage": "API Analizapp en funcionamiento"
    }


# Errores

## Manejo de Errores
Para manejar errores personalizados hay que crear el error y lanzar un next.

Todos los errores deben pasar por helper/error.helper.js.

### Ejemplo
let e = new Error('{mensaje customizado de tu error}');
e.name = "{ErrorType}";
return next(e);

### ErrorType
Código de error  | ErrorType (e.name)
------------- | -------------
301  | movedPermanently
303  | seeOther
304  | notModified
307  | temporaryRedirect
308  | permanentRedirect
400  | badRequest
401  | unautorized
403  | forbidden
404  | notFound
405  | methodNotAllowed
409  | conflict
415  | unsupportedMediaType
418  | imATeapot
500  | internal
501  | notImplemented
502  | badGateway
503  | serviceUnavailable
504  | gatewayTimeout
507  | insufficientStorage

## Respuesta de errores
Los errores son retornados en JSON. Cada error tiene un **status**, **name**, **message** y **customMessage**.
El campo **message** es personalizado y debe estar en ingles

### Ejemplo de un status 400
    {
        "status": 400,
        "name": 'badRequest',
        "message": 'Bad Request' + (err.message ? ': ' + err.message : ''),
        "customMessage": 'Solicitud Erronea'
    }

# Contribuir con el API

## Paquetes/Librerias recomendadas (Globales/Locales)
- Nodejs: `v8.11.3`
- Nodemon `v1.18.7` (Opcional para testing)

## Iniciar aplicación (Desarrollo)
- `npm install` Instalar paquetes de npm
- `npm start` Para iniciar con node
- `npm test` Para iniciar con nodemon
- `npm run dev` Para iniciar en modo desarrollo (muesta los logs)

## Pasos para correcto funcionamiento
1. Instalar paquetes/librerias Locales
2. Descargar el repositorio
3. Instalar paquetes de npm
4. Es necesario contar con el archivo *.env*, este no se puede descargar via Github ya que contiene claves privadas (pedir al administrador del repositorio)
5. Correr el servidor

## Guía de estilos
### Mensajes en los Commits de Git

- Utilizar oraciones en presente ("Botón añadido" no "Se añadio botón")
- Comenzar el commit con mayúsculas
- Cuando solo se cambia documentacion añadir `[ci skip]` en el título del commit
- Considerar comenzar el commit con un emoji
- :rocket: `:rocket:` cuando se lanza una nueva versión
- :sparkles: `:sparkles:` cuando se añade nuevo código
- :art: `:art:` mejora en el formato/estructura del código
- :racehorse: `:racehorse:` mejora en el performance del código
- :book: `:book:` cuando se escribe documentación
- :bug: `:bug:` cuando se corrige un bug
- :fire: `:fire:` cuando se eliminó código o archivos

## Notas

# Changelog

# Ayuda
@antony999k, antony999k@hotmail.com
