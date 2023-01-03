import { Employee } from "./employee.interface";

export interface IEmployeeOrgApp {
  ceo: Employee;
  /* move method to move an employee to a new supervisor */
  move(employeeID: number, supervisorID: number): void;
  /** Undo last move action */
  undo(): void;
  /** Redo last undone action */
  redo(): void;
}
