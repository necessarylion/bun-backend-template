# Adonis-Bun Backend Framework

A modern, fast backend framework built with [Bun](https://bun.com) and inspired by Adonis.js architecture. This project provides a robust foundation for building scalable web applications with TypeScript, PostgreSQL, and dependency injection.

## 🚀 Features

- **Fast Runtime**: Built on Bun for exceptional performance
- **TypeScript First**: Full TypeScript support with type safety
- **Database Integration**: PostgreSQL with SQL migrations
- **Dependency Injection**: Clean architecture with TypeDI
- **Custom Router**: Lightweight, flexible routing system
- **Service Layer**: Organized business logic
- **Docker Ready**: Production-ready containerization
- **Logging**: Winston-based logging system
- **Hot Reload**: Development with file watching

## 📁 Project Structure

```
adonis-bun/
├── app/
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Request/response middleware
│   ├── models/          # Data models and interfaces
│   ├── services/        # Business logic layer
│   └── utils/           # Utility functions
├── config/              # Configuration files
├── core/                # Framework core components
├── db/
│   └── migrations/      # Database migrations
├── start/               # Application startup files
└── bin/                 # Build scripts
```

## 🛠️ Prerequisites

- [Bun](https://bun.com) (v1.2.19 or higher)
- PostgreSQL database

## ⚡ Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
```

### 3. Database Setup

Run the database migrations:

```bash
bun run migration:run
```

### 4. Start Development Server

```bash
bun run dev
```

The server will start on `http://localhost:3000` with hot reload enabled.

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with hot reload |
| `bun run build` | Build the application for production |
| `bun run start` | Run the built application |
| `bun run ace` | Run custom CLI commands |
| `bun run migration:run` | Run database migrations |
| `bun run migration:rollback` | Rollback last migration |
| `bun run lint` | Run ESLint for code quality |

## 🗄️ Database

### Migrations

The project uses a custom migration system. Migrations are located in `db/migrations/` and follow the pattern:

```
db/migrations/
├── 1752543759855_create_blogs/
│   ├── up.sql
│   └── down.sql
└── 1752543766220_create_users/
    ├── up.sql
    └── down.sql
```

### Running Migrations

```bash
# Run all pending migrations
bun run migration:run

# Rollback last migration
bun run migration:rollback
```

## 🏗️ Architecture

### Controllers

Controllers handle HTTP requests and responses. They use dependency injection for services:

```typescript
import { Service } from 'typedi';
import UserService from '../services/user.service';

@Service()
export default class UserController {
  constructor(private readonly userService: UserService) {}

  public async index() {
    return this.userService.getUsers();
  }
}
```

### Services

Services contain business logic and database operations:

```typescript
import { Service } from 'typedi';
import sql from '#start/sql';

@Service()
export default class UserService {
  async getUsers() {
    const users = await sql`SELECT * FROM users LIMIT 1`;
    return { message: 'Users fetched successfully', data: users };
  }
}
```

### Models

Models define data structures and interfaces:

```typescript
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
```

## 🛣️ Routing

Routes are defined in `start/routes.ts`:

```typescript
import UserController from '#controllers/user.controller';
import Route from '#core/route';

// Simple routes
Route.get('/', [UserController, 'index']);

// Route groups
Route.group('/users', () => {
  Route.get('/', [UserController, 'getUsers']);
  Route.post('/', [UserController, 'createUser']);
});
```

## 🐳 Docker

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t bun-backend-template .

# Run the container
docker run -p 3000:3000 bun-backend-template
```

### Docker Compose (Optional)

Create a `docker-compose.yml` for local development:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=postgres
      - DB_PASSWORD=password
      - DB_DATABASE=postgres
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=postgres
    ports:
      - "5432:5432"
```

## 🔧 Configuration

### Database Configuration

Database settings are in `config/database.ts`:

```typescript
export default {
  hostname: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_DATABASE,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  max: 20,
  idleTimeout: 30,
  maxLifetime: 0,
  connectionTimeout: 30,
} as SQLOptions;
```

### Logging

Logging is configured in `config/logger.ts` using Winston.

## 🚀 Production Deployment

### Build for Production

```bash
bun run build
```

This creates a standalone binary in the root directory.

### Run Production Server

```bash
./server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using [Bun](https://bun.com) and TypeScript.
