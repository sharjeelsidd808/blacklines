const util = require('util')
const express = require('express')
const mongoose = require('mongoose')
const joi = require('joi')
const winston = require('winston')
const cors = require('cors')
const socketIO = require('socket.io')
const moment = require('moment')
const listdir = require('./listdir')
const path = require('path')
const SocketAuth = require('./SocketAuth')


module.exports = {
    util,
    express,
    mongoose,
    joi,
    cors,
    winston,
    socketIO,
    listdir,
    SocketAuth,
    moment,
    path
}
