
USE employee_manager_db;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Employee_1", "One_Owner", 1, 1), 
       ("Employee_2", "Two_Accountant", 3, 1), 
       ("Employee_3", "Three_HR", 5, 1), 
       ("Employee_4", "Four_Lawyer", 2, 2), 
       ("Employee_5", "Five_Sales", 4, 2), 
       ("Employee_6", "Six_Facility", 7, 2), 
       ("Employee_7", "Seven_Developer", 6, 1), 
       ("Employee_8", "Eight_Manager", 8, 1), 
       ("Employee_9", "Nine_Manager~", 9, 8), 
       ("Employee_10", "Ten_Worker", 12, 8), 
       ("Employee_11", "Eleven_Worker", 11, 8), 
       ("Employee_12", "Twelve_Worker", 10, 9), 
       ("Employee_13", "Thirteen_Worker", 10, 9);


INSERT INTO roles (title, salary, department_id)
VALUES ("Owner", 1000000, 1), 
       ("Lawyer", 250000, 2), 
       ("Accountant", 250000, 2), 
       ("Sales_Representative", 200000, 3), 
       ("HR_Agent", 175000, 4), 
       ("Developer", 150000, 5), 
       ("Facility_Manager", 125000, 6), 
       ("Manager", 100000, 7), 
       ("Manager_Assistant", 75000, 7), 
       ("Associate_1", 30000, 8), 
       ("Associate_2", 40000, 8), 
       ("Associate_3", 50000, 8);

INSERT INTO departments (name)
VALUES ("Administration"), 
       ("Legal_And_Finance"), 
       ("Marketing"), 
       ("Human_Relations"), 
       ("Research_And_Development"), 
       ("Inventory_And_Maintenance"), 
       ("Management"), 
       ("Service");
