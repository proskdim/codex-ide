# NestJS rules

## Architecture

- Standard: Module -> Controller -> Service -> Repository/Entity.
- One Domain per Module: Keep features encapsulated.

## Coding Standards

1. Controllers:
    - Keep them thin. Logic belongs in Services.
    - Use DTOs for all `@Body()` and `@Query()`.
    - Always use `ParseIntPipe`, `ParseUUIDPipe` etc. for `@Param()`.
2. Services:
    - Business logic only.
    - Use `private readonly` for dependencies.
3. DTOs:
    - Must use `class-validator` decorators (`@IsString()`, `@IsOptional()`).
    - Must use `class-transformer` if transformation is needed.

## Database (PrismaORM)

- Use Prisma Client to interact with your database.
  - Create services to manage entities and abstract database operations from the handlers.
  - Use Prisma's schema for generating types and migrations.
- A core folder for shared utilities:
  - Middleware for common request handling.
  - Global error handlers.
  - Logging and instrumentation.
  - Utility functions used across the application.
- Environment management:
  - Use dotenv or a similar library to manage environment variables.
  - Store sensitive information in environment variables (like DB_URL).

## Security & Core

- Use Global Exception Filters to standardize error responses.
- Use Guards for Auth/Permissions.
- Use Interceptors (`ClassSerializerInterceptor`) to strip private fields from responses.

## Backend Testing

- Use the standard Jest framework for testing.
- Write tests for each controller and service.
- Write end to end tests for each api module.
- Add a admin/test method to each controller as a smoke test
