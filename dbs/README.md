# NEO4J Cluster

Cluster Neo4j docker con docker-compose.yml 

# Cluster en Docker

Instalar dependencias:
`sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-'uname -s'-'uname -m' -o /usr/local/bin/docker-compose`
`sudo chmod +x /usr/local/bin/docker-compose`

Ejecutar en carpeta con docker-compose.yml: 
`sudo docker-compose up`

# Cluster en kubernetes

## Instalar y actualizar dependencias

`sudo apt-get update`
`sudo apt-get install -y apt-transport-https`

### VirtualBox:

`sudo apt-get install -y virtualbox virtualbox-ext-pack`

### Kubectl:
1. `curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -`
2. `sudo touch /etc/apt/sources.list.d/kubernetes.list `
3. `echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list`
4. `curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.28.2/minikube-linux-amd64`
5. `sudo apt-get install -y kubectl`

### Minikube

`chmod +x minikube && sudo mv minikube /usr/local/bin/`
Ejecutar Minikube: `minikube start`

### Kompose

#### Linux

`curl -L https://github.com/kubernetes/kompose/releases/download/v1.17.0/kompose-linux-amd64 -o kompose`

#### OSX

`curl -L https://github.com/kubernetes/kompose/releases/download/v1.17.0/kompose-darwin-amd64 -o kompose`
`chmod +x kompose`
`sudo mv ./kompose /usr/local/bin/kompose`

## Crear Pods
(Ejecutar en la carpeta que contenga docker-compose.yml)

- Convertir yml a yaml: `kompose convert`
- Iniciar servicios y Pods: `kompose up`

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
