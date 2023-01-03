import EmployeeOrgApp from "./employee";
import { ceo } from "./data";

const employeeOrgApp = new EmployeeOrgApp(ceo);

employeeOrgApp.move(5, 13);

employeeOrgApp.move(9, 5);

employeeOrgApp.undo();

employeeOrgApp.undo();

employeeOrgApp.redo();

employeeOrgApp.redo();

console.log(employeeOrgApp);
