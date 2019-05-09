# Databases

## NEO4J Cluster
Cluster Neo4j docker con Helm

### Instalar Helm
Hay dos partes en Helm: El cliente Helm (helm) y el servidor Helm (Tiller). Esta guía muestra cómo instalar el cliente

#### De binario
1. Descargar una [Versión](https://github.com/helm/helm/releases)
2. Descomprimir (`tar -zxvf helm-v2.0.0-linux-amd64.tgz`)
3. Encuentre el binario helm y muevalo al directorio que desee (`mv linux-amd64/helm /usr/local/bin/helm`)

Ya puede correr el cliente

#### Snap (Linux)
`sudo snap install helm --classic`

#### Homebrew (macOS)
`brew install kubernetes-helm`

#### Chocolatey o scoop (Windows)
`choco install kubernetes-helm`

El binario también se puede instalar a través del instalador de línea de comandos de Scoop.

`scoop install helm`

### Crear Pods y Servicio

`helm install --name neo4j-helm stable/neo4j --set acceptLicenseAgreement=yes --set neo4jPassword=querty`

### Eliminar Pods y Servicio

`helm delete neo4j-helm --purge`

### FAQ
- ¿Por qué no puedo instalar el paquete de neo4j?<br>
R: pueba los siguientes comandos eh intenta de nuevo (`helm reset`) y (`helm init`)

- ¿Cómo puedo probar si funciona la base de datos?
R: usa (`kubectl port-forward neo4j-cluster-neo4j-core-1 7474:7474 7687:7687`) para probar en [localhost:8474](http://localhost:8474)

## REDIS

La solución propuesta para redis fue [Redis Labs](https://redislabs.com/)

# Changelog
No hay cambios de ruptura

# Ayuda
@AlbertoPascal, beto_pascal@hotmail.com
@antony999k, antony999k@hotmail.com

# Referencias
- [Neo4j y helm](https://github.com/helm/charts/tree/master/stable/neo4j)
