// middlewares/auth.middleware.js
'use strict';
const authHelper = require('../helpers/auth.helper');
const bcrypt = require('bcrypt');
const debug = require('debug')('dev');

exports.isAuth = (req, res, next) => {
  //Revisa si authorization esta en la cabezera
  if (!req.headers.authorization) {
    let e = new Error('No tienes permiso para acceder a este contenido');
    e.name = "forbidden";
    return next(e);
  }

  let token = req.headers.authorization;
  
  authHelper.validateRequest(token, function(err, tokenDecoded){
    if (err){
      let e = new Error("Token de usuario inválido");
      e.name = "internal"
      return next(e);
    }
    res.locals.tokenDecoded = tokenDecoded;
    next();
  });
}

exports.validateAuth = (req, res, next) =>{
  //Revisa si authorization esta en la cabezera
  if (!req.headers.authorization) {
    let e = new Error('No tienes permiso para acceder a este contenido');
    e.name = "forbidden";
    return next(e);
  }

  let token = req.headers.authorization;
  
  authHelper.validateRequest(token, function(err, tokenDecoded){
    if (err){
      let e = new Error("Token de usuario inválido");
      e.name = "internal"
      return next(e);
    }
    res.locals.tokenDecoded = tokenDecoded;
    res.status(200).send(res.locals.tokenDecoded);
  });
}
/*
exports.isAuthAdmin = (req, res, next) => {
  if(res.locals.tokenDecoded.admin == true){
    return next();
  } else{
    let e = new Error('La ruta funciona correctamente pero no cuentas con los permisos de administrador');
    e.name = "forbidden";
    return next(e);
  }
}
*/
