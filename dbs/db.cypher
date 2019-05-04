//Comandos de usuarios ********************************************************

//Constrains para los usuarios
CREATE CONSTRAINT ON (user:User) ASSERT user.id IS UNIQUE;
CREATE CONSTRAINT ON (user:User) ASSERT user.username IS UNIQUE;
CREATE CONSTRAINT ON (user:User) ASSERT user.mail IS UNIQUE

// Ejemplo crear usuario
CREATE (x:User {username:'antony999k',password:'qwerty',mail:'antony999k@hotmail.com',created_at:'2019-05-04T05:41:19.717Z',verified:false})

// Ejemplo follow
MATCH(n:User {username:"ferraz"}),(m:User {username:"antony999k"}) MERGE (n)-[r:FOLLOWS]->(m)
// Ejemplo unfollow
MATCH (n:User {username:'antony999k'})-[r:FOLLOWS]->(m:User {username:'itzel15'}) delete(r)
// Ejemplo followers de un usuario
MATCH ()-[r:FOLLOWS]->(n:User {username:'itzel15'}) RETURN count(r) as followers
// Ejemplo a cuantos sigue un usuario
MATCH ()<-[r:FOLLOWS]-(n:User {username:'itzel15'}) RETURN count(r) as followers
// Query de a quien seguir según tengan más posts
MATCH (a:User)-[r:CREATED]->(b:Post) RETURN a,COUNT(r) ORDER BY COUNT(r) LIMIT 5

//Comandos de posts ********************************************************

//Ejemplo crear un post
MATCH(u:User {username:"antony999k"}) CREATE (u)-[:CREATED]->(:Post {text:"Este es mi primer post en colibrí", created_at:"2019-05-04T05:41:19.717Z"})