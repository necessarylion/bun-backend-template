import UserController from '#controllers/user.controller';
import Route from '#core/route';

Route.get('/', [UserController, 'index']);
Route.get('/ok', () => {
  return new Response('ok');
});

Route.group('/users', () => {
  Route.get('/', [UserController, 'createUser']);
  Route.get('/list', [UserController, 'getUsers']);
});

Route.group('/blogs', () => {
  Route.get('/', [UserController, 'createUser']);
  Route.get('/list', [UserController, 'getUsers']);
});
