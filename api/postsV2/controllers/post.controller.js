//controllers/user.controller.js
'use strict';
// Bases de datos =================================================
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'querty'));
const session = driver.session();
const debug = require('debug')('dev'); //Herramienta para imprimir log en dev mode
const request = require('request');

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
}

//Obtener todos los Post (Limitado) ********************************************************************************
exports.getAllPosts = (req, res, next) => {
    session
        .run('MATCH (n:Post) return n LIMIT 30')
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

//Obtener un post por su id ********************************************************************************
exports.getPost = (req, res, next) => {
    session
        .run('MATCH (n:Post) WHERE ID(n) = '+ req.params.id +' RETURN n')
        .then(function (result) {
            if(result.records.length == 0){
                let e = new Error("Post no encontrado");
                e.name = "notFound";
                return next(e);
            }else{
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
    session
    .run('MATCH(a:User)-[:CREATED]->(b:Post) WHERE a.username ="'+ req.params.username +'" RETURN b')
    .then(function (result) {
        if(result.records.length == 0){
            let e = new Error(req.params.username + " No existe o no tiene ningún post");
            e.name = "notFound";
            return next(e);
        }else{
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
                .run('MATCH(n:User {username:"'+ JSON.parse(body).username +'"}),(m:Post) WHERE ID(m) = '+ req.params.id +' MERGE (n)-[r:LIKES]->(m)')
                .then(function (result) {
                    console.log(result)
                    if(result.summary.counters._stats.relationshipsCreated == 0){
                        let e = new Error("El post no existe o ya fue likeado");
                        e.name = "conflict";
                        return next(e);
                    }else{
                        res.status(201).send({
                            status: 201,
                            name: 'Created',
                            customMessage: 'El post('+ req.params.id +') fue likeado',
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
                    .run('MATCH (n:User {username:"'+ JSON.parse(body).username +'"})-[r:LIKES]->(m:Post) WHERE ID(m) = '+ req.params.id +' delete(r)')
                    .then(function (result) {
                        if(result.summary.counters._stats.relationshipsDeleted == 0){
                            let e = new Error("El post no existe o no esta likeado");
                            e.name = "conflict";
                            return next(e);
                        }else{
                            res.status(201).send({
                                status: 201,
                                name: 'Created',
                                customMessage: 'El post('+ req.params.id +') fue deslikeado',
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

