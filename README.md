To run the website you need to:

Install NodeJS and MySQL Workbench.

After installing use the command "node -v" to check the version.

Use "npm init -y" to initial.

Then use "npm install express mysql2 body-parser uuid".

Then for creating table use "mysql -u root -p".

In the shell write this: 
"CREATE DATABASE login_app;

USE login_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO users (email, password) VALUES ('test@example.com', '1234');".

Then "exit".

For connecting the database in the server.js file the user and password needed to be change for your own.

After completeing all the steps for running the website use "node server.js".
