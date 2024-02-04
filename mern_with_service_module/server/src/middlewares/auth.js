const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const { jwtAccessKey } = require('../secret')

const isLoggedIn = (req,res,next)=>{
    try {
        const accessToken = req.cookies.accessToken
        if(!accessToken){
          throw createError(401,'access token is not found!please login first.')
        }
        const decoded  = jwt.verify(accessToken,jwtAccessKey)
        if(!decoded){
            throw createError(402,'invalid access token!')
        }
        req.user = decoded.user
        next()
    } catch (error) {
        return next(error)
    }
}

const isLoggedOut = (req,res,next)=>{
    try {
        const accessToken = req.cookies.accessToken
        if(accessToken){
          try {
            const decoded  = jwt.verify(accessToken,jwtAccessKey)
          if(decoded){
            throw createError(400,'user is already loggedIn.')
          }
          } catch (error) {
            throw error;
          }
        }
        next()
    } catch (error) {
        return next(error)
    }
}

const isAdmin = (req,res,next)=>{
  try {
    if(!req.user.isAdmin){
      throw createError(403,'forbidden! you must be admin to access this resource.')
    } 
    next()
  } catch (error) {
      return next(error)
  }
}

module.exports = {isLoggedIn,isLoggedOut,isAdmin}