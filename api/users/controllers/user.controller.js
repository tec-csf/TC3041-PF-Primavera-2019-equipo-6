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
      if(result.records.length == 0){
        let e = new Error("Usuario no encontrado");
        e.name = "notFound";
        return next(e);
      }else{
        res.status(200).send(result.records[0]);
        session.close();
      }
    })
    .catch(function(error){
      let e = new Error(error);
      e.name = "internalServerError";
      return next(e);
    })
}

//Registrar un usuario ********************************************************************************
exports.registerUser = (req, res, next) => {
  if (req.body.mail == undefined || req.body.username == undefined || req.body.password == undefined) {
    let e = new Error('Se debe ingresar los campos requeridos (mail, username, password)');
    e.name = "badRequest";
    return next(e);
  }
  //Variable temporal que almacena los datos de usuario
  let Usuario = {
    "mail":req.body.mail,
    "username":req.body.username,
    "password":req.body.password 
  }

  //Hashea la contraseña para que pueda ser guardada en la base de datos
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if (err) {
      let e = new Error('Error al guardar usuario');
      e.name = "internal";
      return next(e);
    }
    Usuario.password = hash;
    Usuario.created_at = new Date().toISOString();
    //Query inicial
    let query = 'CREATE (x:User {password:"' + Usuario.password + '",mail:"' + Usuario.mail + '",username:"' + Usuario.username + '",created_at:"' + Usuario.created_at;
    if(req.body.name != undefined){
      Usuario.name = req.body.name;
      query = query + '",name:"' + Usuario.name;
    }
    query = query + '"})'

    session
    .run(query)
    .then(function(result){
      res.status(201).send({
        status: 201,
        name: 'Created',
        customMessage: 'El usuario fue creado con exito',
        message: 'Recurso creado',
        token: authHelper.createToken({"correo": Usuario.correo, "username": Usuario.username})
      });
    }).catch(function(error){
      let e = new Error(error);
      e.name = "internalServerError";
      return next(e);
    })
  });
}