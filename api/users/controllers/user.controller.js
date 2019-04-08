//controllers/user.controller.js
'use strict';
// Bases de datos =================================================
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','qwerty'));
const session = driver.session();
const debug = require('debug')('dev'); //Herramienta para imprimir log en dev mode
const authHelper = require('../helpers/auth.helper');
const bcrypt = require('bcrypt'); //Libreria para encriptar las contraseñas de los usuarios
const saltRounds = 13; //Numero de veces que se va a hashear la contraseña

//Obtener todos los Usuarios ********************************************************************************
exports.getUsers = (req, res, next) => {
  session
    .run('MATCH (n:User) RETURN n ')
    .then(function(result){
      res.status(200).send(result.records);
      session.close();
    })
    .catch(function(error){
      let e = new Error(error);
      e.name = "internalServerError";
      return next(e);
    })
}

//Obtener un usuario ********************************************************************************
exports.getUser = (req, res, next) => {
  if (req.params.username == null || req.params.username == undefined) {
    let e = new Error('Se debe ingresar un id');
    e.name = "badRequest";
    return next(e);
  }
  let username = req.params.username;

  session
    .run('Match (n:User {username:"' + username + '"}) RETURN (n)')
    .then(function(result){
      debug(result.records);
      if(result.records.length == 0){
        let e = new Error("Usuario no encontrado");
        e.name = "notFound";
        return next(e);
      }else{
        res.status(200).send(result.records);
        session.close();
      }
    })
    .catch(function(error){
      let e = new Error(error);
      e.name = "internalServerError";
      return next(e);
    })
}