import UserController from "#controllers/user.controller";
import { Route } from "../routes";

Route.get('/', [UserController, 'index']);
Route.post('/users', [UserController, 'createUser']);
Route.get('/users', [UserController, 'getUsers']);
