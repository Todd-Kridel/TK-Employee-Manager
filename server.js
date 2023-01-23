

//
// Include packages that are needed for the application.
//
const theInquirerObject = require("inquirer");
const theDatabaseObject = require("MySQL2");
const theConsoleTableObject = require("console.table");  // for printing MySQL rows to the console
const { join } = require("path");


//
// Create the connection to the database.
//
const theDatabaseConnection = theDatabaseObject.createConnection({
host: 'localhost', 
user: 'github', 
password: 'User0@GH', 
database: 'employee_manager_db'
});


//
// Create a function that will get from the manager the next desired information entry action 
// that is necessary for processing of the employee database through the main system menu.
//
// GIVEN a command-line application that accepts user input
// WHEN I start the application...
// THEN I am presented with the following options: view all departments, view all roles, 
// view all employees, add a department, add a role, add an employee, and update an employee 
// role.
//
function doGetMainMenuInformationEntryActions() {
//
// Create a detail array and process for the prompt and data-gathering questions that are 
// to be asked for the main menu of the application by using the Inquirer system.
//
const theMainMenuInformationEntryOptions = 
[
"View All Employees", 
"Add Employee", 
"Update Employee Role", 
"View All Roles", 
"Add Role", 
"View All Departments", 
"Add Department", 
"Quit"
];
//
const theMainMenuInformationEntryOptionQuestions = 
[
{
name: "theMainMenuInformationEntryAction", 
type: "list", 
message: "What would you like to do?", 
choices: theMainMenuInformationEntryOptions
}
];
//
// Issue a call to the prompt function of the Inquirer object to get main menu information for 
// the employee database.
//
theInquirerObject
.prompt(theMainMenuInformationEntryOptionQuestions)
.then((answer) => {
    //console.log(answer.theMainMenuInformationEntryAction);
    //
    // Call to the utility function that processes the database action that corresponds to the 
    // selected menu option.
    //
    switch (answer.theMainMenuInformationEntryAction) { 
    //
    case "View All Employees": 
        doProcessMenuOptionViewAllEmployees();
        break;  
    case "Add Employee": 
        doProcessMenuOptionAddEmployee();
        break;
    case "Update Employee Role":
        doProcessMenuOptionUpdateEmployeeRole();
        break;
    case "View All Roles":
        doProcessMenuOptionViewAllRoles();
        break;
    case "Add Role":
        doProcessMenuOptionAddRole();
        break;
    case "View All Departments":
        doProcessMenuOptionViewAllDepartments();
        break;
    case "Add Department":
        doProcessMenuOptionAddDepartment();
        break;
    case "Quit":
        doProcessMenuOptionQuit();
        break;
    //
    }; 
//
})
.catch((error) => {
    if (error.isTtyError) {
    // Prompt could not be rendered in the current environment.
    }
    else {
    // A problem occurred with the utility-function processing of the prompt answer data.
    console.log(error);
    //"ERROR: A problem occurred with the processing of the prompt answer data.");
    };
});
//
}


