# Welcome to PROJ_NAME!

Developed by **IT Minds**

## Quickstart

To run the project locally make sure to install all the correct versions of the **prerequisites** and follow the steps for both the **backend** and **frontend** services.

### prerequisites

1. Install [.NET 7 SDK](https://dotnet.microsoft.com/download)
2. Install the latest [EF CLI Tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)
3. Install [Node.js 18](https://nodejs.org/download/release/v18.18.2/)

### backend

> **Initial run:** Before the first run you need to apply the database migrations
> - cd backend\Web
> - dotnet ef database update

To run the backend simply follow
- cd backend\Web
- dotnet build
- dotnet run

You should now be able to visit the swaggerpage using the path /swagger
> To get the URL of the backend look for the following line in the console output of the run command.
> Now listening on: https://localhost:xxxxx which will be the URL your local backend is running on.

### frontend
> **Initial run:** Before the first run you need to set up the local environment variables
> - cd frontend
> - cp .env.example .env.local
> - ensure the backendurl in .env.local is matching the url the backend is running on.

To run the frontend simply follow
- cd  frontend
- npm i
- npm run dev

You should now be able to visit the frontend
> To get the URL of the frontend look for the following line in the console output of the run command.
> - ready started server on 0.0.0.0:xxxxx, url: http://localhost:xxxxx
