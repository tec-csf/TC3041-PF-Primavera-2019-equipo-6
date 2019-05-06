//controllers/user.controller.js
'use strict';
// Bases de datos =================================================
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'querty'));
const session = driver.session();
const debug = require('debug')('dev'); //Herramienta para imprimir log en dev mode
const request = require('request');
const redis = require('redis')

// create and connect redis client to local instance.
const client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, password: process.env.REDIS_PASSWORD })
// echo redis errors to the console
client.on('error', (err) => {
    debug("Error " + err)
});

//Crear un post ********************************************************************************
exports.createPost = (req, res, next) => {
    if (!req.headers.authorization) {
        let e = new Error('No tienes permiso para crear posts');
        e.name = "unautorized";
        return next(e);
    }
    if (!req.body.text) {
        let e = new Error('Se debe ingresar los campos requeridos (text)');
        e.name = "badRequest";
        return next(e);
    }
    //Auth token de usuario
    let options = {
        url: 'http://localhost:8000/auth',
        headers: { 'Authorization': req.headers.authorization }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200 || response.statusCode == 201) {
            session
                .run('MATCH(u:User {username:"' + JSON.parse(body).username + '"}) CREATE (u)-[:CREATED]->(:Post {text:"' + req.body.text + '", created_at:datetime("' + new Date().toISOString() + '")})')
                .then(function (result) {
                    res.status(201).send({
                        status: 201,
                        name: 'Created',
                        customMessage: 'El post fue creado con éxito',
                        message: 'Recurso creado'
                    });
                    session.close();
                })
                .catch(function (error) {
                    let e = new Error(error);
                    e.name = "internalServerError";
                    return next(e);
                })
        } else {
            res.status(response.statusCode).send(JSON.parse(body))
        }
    })
}

//Eliminar un post ********************************************************************************
exports.deletePost = (req, res, next) => {
    if (!req.headers.authorization) {
        let e = new Error('No tienes permiso para eliminar posts');
        e.name = "unautorized";
        return next(e);
    }
    if (!req.body.id) {
        let e = new Error('Se debe ingresar los campos requeridos (id)');
        e.name = "badRequest";
        return next(e);
    }
    //Auth token de usuario
    let options = {
        url: 'http://localhost:8000/auth',
        headers: { 'Authorization': req.headers.authorization }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200 || response.statusCode == 201) {
            session
                .run('MATCH(u:Post) where ID(u)=' + req.body.id + ' DETACH DELETE(u)')
                .then(function (result) {
                    res.status(200).send({
                        status: 200,
                        name: 'OK',
                        customMessage: 'El post fue eliminado con éxito',
                        message: 'OK'
                    });
                    session.close();
                })
                .catch(function (error) {
                    let e = new Error(error);
                    e.name = "internalServerError";
                    return next(e);
                })
        } else {
            res.status(response.statusCode).send(JSON.parse(body))
        }
    })
}

//Obtener todos los Post (Limitado) ********************************************************************************
exports.getAllPosts = (req, res, next) => {
    session
        .run('MATCH (u:User)-[:CREATED]->(n:Post) RETURN n.text, n.created_at, u.username, u.name, u.profile_img_url LIMIT 30')
        .then(function (result) {
            res.status(200).send(result.records);
            session.close();
        })
        .catch(function (error) {
            let e = new Error(error);
            e.name = "internalServerError";
            return next(e);
        })
}

//Obtener los posts de usuarios a los que sigue un usuario ********************************************************************************
exports.getFeedPosts = (req, res, next) => {
    if (!req.headers.authorization) {
        let e = new Error('No tienes permiso para eliminar posts');
        e.name = "unautorized";
        return next(e);
    }
    const usersRedisKey = 'posts:feed' + req.headers.authorization;
    return client.get(usersRedisKey, (err, data) => {
        // If that key exists in Redis store
        if (data) {
            return res.json(JSON.parse(data))
        } else { // Key does not exist in Redis store
            //Auth token de usuario
            let options = {
                url: 'http://localhost:8000/auth',
                headers: { 'Authorization': req.headers.authorization }
            };
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200 || response.statusCode == 201) {
                    session
                        .run('MATCH (u:User {username:"' + JSON.parse(body).username + '"})-[r:FOLLOWS]->(u2:User)-[:CREATED]->(p:Post) RETURN p.text, p.created_at, u2.username, u2.name, u2.profile_img_url ORDER BY p.created_at DESC')
                        .then(function (result) {
                            if (result.records.length == 0) {
                                let e = new Error(JSON.parse(body).username + " No sigue a ninguna cuenta con posts");
                                e.name = "notFound";
                                return next(e);
                            } else {
                                // Save the  API response in Redis store,  data expire time in 3600 seconds, it means one hour
                                client.setex(usersRedisKey, 3600, JSON.stringify(result.records))
                                res.status(200).send(result.records);
                                session.close();
                            }
                        })
                        .catch(function (error) {
                            let e = new Error(error);
                            e.name = "internalServerError";
                            return next(e);
                        })
                } else {
                    res.status(response.statusCode).send(JSON.parse(body))
                }
            })
        }
    });
}

//Obtener un post por su id ********************************************************************************
exports.getPost = (req, res, next) => {
    session
        .run('MATCH (u:User)-[:CREATED]->(n:Post) WHERE ID(n) = ' + req.params.id + ' RETURN n.text, n.created_at, u.username, u.name, u.profile_img_url')
        .then(function (result) {
            if (result.records.length == 0) {
                let e = new Error("Post no encontrado");
                e.name = "notFound";
                return next(e);
            } else {
                res.status(200).send(result.records[0]);
                session.close();
            }
        })
        .catch(function (error) {
            let e = new Error(error);
            e.name = "internalServerError";
            return next(e);
        })
}

