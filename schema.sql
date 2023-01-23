
DROP DATABASE IF EXISTS employee_manager_db;
CREATE DATABASE employee_manager_db;

USE employee_manager_db;

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  first_name VARCHAR(30) NOT NULL, 
  last_name VARCHAR(30) NOT NULL, 
  role_id INT NOT NULL,
  manager_id INT NOT NULL
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  title VARCHAR(30) NOT NULL, 
  salary DECIMAL NOT NULL, 
  department_id INT NOT NULL
);

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  name VARCHAR(30) NOT NULL
);
