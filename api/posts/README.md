# API (Posts)

Creado: @AlbertoPascal

[![version](https://img.shields.io/badge/version-1.0.0-ff69b4.svg)]()
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/wasabeef/awesome-android-ui)

Gestiona el CRUD de los posts

# Endpoints

Ruta Desarrollo: http://127.0.0.1:8000/
Posibles Rutas: /posts/
		/posts/<string:username>
		/post/<int:id>
# Ejemplo de uso:

## Inserciones:
- Para poder probar los endpoints se pueden utilizar las siguientes inserciones para neo4j:

### Person:

- Create(p:Person {username:"BetoPascal", mai:"beto_pascal@hotmail.com", password:"1234", name:"Alberto Pascal", location: "CDMX", description:"cuenta prueba de Alberto Pascal", verified:true, created_at:"05/05/2019", birthday: "09/08/1997", lang:"ES", profile_banner_url:"www.alñkdfasdf.com", profile_image_url:"www.akljasdflkk.com"})

### Post:

- Create(p:Post{id:1, text: "Este es un post de prueba 1", created_at: "05/05/2019"})
- Create(p:Post{id:3, text: "Este es un post de prueba 2", created_at: "05/05/2019"})
- Create(p:Post{id:3, text: "Este es un post de prueba ligado a usuario", created_at: "05/05/2019"})
	
### Relación de Person CREATED Post:

- Match(a:Person) where id(a) =27 and a.username = "BetoPascal"
- Match(b:Post) where id(b) = 2 and b.text= "Este es un post de prueba ligado a usuario" and b.id=3
- Create (a)-[r:CREATED{fecha: "05/05/2019"}]->(b)
- return r

- NOTA: ES NECESARIO AJUSTAR EL QUERY para que id(a) y id(b) coincidan con el id que le asignó tu base a los objetos. Esto es únicamente para las pruebas.

- Se puede verificar la creación de la relación con el siguiente query:
	- match(a:Person)-[r:CREATED]->(b:Post) return a,r,b
# Errores


# Contribuir con el API

## Paquetes/Librerias recomendadas (Globales/Locales)
- Flask: `v1.0.2`
- Neo4j python libraries

## Iniciar aplicación (Desarrollo)
- Ubicarse en la carpeta /api/post
- Asegurarse de que esté corriendo un contenedor con neo4j
- Ejecutar python GetPosts.py
- ir a localhost:5000 y agregar el endpoint que se desea

## Pasos para correcto funcionamiento
1. Instalar paquetes/librerias Locales
2. Descargar el repositorio
3. Instalar dependencias de python:
	-  sudo pip install neo4jrestclient
	-  sudo pip install Flask
5. Correr el servidor

## Notas

# Changelog

# Ayuda
@AlbertoPascal, beto_pascal@hotmail.com
