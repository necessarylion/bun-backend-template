import UserController from '#controllers/user.controller';
import Route from '#core/route';

Route.group('/users', () => {
  Route.get('/', [UserController, 'index']);
  Route.post('/', [UserController, 'create']);
  Route.put('/:id', [UserController, 'update']);
  Route.delete('/:id', [UserController, 'destroy']);
});