//Obtener un posts de un usuario ********************************************************************************
exports.getUserPosts = (req, res, next) => {
    // key to store results in Redis store
    session
        .run('MATCH(u:User)-[:CREATED]->(n:Post) WHERE u.username ="' + req.params.username + '" RETURN n.text, n.created_at, u.username, u.name, u.profile_img_url ORDER BY n.created_at DESC')
        .then(function (result) {
            if (result.records.length == 0) {
                let e = new Error(req.params.username + " No existe o no tiene ningún post");
                e.name = "notFound";
                return next(e);
            } else {

                res.status(200).send(result.records);
                session.close();
            }
        })
        .catch(function (error) {
            let e = new Error(error);
            e.name = "internalServerError";
            return next(e);
        })
}

//Obtener un posts de mi usuario ********************************************************************************
exports.getMyPosts = (req, res, next) => {
    if (!req.headers.authorization) {
        let e = new Error('No tienes permiso para eliminar posts');
        e.name = "unautorized";
        return next(e);
    }
    //Auth token de usuario
    let options = {
        url: 'http://localhost:8000/auth',
        headers: { 'Authorization': req.headers.authorization }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200 || response.statusCode == 201) {
            session
            .run('MATCH(u:User)-[:CREATED]->(n:Post) WHERE u.username ="' + JSON.parse(body).username + '" RETURN n.text, n.created_at, u.username, u.name, u.profile_img_url ORDER BY n.created_at DESC')
            .then(function (result) {
                if (result.records.length == 0) {
                    let e = new Error(JSON.parse(body).username + " No existe o no tiene ningún post");
                    e.name = "notFound";
                    return next(e);
                } else {
                    res.status(200).send(result.records);
                    session.close();
                }
            })
            .catch(function (error) {
                let e = new Error(error);
                e.name = "internalServerError";
                return next(e);
            })
        } else {
            res.status(response.statusCode).send(JSON.parse(body))
        }
    })
}

//Likear un post ********************************************************************************
exports.likePost = (req, res, next) => {
    if (!req.headers.authorization) {
        let e = new Error('No tienes permiso para dar me gusta');
        e.name = "unautorized";
        return next(e);
    }
    //Auth token de usuario
    let options = {
        url: 'http://localhost:8000/auth',
        headers: { 'Authorization': req.headers.authorization }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200 || response.statusCode == 201) {
            session
                .run('MATCH(n:User {username:"' + JSON.parse(body).username + '"}),(m:Post) WHERE ID(m) = ' + req.params.id + ' MERGE (n)-[r:LIKES]->(m)')
                .then(function (result) {
                    if (result.summary.counters._stats.relationshipsCreated == 0) {
                        let e = new Error("El post no existe o ya fue likeado");
                        e.name = "conflict";
                        return next(e);
                    } else {
                        res.status(201).send({
                            status: 201,
                            name: 'Created',
                            customMessage: 'El post(' + req.params.id + ') fue likeado',
                            message: 'Recurso creado'
                        });
                    }
                    session.close();
                })
                .catch(function (error) {
                    let e = new Error(error);
                    e.name = "internalServerError";
                    return next(e);
                })
        } else {
            res.status(response.statusCode).send(JSON.parse(body))
        }
    })
}

//Deslikear un post ********************************************************************************
exports.dislikePost = (req, res, next) => {
    if (!req.headers.authorization) {
        let e = new Error('No tienes permiso para quitar me gusta');
        e.name = "unautorized";
        return next(e);
    }
    //Auth token de usuario
    let options = {
        url: 'http://localhost:8000/auth',
        headers: { 'Authorization': req.headers.authorization }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200 || response.statusCode == 201) {
            session
                .run('MATCH (n:User {username:"' + JSON.parse(body).username + '"})-[r:LIKES]->(m:Post) WHERE ID(m) = ' + req.params.id + ' delete(r)')
                .then(function (result) {
                    if (result.summary.counters._stats.relationshipsDeleted == 0) {
                        let e = new Error("El post no existe o no esta likeado");
                        e.name = "conflict";
                        return next(e);
                    } else {
                        res.status(201).send({
                            status: 201,
                            name: 'Created',
                            customMessage: 'El post(' + req.params.id + ') fue deslikeado',
                            message: 'Recurso creado'
                        });
                    }
                    session.close();
                })
                .catch(function (error) {
                    let e = new Error(error);
                    e.name = "internalServerError";
                    return next(e);
                })
        } else {
            res.status(response.statusCode).send(JSON.parse(body))
        }
    })
}

exports.getPostsNumber = (req, res, next) => {
    session
        .run('MATCH(:User {username:"' + req.params.username + '"})-[:CREATED]->(p:Post) RETURN count(p) as posts')
        .then(function (result) {
            res.status(201).send(result.records[0]);
            session.close();
        })
        .catch(function (error) {
            let e = new Error(error);
            e.name = "internalServerError";
            return next(e);
        })
}

exports.getMyPostsNumber = (req, res, next) => {
    if (!req.headers.authorization) {
        let e = new Error('No tienes permiso para quitar me gusta');
        e.name = "unautorized";
        return next(e);
    }
    //Auth token de usuario
    let options = {
        url: 'http://localhost:8000/auth',
        headers: { 'Authorization': req.headers.authorization }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200 || response.statusCode == 201) {
            session
                .run('MATCH(:User {username:"' + JSON.parse(body).username + '"})-[:CREATED]->(p:Post) RETURN count(p) as posts')
                .then(function (result) {
                    res.status(201).send(result.records[0]);
                    session.close();
                })
                .catch(function (error) {
                    let e = new Error(error);
                    e.name = "internalServerError";
                    return next(e);
                })
        } else {
            res.status(response.statusCode).send(JSON.parse(body))
        }
    })
}

