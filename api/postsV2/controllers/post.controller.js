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
    if(!req.body.text){
        let e = new Error('Se debe ingresar los campos requeridos (text)');
        e.name = "badRequest";
        return next(e);
    }
    if (!req.headers.authorization) {
        let e = new Error('No tienes permiso para crear posts');
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
                .run('MATCH(u:User {username:"'+ JSON.parse(body).username +'"}) CREATE (u)-[:CREATED]->(:Post {text:"'+ req.body.text +'", created_at:datetime("'+ new Date().toISOString() +'")})')
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

//Eliminar un ********************************************************************************
exports.deletePost = (req, res, next) =>{
    if(!req.body.id){
        let e = new Error('Se debe ingresar los campos requeridos (id)');
        e.name = "badRequest";
        return next(e);
    }
    if (!req.headers.authorization) {
        let e = new Error('No tienes permiso para eliminar posts');
        e.name = "unautorized";
        return next(e);
    }

    session
    .run('MATCH(u:Post) where ID(u)='+req.body.id+' DETACH DELETE(u)')
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
        .run('MATCH (n:Post) return n')
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