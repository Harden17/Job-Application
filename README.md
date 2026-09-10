# JOB APPLICATION APP
A Backend application for managing job applications.

## GETTING STARTED
### PREREQUISITES
In order to run this application, your computer should have the following software installed.
* **Docker**
* **Nodejs**
* **Git**
* **Postgresql**
---
### INSTALLATION
These commands help you download the code and install the necessary dependencies
* git clone 
* npm install
---
###  ENVIRONMENT VARIABLES CONFIGURATION
This project needs environment variables therefore create your .env files and add the following variables
* PORT
* DATABASE_URL
---
### DATABASE CONFIGURATION
Since this project uses **Prisma**, you do not need to manually import SQL files. Prisma will configure your database automatically.

1. Ensure your PostgreSQL database (or Docker container) is running.
2. Run the migrations to build your database tables:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Generate the dynamic Prisma Client for your JavaScript code:
   ```bash
   npx prisma generate
   ```
---   
### RUN COMMAND

Once your dependencies are installed, your configuration is set, and your database is initialized, you can launch the application.

To start the development server with live-reloading:
```bash
npm run dev
```

The server should now be running locally at `http://localhost:3000`.   