# NEO4J Cluster

Cluster Neo4j docker con docker-compose.yml 

# Cluster en Docker

Instalar dependencias:
`sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-'uname -s'-'uname -m' -o /usr/local/bin/docker-compose`<br>
`sudo chmod +x /usr/local/bin/docker-compose`

Ejecutar en carpeta con docker-compose.yml: 
`sudo docker-compose up`

# Cluster en kubernetes

## Instalar y actualizar dependencias

`sudo apt-get update`<br>
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

`chmod +x minikube && sudo mv minikube /usr/local/bin/`<br>
Ejecutar Minikube: `minikube start`

### Kompose

#### Linux

`curl -L https://github.com/kubernetes/kompose/releases/download/v1.17.0/kompose-linux-amd64 -o kompose`

#### OSX

`curl -L https://github.com/kubernetes/kompose/releases/download/v1.17.0/kompose-darwin-amd64 -o kompose`<br>
`chmod +x kompose`<br>
`sudo mv ./kompose /usr/local/bin/kompose`

## Crear Pods
(Ejecutar en la carpeta que contenga docker-compose.yml)

- Convertir yml a yaml: `kompose convert`<br>
- Iniciar servicios y Pods: `kompose up`

# Databases


## Neo4j


## Redis

# Changelog
No hay cambios de ruptura

# Ayuda
@AlbertoPascal, beto_pascal@hotmail.com
@antony999k, antony999k@hotmail.com
