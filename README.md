# Business Inquiries API

API REST desarrollada con NestJS para la gestión de solicitudes comerciales internas.

Permite registrar, consultar y actualizar solicitudes aplicando control de acceso por usuario, roles y API Key.

## Technologies

- Node.js
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Swagger / OpenAPI
- class-validator

## Installation

Install dependencies:

```bash
npm install
```

Create the environment file from `.env.example`:

```bash
cp .env.example .env
```

Example environment configuration:

```env
PORT=3001

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=change_me
POSTGRES_DB=riwi_business_inquiries

API_KEYS=key-one,key-two
```

Make sure PostgreSQL is running and the configured database exists.

## Run the application

Development mode:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3001
```

## Swagger

Interactive API documentation:

```text
http://localhost:3001/api/docs
```

Swagger allows testing the API directly.

Use **Authorize** to configure the API Key.

Example:

```text
key-one
```

Each functional endpoint also requires the `x-user` header.

## Available users

| User | Role |
|---|---|
| `admin1` | admin |
| `supervisor1` | supervisor |
| `asesor1` | asesor |
| `asesor2` | asesor |

Users are stored in memory and are identified using the `x-user` header.

## Required headers

```text
x-api-key: key-one
x-user: asesor1
```

Multiple API Keys can be configured using the `API_KEYS` environment variable separated by commas.

## Endpoints

### Create inquiry

```http
POST /inquiries
```

All valid roles can create inquiries.

An inquiry is always created with:

```text
PENDIENTE
```

If the user creating the inquiry has the `asesor` role, the inquiry is automatically assigned to that same user.

### List inquiries

```http
GET /inquiries
```

- `admin`: can view all inquiries.
- `supervisor`: can view all inquiries.
- `asesor`: can only view inquiries assigned to themselves.

The adviser restriction is applied directly in the database query.

### Get inquiry by ID

```http
GET /inquiries/:id
```

Admin and supervisor users can access any inquiry.

Advisers can only access inquiries assigned to themselves.

### Update inquiry status

```http
PATCH /inquiries/:id/estado
```

Valid transitions are:

```text
PENDIENTE → EN_GESTION → RESUELTA
```

Invalid transitions such as:

```text
PENDIENTE → RESUELTA
RESUELTA → PENDIENTE
```

are rejected.

## Response format

Successful responses follow this structure:

```json
{
  "success": true,
  "data": {}
}
```

Errors follow this structure:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "timestamp": "2026-10-09T00:00:00.000Z"
}
```

## Security

Functional endpoints are protected using:

```text
x-api-key
x-user
```

The application uses Guards to validate the API Key, identify the user and verify authorized roles.

## Validation

DTOs are validated using `class-validator` and NestJS `ValidationPipe`.

Invalid request data returns the corresponding HTTP error response.

## Author

Valery Avila Ortega