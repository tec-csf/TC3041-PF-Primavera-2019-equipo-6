//controllers/user.controller.js
'use strict';
// Bases de datos =================================================
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'querty'));
const session = driver.session();
const debug = require('debug')('dev'); //Herramienta para imprimir log en dev mode
const authHelper = require('../helpers/auth.helper'); //Auth ayuda a gestionar Json Web Tokens (jwt)
const bcrypt = require('bcrypt'); //Libreria para encriptar las contraseñas de los usuarios
const saltRounds = 13; //Numero de veces que se va a hashear la contraseña

//Obtener todos los Usuarios ********************************************************************************
exports.getUsers = (req, res, next) => {
  session
    .run('MATCH (n:User) RETURN n ')
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

//Obtener un usuario ********************************************************************************
exports.getUser = (req, res, next) => {
  if (req.params.username == null || req.params.username == undefined) {
    let e = new Error('Se debe ingresar un username');
    e.name = "badRequest";
    return next(e);
  }
  let username = req.params.username;

  session
    .run('Match (n:User {username:"' + username + '"}) RETURN (n)')
    .then(function (result) {
      if (result.records.length == 0) {
        let e = new Error("Usuario no encontrado");
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

//Obtener mi usuario ********************************************************************************
exports.getMyUser = (req, res, next) => {
  session
    .run('Match (n:User {username:"' + res.locals.tokenDecoded.username + '"}) RETURN (n)')
    .then(function (result) {
      if (result.records.length == 0) {
        let e = new Error("Usuario no encontrado");
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

//Registrar un usuario ********************************************************************************
exports.registerUser = (req, res, next) => {
  if (req.body.mail == undefined || req.body.username == undefined || req.body.password == undefined) {
    let e = new Error('Se debe ingresar los campos requeridos (mail, username, password)');
    e.name = "badRequest";
    return next(e);
  }

  //Variable temporal que almacena los datos de usuario
  let Usuario = {
    "mail": req.body.mail,
    "username": req.body.username,
    "password": req.body.password,
    "verified": false,
    "created_at": new Date().toISOString(),
  }

  //Hashea la contraseña para que pueda ser guardada en la base de datos
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (err) {
      let e = new Error('Error al guardar usuario');
      e.name = "internal";
      return next(e);
    }
    Usuario.password = hash;
    //Query inicial
    let query = 'CREATE (x:User {username:"' + Usuario.username + '",password:"' + Usuario.password + '",mail:"' + Usuario.mail + '",created_at:datetime("' + Usuario.created_at + '"),verified:"' + Usuario.verified;
    if (req.body.name != undefined) {
      Usuario.name = req.body.name;
      query = query + '",name:"' + Usuario.name;
    }
    if (req.body.description != undefined) {
      Usuario.description = req.body.description;
      query = query + '",description:"' + Usuario.description;
    }
    if (req.body.profile_img_url != undefined) {
      Usuario.profile_img_url = req.body.profile_img_url;
      query = query + '",profile_img_url:"' + Usuario.profile_img_url;
    }
    if (req.body.profile_banner_url != undefined) {
      Usuario.profile_banner_url = req.body.profile_banner_url;
      query = query + '",profile_banner_url:"' + Usuario.profile_banner_url;
    }
    
    query = query + '"})'
    //debug(query);

    session
      .run(query)
      .then(function (result) {
        res.status(201).send({
          status: 201,
          name: 'Created',
          customMessage: 'El usuario fue creado con éxito',
          message: 'Recurso creado',
          token: authHelper.createToken({ "correo": Usuario.correo, "username": Usuario.username })
        });
      }).catch(function (error) {
        if(error.code == "Neo.ClientError.Schema.ConstraintValidationFailed"){
          let e = new Error("Ya existe un usuario con ese username o correo");
          e.name = "badRequest";
          return next(e);
        }else{
          let e = new Error(error);
          e.name = "internalServerError";
          return next(e);
        }
      })
  });
}

///LOGIN/ ingresar con un usuario ********************************************************************************
exports.loginUser = (req, res, next) => {
  if ((req.body.username == null || req.body.username == undefined) || (req.body.password == null || req.body.password == undefined)) {
    let e = new Error('Se debe ingresar username y password');
    e.name = "badRequest";
    return next(e);
  }

  session
    .run('MATCH(u:User) WHERE(u.username = "' + req.body.username + '") RETURN u.password AS password, u.mail AS mail, u.username AS usename')
    .then(function (result) {
      if (result.records.length == 0) {
        let e = new Error("Usuario no encontrado");
        e.name = "notFound";
        return next(e);
      }
      let fields = result.records[0]._fields;

      bcrypt.compare(req.body.password, fields[0], function (err, resp) {
        if (resp == false) {
          let e = new Error('Las credenciales no son válidas');
          e.name = "unautorized";
          return next(e);
        } else {
          res.status(200).send({
            status: 200,
            name: 'Ok',
            customMessage: 'Autenticación correcta',
            message: 'Ok',
            token: authHelper.createToken({ "correo": fields[1], "username": fields[2] })
          })
        }
      });
    })
    .catch(function (error) {
      let e = new Error(error);
      e.name = "internalServerError";
      debug(e);
      return next(e);
    })
}

//FOLLOW follow a un usuario ********************************************************************************
exports.followUser = (req, res, next) => {
  if ((req.body.username == null || req.body.username == undefined) || (req.body.usernameTarget == null || req.body.usernameTarget == undefined)) {
    let e = new Error('Se debe ingresar un username y un usernameTarget');
    e.name = "badRequest";
    return next(e);
  }

  session
    .run('MATCH(n:User {username:"'+req.body.username+'"}),(m:User {username:"'+req.body.usernameTarget+'"}) MERGE (n)-[r:FOLLOWS]->(m)')
    .then(function (result) {
      if (result.summary.updateStatistics._stats.relationshipsCreated == 0) {
        let e = new Error("No se pudo seguir al usuario, es posible que ya lo sigas");
        e.name = "conflict";
        return next(e);
      } else {
        res.status(201).send({
          status: 201,
          name: 'Created',
          customMessage: 'Se siguio al usuario con éxito',
          message: 'Recurso creado',
        });
        session.close();
      }
    })
    .catch(function (error) {
      let e = new Error(error);
      e.name = "internalServerError";
      return next(e);
    })

}

//UNFOLLOW unfollow a un usuario ********************************************************************************
exports.unfollowUser = (req, res, next) => {
  if ((req.body.username == null || req.body.username == undefined) || (req.body.usernameTarget == null || req.body.usernameTarget == undefined)) {
    let e = new Error('Se debe ingresar un username y un usernameTarget');
    e.name = "badRequest";
    return next(e);
  }

  session
    .run('MATCH (n:User {username:"' + req.body.username + '"})-[r:FOLLOWS]->(m:User {username:"' + req.body.usernameTarget + '"}) delete(r)')
    .then(function (result) {
      if (result.summary.updateStatistics._stats.relationshipsDeleted == 0) {
        let e = new Error("No se pudo dejar de seguir al usuario, es posible que no lo sigas");
        e.name = "conflict";
        return next(e);
      } else {
        res.status(200).send({
          status: 200,
          name: 'Created',
          customMessage: 'Se dejo de seguir al usuario con éxito',
          message: 'Recurso eliminado'
        });
        session.close();
      }
    })
    .catch(function (error) {
      let e = new Error(error);
      e.name = "internalServerError";
      return next(e);
    })
}

//Regresa los followers de un usuario ********************************************************************************
exports.getFollowers = (req, res, next)=>{
  session
  .run('MATCH ()-[r:FOLLOWS]->(n:User {username:"'+req.params.username+'"}) RETURN count(r) as followers')
  .then(function (result) {
    res.status(200).send(result.records[0]);
    session.close();
  })
  .catch(function (error) {
    let e = new Error(error);
    e.name = "internalServerError";
    return next(e);
  })
}

// Regresa a cuantos sigue un usuario ********************************************************************************
exports.getFollowing = (req, res, next)=>{
  session
  .run('MATCH ()<-[r:FOLLOWS]-(n:User {username:"'+req.params.username+'"}) RETURN count(r) as followers')
  .then(function (result) {
    res.status(200).send(result.records[0]);
    session.close();
  })
  .catch(function (error) {
    let e = new Error(error);
    e.name = "internalServerError";
    return next(e);
  })
}

//Regresa los followers de mi usuario ********************************************************************************
exports.getMyFollowers = (req, res, next)=>{
  session
  .run('MATCH ()-[r:FOLLOWS]->(n:User {username:"'+res.locals.tokenDecoded.username+'"}) RETURN count(r) as followers')
  .then(function (result) {
    res.status(200).send(result.records[0]);
    session.close();
  })
  .catch(function (error) {
    let e = new Error(error);
    e.name = "internalServerError";
    return next(e);
  })
}

// Regresa a cuantos sigue mi usuario ********************************************************************************
exports.getMyFollowing = (req, res, next)=>{
  session
  .run('MATCH ()<-[r:FOLLOWS]-(n:User {username:"'+res.locals.tokenDecoded.username+'"}) RETURN count(r) as followers')
  .then(function (result) {
    res.status(200).send(result.records[0]);
    session.close();
  })
  .catch(function (error) {
    let e = new Error(error);
    e.name = "internalServerError";
    return next(e);
  })
}

/*

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