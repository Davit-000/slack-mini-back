# Mini Slack App

### Install dependencies
```
npm install
```

### Create MySQL database in your mysql console
```
CREATE DATABASE <db_name> CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Database configurations
#### Add your db configs to app .env file located in the root of project
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=<db_name>
DB_USERNAME=root
DB_PASSWORD=
```

### Database migrations
#### run command in console opened in project root path
```
knex migrate:latest
```

### Database seeds (optional)
#### run command in console opened in project root path
it is optional because it creates only one user, you can do it by your self in front end application 
```
knex seed:run
```

### Run the App by running command
```
npm run start
```

# Enjoy!!!
