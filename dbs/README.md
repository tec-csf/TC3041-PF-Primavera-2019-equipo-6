# Databases


## Neo4j


#Creación de ejemplo de datos para las relaciones:
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
