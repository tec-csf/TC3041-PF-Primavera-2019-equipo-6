# NEO4J Cluster

- Se creó un cluster de NEO4J que se puede ejecutar fácilmente dentro de docker por medio del archivo docker-compose.yml. 

## Ejecutar el cluster dentro de docker:

- Para poder ejecutar el cluster dentro de un contenedor de docker es necesario primero instalar las dependencias:
	- sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
	- sudo chmod +x /usr/local/bin/docker-compose

- Después, únicamente es necesario colocarse dentro de la carpeta que contiene al archivo de docker-compose.yml y ejecutar el comando sudo docker-compose up

## Ejecutar el cluster dentro de Kubernetes:

- Una vez teniendo el archivo de docker-compose.yml, ejecutar en kubernetes es sencillo. 

- Primero es necesario instalar las dependencias:

### Actualizar las dependendcias:

- sudo apt-get update
- sudo apt-get install -y apt-transport-https

### Instalar VirtualBox

- sudo apt-get install -y virtualbox virtualbox-ext-pack

### instalar kubectl

- curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
- sudo touch /etc/apt/sources.list.d/kubernetes.list 
- echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
- sudo apt-get update
- sudo apt-get install -y kubectl

### Instalar minikube

- curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.28.2/minikube-linux-amd64
- chmod +x minikube && sudo mv minikube /usr/local/bin/

### Iniciar servicio de minikube:

- minikube start

### Instalar la extensión de Kompose:

- curl -L https://github.com/kubernetes/kompose/releases/download/v1.16.0/kompose-linux-amd64 -o kompose
- chmod +x kompose
- sudo mv ./kompose /usr/local/bin/kompose

### Convertir docker-compose.yml a pods en kubernetes:

- Una vez que todas las dependencias han sido instaladas, únicamente resta navegar a la carpeta donde se encuentra el docker-compose y ejecutar:
- kompose convert (para convertir un archivo de docker-compose.yml a los equivalentes en kubernetes)
- kompose up (para iniciar los servicios dentro de kubernetes y generar los pods)

# Databases


## Neo4j


### Creación de ejemplo de datos para las relaciones:
- FOLLOWS:
	
	Match(a:Alumno) where id(a)=20 and a.Nombre = "Pedro"
	Match(b:Alumno) where id(b) =0 and b.Nombre = "Alberto"
	Create (a)-[r:FOLLOWS{fecha: "10/10/2018"}]->(b)
	return r

	match(a:Alumno)-[r:FOLLOWS]->(b:Alumno) return a.Nombre + " Follows " + b.Nombre + " since " + r.fecha as RelationType

- CREATED:

	Match(a:Person) where id(a) =27 and a.username = "BetoPascal"
	Match(b:Post) where id(b) = 2 and b.text= "Este es un post de prueba ligado a usuario" and b.id=3
	Create (a)-[r:CREATED{fecha: "05/05/2019"}]->(b)
	return r

	match(a:Person)-[r:CREATED]->(b:Post) return a,r,b

## Redis

# Changelog
No hay cambios de ruptura

# Ayuda
@AlbertoPascal, beto_pascal@hotmail.com
@antony999k, antony999k@hotmail.com
