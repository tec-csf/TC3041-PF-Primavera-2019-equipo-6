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

/*
//Obtener mi usuario ********************************************************************************
exports.getMyUser = (req, res, next) => {
  db.query(
    'SELECT id, nombre, apellido, correo, img, imgSubidas, empresa, puesto, area FROM Usuarios WHERE correo=\'' + res.locals.tokenDecoded.correo + '\'',
    function(err, results, fields) {
      if (err) {
        let e = new Error(err);
        e.name = "internal";
        return next(e);
      }
      if (results.length == 0) {
        let e = new Error('Usuario no encontrado');
        e.name = "notFound";
        return next(e);
      }
      //Convierte el array en objeto
      let finalResults = results[0]

      res.send(finalResults)
    }
  );

}
*/

/*
///LOGIN/ ingresar con un usuario ********************************************************************************
exports.loginUser = (req, res, next) => {
  if ((req.body.correo == null || req.body.correo == undefined) || (req.body.contrasenia == null || req.body.contrasenia == undefined)) {
    let e = new Error('Se debe ingresar correo y contraseña');
    e.name = "badRequest";
    return next(e);
  }

  let hash = "";

  db.query(
    'SELECT id, privilegios, contrasenia FROM Usuarios WHERE correo=\'' + req.body.correo + '\'',
    function(err, results, fields) {
      if (err) {
        let e = new Error(err);
        e.name = "internal";
        return next(e);
      }
      if (results.length == 0) {
        let e = new Error('Usuario no encontrado');
        e.name = "notFound";
        return next(e);
      }
      //Convierte el array en objeto
      let finalResults = results[0]
      hash = finalResults.contrasenia;
      let admin = false;

      if(finalResults.privilegios == "admin"){
        admin = true;
      }


      bcrypt.compare(req.body.contrasenia, hash, function(err, resp) {
        if(resp == false){
          let e = new Error('Las credenciales no son válidas');
          e.name = "unautorized";
          return next(e);
        }else{
          res.status(200).send({
            status: 200,
            name: 'Ok',
            customMessage: 'Autenticación correcta',
            message: 'Ok',
            token: authHelper.createToken({"correo": req.body.correo, "id": finalResults.id, "admin": admin })
          })
        }
      });
    }
  );
}

//Recuperar cuenta ( Mandar correo ) ********************************************************************************
exports.recovery = (req, res, next) =>{
  if (req.body.correo == null || req.body.correo == undefined) {
    let e = new Error('Se debe ingresar un correo');
    e.name = "badRequest";
    return next(e);
  }

  let mailToken = "";

  //Crear un mailToken
  try {
    mailToken = authHelper.createMailToken();
  } catch (err) {
    let e = new Error('No se pudo verificar la información del usuario');
    e.name = "internal";
    return next(e);
  }
  res.send({"mailToken" : mailToken})
}

//Recuperar cuenta ( Cambiar contraseña ) ********************************************************************************
exports.changePassword = (req, res, next)=>{
  res.send("jeloww2")
}

//Añadir imágen subida usuario ********************************************************************************
exports.addUploadedImage = (req, res, next) => {
  db.query(
    'UPDATE Usuarios SET imgSubidas = imgSubidas + 1  WHERE correo=\'' + res.locals.tokenDecoded.correo + '\'',
    function(err, results, fields) {
      if (err) {
        let e = new Error(err);
        e.name = "internal";
        return next(e);
      }
      res.status(200).send({
        status: 200,
        name: 'OK',
        customMessage: 'El usuario sumó una imágen correctamente',
        message: 'Recurso actualizado',
      });
  });
}
*/