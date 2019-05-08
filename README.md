# TC3041 Proyecto  Final Primavera 2019

#*Colibrí*
---

##### Integrantes:
1. Antony Adrian Morales Rosas
2. Alberto Pascal Garza


---
## 1. Aspectos generales

### 1.1 Requerimientos técnicos

A continuación se mencionan los requerimientos técnicos mínimos del proyecto, favor de tenerlos presente para que cumpla con todos.

* El equipo tiene la libertad de elegir las tecnologías de desarrollo a utilizar en el proyecto, sin embargo, debe tener presente que la solución final se deberá ejecutar en una plataforma en la nube. Puede ser  [Google Cloud Platform](https://cloud.google.com/?hl=es), [Azure](https://azure.microsoft.com/en-us/) o AWS [AWS](https://aws.amazon.com/es/free/).
* El proyecto debe utilizar al menos dos modelos de bases de datos diferentes, de los estudiados en el curso.
* La solución debe utilizar una arquitectura de microservicios. Si no tiene conocimiento sobre este tema, le recomiendo la lectura [*Microservices*](https://martinfowler.com/articles/microservices.html) de [Martin Fowler](https://martinfowler.com).
* La arquitectura debe ser modular, escalable, con redundancia y alta disponibilidad.
* La arquitectura deberá estar separada claramente por capas (*frontend*, *backend*, *API RESTful*, datos y almacenamiento).
* Los diferentes componentes del proyecto (*frontend*, *backend*, *API RESTful*, bases de datos, entre otros) deberán ejecutarse sobre contenedores [Docker](https://www.docker.com/) y utilizar [Kubernetes](https://kubernetes.io/) como orquestador.
* Todo el código, *datasets* y la documentación del proyecto debe alojarse en un repositorio de GitHub siguiendo al estructura que aparece a continuación.

### 1.2 Estructura del repositorio
El proyecto debe seguir la siguiente estructura de carpetas:
```
- / 			        # Raíz de todo el proyecto
    - README.md			# Archivo con los datos del proyecto (este archivo)
    - frontend			# Carpeta con la solución del frontend (Web app)
    - backend			# Carpeta con la solución del backend (CMS)
    - api			# Carpeta con la solución de la API
    - datasets		        # Carpeta con los datasets y recursos utilizados (csv, json, audio, videos, entre otros)
    - dbs			# Carpeta con los modelos, catálogos y scripts necesarios para generar las bases de datos
    - models			# Carpeta donde se almacenarán los modelos de Machine Learning ya entrenados 
    - docs			# Carpeta con la documentación del proyecto
        - stage_f               # Documentos de la entrega final
        - manuals               # Manuales y guías
```

### 1.3 Documentación  del proyecto

Como parte de la entrega final del proyecto, se debe incluir la siguiente información:

* Justificación de los modelo de *bases de datos* que seleccionaron.
* Descripción del o los *datasets* y las fuentes de información utilizadas.
* Guía de configuración, instalación y despliegue de la solución en la plataforma en la nube  seleccionada.
* Documentación de la API. Puede ver un ejemplo en [Swagger](https://swagger.io/). 
* El código debe estar documentado siguiendo los estándares definidos para el lenguaje de programación seleccionado.

## 2. Descripción del proyecto

Red social que ofrece un servicio de microblogging. Este permite a los usuarios realizar y recibir mensajes breves a tráves de la plataforma.

## 3. Solución

A continuación aparecen descritos los diferentes elementos que forman parte de la solución del proyecto.

### 3.1 Modelos de *bases de datos* utilizados

Se utilizaron las siguientes bases de datos:

- Neo4j: Al querer copiar una red social, haremos uso de neo4j dado que es una base de datos orientada a grafos. De esta manera podemos simular las relaciones entre las personas y los posts y facilitar el manejo de dichas conexiones. Además, es posible que las conexiones estén en constante movimiento, por lo que neo4j nos brindará una gran versatilidad en el manejo de la información. Además, es fácil de escalar y no disminuye su rendimiento a pesar de las cantidades enormes de nodos que puede almacenar,lo cual es extremadamente necesario para una red social.

- Redis: Redis nos permite usar la memoria en caché. A la hora que nuestra aplicación comenzará a obtener las peticiones de los datos, se creará una llave única de redis. De esta manera, la próxima vez que se requiera hacer uso de la información, redis ya contendrá una referencia a los datos de neo4j, permitiendo que nuestra aplicación sea mucho más rápida.

Más información disponible en: [README_dbs](dbs/README.md)

#### Neo4j:

- Para poder levantar nuestra base de datos tuvimos que tomar en cuenta que, al ser una red social, eventualmente se podrían estar manejando una cantidad masiva de datos. Por esto mismo, se pensó en agilizar aún más el proceso mediante la creación de un cluster con tres nodos:
	- core-0 : nodo líder
	- core-1 : nodo seguidor
	- core-2 : nodo seguidor. 

Además, dentro de neo4j se crearon los siguientes modelos:

- User:

	- n:User{
	    id: Integer, (Unique)
	    username: String,
	    mail: String, (Unique)
	    password: String,
	    name: String,
	    location: String,
	    description: String,
	    verified: bool,
	    created_at: Date,
	    birthday: Date
	    lang: String,
	    profile_banner_url: String
	    profile_image_url: String,
	}

- Post:

	- n:Post{
	    id: Integer, (Unique)
	    text: String
	    created_at: String,
	}

Para la interación del usuario dentro de la red social, también se crearon las siguientes relaciones:

- (User)-[CREATED]->(Post)

	- a:User1 -
	r:CREATED{
	    username1: String,
	    postid: Integer, 
	    created_at: String,
	}
-> b:Post

- (User)-[LIKES]->(Post)

a:User1 -
	- r:LIKES{
	    username1: String,
	    postid: Integer, 
	    created_at: String,
	}
-> b:Post

- (User)-[FOLLOWS]->(User)

	- a:User1 -
	r:FOLLOWS{
	    username1: String,
	    username2: String, 
	    created_at: String,
	}
	-> b:User2


#### Redis:

Para redis únicamente se necesita el uso de un objeto llave valor, como por ejemplo:

- "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3JyZW8iOiJiZXRvX3Bhc2NhbEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkFsYmVydG9QYXNjYWwiLCJpYXQiOjE1NTcyNjM1MTksImV4cCI6MTU1NzM0OTkxOX0.4z4ed7p8MlagT6YX8EYy4Gb4bc5s7wPvFyGGGNc52WA"


### 3.2 Arquitectura de la solución

- ![](Readme_images/architecture.png)

### 3.3 Frontend

*[Incluya aquí una explicación de la solución utilizada para el frontend del proyecto. No olvide incluir las ligas o referencias donde se puede encontrar información de los lenguajes de programación, frameworks y librerías utilizadas.]*

Más información disponible en: [README_frontend](frontend/README.md)

#### 3.3.1 Lenguaje de programación

Para desarrollar tanto el front-end como los api se utilizó en conjunto:

- HTML
- JavaScript
- CSS
- TypeScript

#### 3.3.2 Framework
- Angular
#### 3.3.3 Librerías de funciones o dependencias
- [Reactjs](https://reactjs.org/): Una biblioteca de JavaScript para construir interfaces de usuario
- [Create React App](https://facebook.github.io/create-react-app/) : Herramienta para crear aplicaciones react. Ofrece una configuración de construcción moderna sin configuración.
- [Neo4j-driver](https://neo4j.com/developer/javascript/) : Herramienta para poder comunicar nuestro código de javascript con una base de datos hosteada en neo4j. 
- [kompose] (http://kompose.io/) : Herramienta para traducir los archivos de configuración de docker a archivos en kubernets. 
- [redis] (https://redis.js.org/) : Herramienta para conectar nuestras aplicaciones de javascript con nuestra base de datos en redis.
- [minikube]( https://kubernetes.io/es/docs/tasks/tools/install-minikube/) : herramienta para utilizar kubernetes y orquestrar nuestro proyecto. 

### 3.4 Backend

Como backend se utilizó node.js en conjunto con dos api: user y posts. De esta manera, Es posible comunicar nuestra aplicación con las base de datos de neo4j y de redis para así, eventualmente, mostrar los resultados al usuario en el frontend. 

#### 3.3.1 Lenguaje de programación

Para desarrollar tanto el front-end como los api se utilizó en conjunto:

- HTML
- JavaScript
- CSS
- TypeScript

#### 3.3.2 Framework
- Angular

#### 3.4.3 Librerías de funciones o dependencias

### 3.5 API

Para poder crear una réplica de una red social, localizamos dos api que nos serían necesarios crear:

- User: Este api se encargará de crear los endpoints para todas las funciones que el usuario pueda realizar dentro de la red social. Es decir, se encargará

Más información disponible en: [README_api_user](api/users/README.md)

- Post

Más información disponible en: [README_api_post](api/posts/README.md)
Más información disponible en: [README_api_postV2](api/postsV2/README.md)

#### 3.5.1 Lenguaje de programación

- [Node.js](https://nodejs.org/es/docs/): Node.js es un entorno de ejecución para JavaScript construido con el motor de JavaScript V8 de Chrome.
- [Python Flask](http://flask.pocoo.org/): Flask es un framework minimalista escrito en Python que permite crear aplicaciones web rápidamente. Está basado en la especificación WSGI de Werkzeug y el motor de templates Jinja2.

#### 3.5.2 Framework
- [Express](https://expressjs.com/es/guide/routing.html): Framework de aplicaciónes web para Node.js
#### 3.5.3 Librerías de funciones o dependencias



## 3.6 Pasos a seguir para utilizar el proyecto

*[Incluya aquí una guía paso a paso para poder utilizar el proyecto, desde la clonación del repositorio hasta el despliegue de la solución en una plataforma en la nube.]*

## 4. Referencias

- [Neo4j Considerations in Orchestration Environments](https://medium.com/neo4j/neo4j-considerations-in-orchestration-environments-584db747dca5)
- [How we use Neo4J on our social network and workaround performance issues](https://blog.deimos.fr/2016/01/15/how-we-use-neo4j-on-our-social-network-and-workaround-performance-issues/)
- [kubernets implementation](https://matthewpalmer.net/kubernetes-app-developer/articles/install-kubernetes-ubuntu-tutorial.html)
- [Kubernetes information](https://stackify.com/kubernetes-docker-deployments/)
- [Neo4j Cluster implementation](https://graphaware.com/neo4j/2018/01/03/casual-cluster-quickstart.html)
- [Docker compose into kubernetes](http://kompose.io/getting-started/)
- [Digital Ocean implementation](https://www.youtube.com/watch?v=DwlIn9zOcfc)
- [Digital Ocean and kubernetes](https://www.digitalocean.com/docs/kubernetes/)
- [Redis](https://medium.com/tech-tajawal/introduction-to-caching-redis-node-js-e477eb969eab)