//
// Create a function that will process the "View All Employees" menu option.
//
function doProcessMenuOptionViewAllEmployees() {
//
//console.log("The 'View All Employees' menu option was selected.");
//
// WHEN I choose to view all employees...
// THEN I am presented with a formatted table showing employee data, including employee IDs, 
// first names, last names, job titles, departments, salaries, and managers that the employees 
// report to.
//
theDatabaseConnection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, 
    roles.title, departments.name AS department, roles.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name 
    FROM employees AS employee 
    INNER JOIN employees AS manager ON employee.manager_id = manager.id
    JOIN roles ON employee.role_id = roles.id 
    JOIN departments ON roles.department_id = departments.id;`, 
    function(err, results) {
    //console.log(results);
    console.log("");
    console.log("");
    console.table(results);
    //
    // Re-display the main menu.
    //
    doGetMainMenuInformationEntryActions();
});
}


//
// Create a function that will process the "Add Employee" menu option.
//
function doProcessMenuOptionAddEmployee() {
//
//console.log("The 'Add Employee' menu option was selected.");
//
// WHEN I choose to add an employee...
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that 
// employee is added to the database.
//
// Create functions that will get/process the information that is necessary for the Employee Add 
// sub-menu process.
//
queryPromiseRoleChoicesData = () => {
return new Promise((resolve, reject) => {
    //
    // Query the "roles" table to obtain a list of current roles.
    //
    theDatabaseConnection.query(
    `SELECT id AS value, title AS name 
    FROM roles;`, 
    (error, results) => {
    if (error) {
    return reject(error);
    }
    //
    return resolve(results);
    });
});
};
//
queryPromiseManagerChoicesData = () => {
return new Promise((resolve, reject) => {
    //
    // Query the "employees" table to obtain a list of current managers.
    //
    theDatabaseConnection.query(
    `SELECT DISTINCT employee.id AS value, CONCAT(employee.first_name, ' ', employee.last_name) AS name 
    FROM employees AS employee 
    RIGHT JOIN employees AS manager ON employee.manager_id = manager.id
    WHERE employee.role_id = 1 OR employee.role_id = 3 OR employee.role_id = 8 OR employee.role_id = 9;`, 
    (error, results) => {
    if (error) {
        return reject(error);
    }
    return resolve(results);
    });
});
};
//
queryPromiseInsertDataProcessing = (first_name_data, last_name_data, role_id_data, manager_id_data) => {
return new Promise((resolve, reject) => {
    //
    // Insert the new employee record into the employees table. Then re-display the main menu.
    //
    theDatabaseConnection.query(
    `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
    VALUES ("${first_name_data}", "${last_name_data}", ${role_id_data}, ${manager_id_data});`, 
    (error, results) => {
    if (error) {
        return reject(error);
    }
    console.log("ADDED EMPLOYEE RECORD: " + first_name_data + " " + last_name_data + 
        "; role/title ID: " + role_id_data + "; manager ID: " + manager_id_data);
    //
    // Re-Display the main menu.
    //
    doGetMainMenuInformationEntryActions();
    return resolve(results);
    });
});
};
//
async function sequentialAwaitedQueryProcessing () {
//
try {
//
// Query the "roles" table to obtain a list of current roles.
//
let roleChoices = (await queryPromiseRoleChoicesData());
//console.log(roleChoices);
//
// Query the "employees" table to obtain a list of current managers.
//
let managerChoices = (await queryPromiseManagerChoicesData());
//console.log(managerChoices);
//
// Create a detail array and process for the prompt and data-gathering questions that are to be 
// asked for the Employee Add sub-menu process of the application by using the Inquirer system.
//
const theEmployeeAddSubMenuInformationQuestions = 
[
{
name: "first_name", 
type: "input", 
message: "What is the employee's first name?" 
}, 
{
name: "last_name", 
type: "input", 
message: "What is the employee's last name?" 
}, 
{
name: "role", 
type: "list", 
message: "What is the employee's job role/title?", 
choices: roleChoices  // database-generated list
}, 
{
name: "manager", 
type: "list", 
message: "Who is the employee's manager?", 
choices: managerChoices  // database-generated list
}
];
//
// Issue a call to the prompt function of the Inquirer object to get sub-menu information for 
// the Employee Add process of the employee database.
//
theInquirerObject
.prompt(theEmployeeAddSubMenuInformationQuestions)
.then((answer) => {
    //
    // Determine the involved ID of the selected role; automatic per the value column/parameter.
    // Determine the involved ID of the selected manager; automatic per the value column/parameter.
    // Add the new employee record to the employees table.
    let firstName = answer.first_name;
    let lastName = answer.last_name;
    let roleID = answer.role;
    let managerID = answer.manager;
    //
    //console.log("ADDED EMPLOYEE: " + firstName + " " + lastName + "; " + answer.role + "; " 
    //+ answer.manager);
    let insertNewRecord = queryPromiseInsertDataProcessing(firstName, lastName, roleID, managerID);
    //console.log("AFTER INSERT");
})
//
.catch((error) => {
    if (error.isTtyError) {
    // Prompt could not be rendered in the current environment.
    }
    else {
    // A problem occurred with the utility-function processing of the prompt answer data.
    console.log(error);
    //"ERROR: A problem occurred with the processing of the prompt answer data.");
    };
});
//
} catch(error) {  // for the try-block
console.log(error)
}
//
}
//
sequentialAwaitedQueryProcessing();
//
}


//
// Create a function that will process the "Update Employee Role" menu option.
//
function doProcessMenuOptionUpdateEmployeeRole() {
//
//console.log("The 'Update Employee Role' menu option was selected.");
//
// WHEN I choose to update an employee role...
// THEN I am prompted to select an employee to update and their new role and this information is 
// updated in the database.
//
// Create functions that will get/process the information that is necessary for the Employee 
// Update Role sub-menu process.
//
queryPromiseEmployeeChoicesData = () => {
return new Promise((resolve, reject) => {
    //
    // Query the "employees" table to obtain a list of current employees.
    //
    theDatabaseConnection.query(
    `SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name 
    FROM employees;`, 
    (error, results) => {
    if (error) {
        return reject(error);
    }
    return resolve(results);
    });
});
};
//
queryPromiseRoleChoicesData = () => {
return new Promise((resolve, reject) => {
    //
    // Query the "roles" table to obtain a list of current roles.
    //
    theDatabaseConnection.query(
    `SELECT id AS value, title AS name 
    FROM roles;`, 
    (error, results) => {
    if (error) {
        return reject(error);
    }
    //
    return resolve(results);
    });
});
};
//
queryPromiseUpdateDataProcessing = (employee_id_data, role_id_data) => {
return new Promise((resolve, reject) => {
    //
    // Update the selected employee record in the employees table. Then re-display the main menu.
    //
    theDatabaseConnection.query(
    `UPDATE employees 
    SET role_id = ${role_id_data}
    WHERE id = ${employee_id_data};`, 
    (error, results) => {
    if (error) {
        return reject(error);
    }
    console.log("UPDATED EMPLOYEE RECORD: employee ID: " + employee_id_data + "; role ID: " + 
        role_id_data);
    //
    // Re-Display the main menu.
    //
    doGetMainMenuInformationEntryActions();
    return resolve(results);
    });
});
};
//
async function sequentialAwaitedQueryProcessing () {
//
try {
//
// Query the "employees" table to obtain a list of current employees.
//
let employeeChoices = (await queryPromiseEmployeeChoicesData());
//console.log(employeeChoices);
//
// Query the "roles" table to obtain a list of current roles.
//
let roleChoices = (await queryPromiseRoleChoicesData());
//console.log(roleChoices);
//
// Create a detail array and process for the prompt and data-gathering questions that are to be 
// asked for the Employee Update Role sub-menu process of the application by using the Inquirer system.
//
const theEmployeeUpdateRoleSubMenuInformationQuestions = 
[
{
name: "name", 
type: "list", 
message: "What is the employee's name?" , 
choices: employeeChoices  // database-generated list
}, 
{
name: "role", 
type: "list", 
message: "What is the employee's updated job role/title?", 
choices: roleChoices  // database-generated list
}
];
//
// Issue a call to the prompt function of the Inquirer object to get sub-menu information for 
// the Employee Update Role process of the employee database.
//
theInquirerObject
.prompt(theEmployeeUpdateRoleSubMenuInformationQuestions)
.then((answer) => {
    //
    // Determine the involved ID of the selected employee; automatic per the value column/parameter.
    // Determine the involved ID of the selected role; automatic per the value column/parameter.
    // Update the selected employee record in the employees table.
    let employeeID = answer.name;
    let roleID = answer.role;
    //
    //console.log("UPDATED EMPLOYEE: employee ID: " + employeeID + "; role ID: " + roleID);
    let updateRecord = queryPromiseUpdateDataProcessing(employeeID, roleID);
    //console.log("AFTER UPDATE");
})
//
.catch((error) => {
    if (error.isTtyError) {
    // Prompt could not be rendered in the current environment.
    }
    else {
    // A problem occurred with the utility-function processing of the prompt answer data.
    console.log(error);
    //"ERROR: A problem occurred with the processing of the prompt answer data.");
    };
});
//
} catch(error) {  // for the try-block
console.log(error)
}
//
}
//
sequentialAwaitedQueryProcessing();
//
}


//
// Create a function that will process the "View All Roles" menu option.
//
function doProcessMenuOptionViewAllRoles() {
//
//console.log("The 'View All Roles' menu option was selected.");
//
// WHEN I choose to view all roles...
// THEN I am presented with the job title, role ID, the department that role belongs to, and the 
// salary for that role.
//
theDatabaseConnection.query(
//`SELECT title, id, department_id, salary FROM roles;`, 
`SELECT roles.title, roles.id, departments.name AS department_name, roles.salary 
FROM roles 
JOIN departments ON roles.department_id = departments.id;`, 
function(err, results) {
//console.log(results);
console.log("");
console.log("");
console.table(results);
doGetMainMenuInformationEntryActions();
});
}


//
// Create a function that will process the "Add Role" menu option.
// 
function doProcessMenuOptionAddRole() {
//
//console.log("The 'Add Role' menu option was selected.");
//
// WHEN I choose to add a role...
// THEN I am prompted to enter the name, salary, and department for the role and that role is 
// added to the database.
//
// Create functions that will get/process the information that is necessary for the Role Add  
// sub-menu process.
//
queryPromiseDepartmentChoicesData = () => {
return new Promise((resolve, reject) => {
    //
    // Query the "departments" table to obtain a list of current departments.
    //
    theDatabaseConnection.query(
        `SELECT id AS value, name 
        FROM departments;`, 
        (error, results) => {
        if (error) {
        return reject(error);
        }
        return resolve(results);
    });
});
};
//
queryPromiseInsertDataProcessing = (title_data, salary_data, department_id_data) => {
return new Promise((resolve, reject) => {
    //
    // Add the selected role record to the roles table. Then re-display the main menu.
    //
    theDatabaseConnection.query(
    `INSERT INTO roles (title, salary, department_id) 
    VALUES ("${title_data}", ${salary_data}, ${department_id_data});`, 
    (error, results) => {
    if (error) {
        return reject(error);
    }
    console.log("ADDED ROLE RECORD: " + title_data + "; salary: " + salary_data + 
        "; department ID: " + department_id_data);
    //
    // Re-Display the main menu.
    //
    doGetMainMenuInformationEntryActions();
    return resolve(results);
    });
});
};
//
async function sequentialAwaitedQueryProcessing () {
//
try {
//
// Query the "departments" table to obtain a list of current departments.
//
let departmentChoices = (await queryPromiseDepartmentChoicesData());
//console.log(departmentChoices);
//
// Create a detail array and process for the prompt and data-gathering questions that are to be 
// asked for the Role Add sub-menu process of the application by using the Inquirer system.
//
const theRoleAddSubMenuInformationQuestions = 
[
// What is the department of the role?
{
name: "name", 
type: "input", 
message: "What is the name of the new role?"
}, 
{
name: "salary", 
type: "input", 
message: "What is the salary of the new role?"
}, 
{
name: "department", 
type: "list", 
message: "What is the department of the new role?", 
choices: departmentChoices  // database-generated list
}
];
//
// Issue a call to the prompt function of the Inquirer object to get sub-menu information for 
// the Role Add process of the employee database.
//
theInquirerObject
.prompt(theRoleAddSubMenuInformationQuestions)
.then((answer) => {
    //
    // Determine the involved ID of the selected department; automatic per the value column/parameter.
    // Add the new role record to the roles table.
    let title = answer.name;
    let salary = answer.salary; 
    let departmentID = answer.department;
    //
    //console.log("ADDED ROLE: " + title + "; salary: " + salary + "; department ID: " + departmentID);
    let insertRecord = queryPromiseInsertDataProcessing(title, salary, departmentID);
    //console.log("AFTER INSERT");
})
//
.catch((error) => {
    if (error.isTtyError) {
    // Prompt could not be rendered in the current environment.
    }
    else {
    // A problem occurred with the utility-function processing of the prompt answer data.
    console.log(error);
    //"ERROR: A problem occurred with the processing of the prompt answer data.");
    };
});
//
} catch(error) {  // for the try-block
console.log(error)
}
//
}
//
sequentialAwaitedQueryProcessing();
//
}


//
// Create a function that will process the "View All Departments" menu option.
//
function doProcessMenuOptionViewAllDepartments() {
//
//console.log("The 'View All Departments' menu option was selected.");
//
// WHEN I choose to view all departments...
// THEN I am presented with a formatted table showing department names and department IDs.
//
theDatabaseConnection.query(
//`SELECT name, id FROM departments`, 
`SELECT name, id 
FROM departments`, 
function(err, results) {
//console.log(results);
console.log("");
console.log("");
console.table(results);
//
// Re-Display the main menu.
//
doGetMainMenuInformationEntryActions();
});
//
}


//
// Create a function that will process the "Add Department" menu option.
//
function doProcessMenuOptionAddDepartment() {
//
//console.log("The 'Add Department' menu option was selected.");
//
// WHEN I choose to add a department...
// THEN I am prompted to enter the name of the department and that department is added to the 
// database.
//
// Create functions that will get/process the information that is necessary for the Department 
// Add sub-menu process.
//
queryPromiseInsertDataProcessing = (name_data) => {
return new Promise((resolve, reject) => {
    //
    // Add the new department record to the departments table. Then re-display the main menu.
    //
    theDatabaseConnection.query(
    `INSERT INTO departments (name) 
    VALUES ("${name_data}");`, 
    (error, results) => {
    if (error) {
        return reject(error);
    }
    console.log("ADDED DEPARTMENT RECORD: " + name_data);
    //
    // Re-Display the main menu.
    //
    doGetMainMenuInformationEntryActions();
    return resolve(results);
    });
});
};
//
async function sequentialAwaitedQueryProcessing () {
//
try {
//
// Create a detail array and process for the prompt and data-gathering questions that are to be 
// asked for the Department Add sub-menu process of the application by using the Inquirer system.
//
const theDepartmentAddSubMenuInformationQuestions = 
[
// What is the department of the role?
{
name: "name", 
type: "input", 
message: "What is the name of the new department?"
}
];
//
// Issue a call to the prompt function of the Inquirer object to get sub-menu information for 
// the Role Add process of the employee database.
//
theInquirerObject
.prompt(theDepartmentAddSubMenuInformationQuestions)
.then((answer) => {
    //
    // Add the new department record to the departments table.
    let name = answer.name;
    //
    //console.log("ADDED DEPARTMENT: " + name);
    let insertRecord = queryPromiseInsertDataProcessing(name);
    //console.log("AFTER INSERT");
})
//
.catch((error) => {
    if (error.isTtyError) {
    // Prompt could not be rendered in the current environment.
    }
    else {
    // A problem occurred with the utility-function processing of the prompt answer data.
    console.log(error);
    //"ERROR: A problem occurred with the processing of the prompt answer data.");
    };
});
//
} catch(error) {  // for the try-block
console.log(error)
}
//
}
//
sequentialAwaitedQueryProcessing();
//
}


//
// Create a function that will process the "Quit" menu option.
//
function doProcessMenuOptionQuit() {
//
//console.log("The 'Quit' menu option was selected.");
//
process.exit();
//
}


