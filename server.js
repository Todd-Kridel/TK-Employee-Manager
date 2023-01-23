

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
      if(error){
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
        if(error){
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

