#  Job Application Tracker API

A backend application for managing job applications, built with **Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM**.

The API provides user authentication, protected endpoints, and job application management. It also includes automated tests and Docker support to improve reliability and simplify development.

---

##  Features

-  **User Authentication** — User registration and login using password hashing and JWT-based authentication.
-  **API Security** — Protected routes, input validation, security middleware, and rate limiting.
-  **Job Management** — Create, retrieve, update, and delete job application records.
-  **Database Management** — PostgreSQL integration using Prisma ORM and database migrations.
- **Automated Testing** — Unit and integration tests using Jest and Supertest.
- **Docker Support** — Containerised application setup for consistent environments.
-  **Environment Configuration** — Configurable application settings through environment variables.

---

##  Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | HTTP server and REST API |
| TypeScript | Static typing |
| PostgreSQL | Relational database |
| Prisma ORM | Database queries, schema, and migrations |
| JWT | Authentication |
| bcrypt | Password hashing |
| Jest | Automated testing |
| Supertest | HTTP endpoint testing |
| Docker | Containerisation |

---

## Project Structure

```text
Job-Application/
├── .github/
│   └── workflows/       # CI workflow configuration
├── prisma/               # Database schema and migrations
├── public/               # Frontend/static assets, if applicable
├── src/
│   ├── middleware/       # Authentication and security middleware
│   ├── routes/           # API routes
│   ├── server.ts         # Application entry point
│   └── prismaconfig.ts   # Prisma client configuration
├── tests/                # Automated tests
├── Dockerfile
├── .dockerignore
├── package.json
├── tsconfig.json
└── README.md
```

*The structure above is illustrative. Adjust the filenames and folders to match the current repository.*

---

##  Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following tools:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) (if running the application in containers)
- PostgreSQL, either locally or through Docker

### 1. Clone the repository

```bash
git clone https://github.com/Harden17/Job-Application.git
cd Job-Application
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root, or copy the provided example if one exists.

```env
PORT=3000
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_long_random_secret"
```

Use the variable names required by your application. If your project uses a different name for the JWT secret, follow the name defined in your code and `.env.example`.

### 4. Configure the database

Ensure PostgreSQL is running and that your `DATABASE_URL` points to the correct database.

Apply your existing Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma Client if required:

```bash
npx prisma generate
```

If the repository already contains migrations, use those migrations rather than creating a new initial migration unnecessarily.

### 5. Start the development server

```bash
npm run dev
```

By default, the application should be available at:

`http://localhost:3000`

Make sure the port matches your environment configuration.

---

## Running with Docker

Docker support allows the application to run in a containerised environment.

Build the image:

```bash
docker build -t job-application-api .
```

Start the container:

```bash
docker run --env-file .env -p 3000:3000 job-application-api
```

Ensure PostgreSQL is reachable from inside the container. If the database is running in another container, `localhost` in `DATABASE_URL` generally won't refer to that database container. Use the appropriate Docker network and database service name instead.

The commands above assume your Docker image starts the application and your database is configured separately. If your project uses Docker Compose, document its actual commands here instead.

---

##  Running Tests

The project uses Jest and Supertest to test API behaviour.

Run the full test suite:

```bash
npm test
```

The tests cover API functionality such as authentication and job application operations, according to the implemented test cases.

Testing helps identify regressions and verifies that endpoints behave as expected.

---

## Continuous Integration

The repository includes a GitHub Actions workflow for automating development checks.

A CI pipeline can run the test suite and verify that the application builds successfully whenever changes are pushed or a pull request is opened.

View the workflow files in `.github/workflows/` to see the checks configured for this project.

---

## API Functionality

The API supports authentication and job application management.

| Area | Functionality |
|---|---|
| Authentication | Register users and log in |
| Job applications | Create and retrieve application records |
| Job updates | Update application information or status |
| Job deletion | Delete application records |
| Authorization | Restrict protected operations to authenticated users |

The exact endpoints, request bodies, response formats, and authentication requirements should be documented in an API reference once confirmed against the implementation.

---

## Security Considerations

Security measures implemented in the application include password hashing, JWT-based authentication, and middleware for protecting API endpoints.

Additional security practices include validating incoming data, limiting request rates, managing secrets through environment variables, and ensuring users can access only their own job application records.

---

## Author

**Kayongo Emmanuel**

GitHub: [@Harden17](https://github.com/Harden17)

---

*Built as a practical project to develop backend engineering skills in API development, authentication, database management, automated testing, and containerisation.*
