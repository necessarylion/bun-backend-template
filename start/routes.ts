import UserController from "#controllers/user.controller";
import UserMiddleware from "#middlewares/user.middleware";
import Route from "#router/route";

Route.get('/', [UserController, 'index']);
Route.get('/ok', () => {
  return new Response('ok')
})

Route.group('/users', () => {
  Route.get('/', [UserController, 'createUser']);
  Route.get('/list', [UserController, 'getUsers']);
}).middleware(UserMiddleware)
  .middleware((req) => {
    console.log('middleware 2')
  })

Route.group('/blogs', () => {
  Route.get('/', [UserController, 'createUser']);
  Route.get('/list', [UserController, 'getUsers'])
})
  .middleware((req) => {
    console.log('middleware 3')
  })