const { Router } = require('express');

const sessionsRouter = require('./sessions.routes');
const usersRouter = require('./users.routes');
const notesRouter = require('./notes.routes');

const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use('/users', usersRouter);
routes.use('/notes', notesRouter);

module.exports = routes;

