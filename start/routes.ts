import UserController from "#controllers/user.controller";
import UserMiddleware from "../app/middlewares/user.middleware";
import { Route } from "../router/index";

Route.get('/', [UserController, 'index']);
Route.post('/users', [UserController, 'createUser']);
Route.get('/users', [UserController, 'getUsers']).middleware(UserMiddleware).middleware((req) => {
  console.log('middleware 2')
})
Route.get('/ok', () => {
  return new Response('ok')
})