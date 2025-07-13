import UserController from "#controllers/user.controller";
import { Route } from "#routes/index";

Route.get('/', [UserController, 'index']);
Route.post('/users', [UserController, 'createUser']);
Route.get('/users', [UserController, 'getUsers']);
Route.get('/ok', () => {
  return new Response('ok')
})