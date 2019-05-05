# API (Posts)

Creado: @AlbertoPascal

[![version](https://img.shields.io/badge/version-1.0.0-ff69b4.svg)]()
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/wasabeef/awesome-android-ui)

Gestiona el CRUD de los posts

# Endpoints

Ruta Desarrollo: http://127.0.0.1:8000/
Posibles Rutas: /posts
		/posts/<string:username>
		/posts/<int:id>

#Creación de ejemplo de datos para las relaciones:
 -RELATIONSHIP POSIBILITY:
	Match(a:Alumno) where id(a)=20 and a.Nombre = "Pedro"
	Match(b:Alumno) where id(b) =0 and b.Nombre = "Alberto"
	Create (a)-[r:FOLLOWS{fecha: "10/10/2018"}]->(b)
	return r

	match(a:Alumno)-[r:FOLLOWS]->(b:Alumno) return a.Nombre + " Follows " + b.Nombre + " since " + r.fecha as RelationType

-CREATED:
	Match(a:Person) where id(a) =27 and a.username = "BetoPascal"
	Match(b:Post) where id(b) = 2 and b.text= "Este es un post de prueba ligado a usuario" and b.id=3
	Create (a)-[r:CREATED{fecha: "05/05/2019"}]->(b)
	return r

	match(a:Person)-[r:CREATED]->(b:Post) return a,r,b
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
