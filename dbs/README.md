# NEO4J Cluster

Cluster Neo4j docker con Helm

## Instalar Helm

Hay dos partes en Helm: El cliente Helm (helm) y el servidor Helm (Tiller). Esta guía muestra cómo instalar el cliente

### Instalar Helm Client

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

## Crear Pods

`helm install --name neo4j-helm stable/neo4j --set acceptLicenseAgreement=yes --set neo4jPassword=qwerty`


# Changelog
No hay cambios de ruptura

# Ayuda
@AlbertoPascal, beto_pascal@hotmail.com
@antony999k, antony999k@hotmail.com

# Referencias
- [Neo4j y helm](https://github.com/helm/charts/tree/master/stable/neo4j)
