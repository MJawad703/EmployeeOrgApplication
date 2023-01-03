import { Employee } from "./interfaces/employee.interface";
import { IEmployeeOrgApp } from "./interfaces/employeeorgclass.interface";

class EmployeeOrgApp implements IEmployeeOrgApp {
  private actions: Array<{
    ceo: number;
    employee: number;
    oldSupervisor: number;
    newSupervisor: number;
  }> = [];
  private currentActionIndex = -1;
  private employees: Employee[];

  constructor(public ceo: Employee) {
    this.employees = this.getAllEmployees();
  }

  getAllEmployees(): Employee[] {
    const allEmployees: Employee[] = [];
    const queue = [this.ceo];

    while (queue.length > 0) {
      const employee: any = queue.shift();
      allEmployees.push(employee);
      queue.push(...employee.subordinates);
    }

    return allEmployees;
  }

  getSupervisorIndexById(employeeID: number): number | undefined {
    const queue = [0];
    while (queue.length > 0) {
      const supervisor: any = queue.shift();
      for (const subordinate of this.employees[supervisor].subordinates) {
        if (subordinate.uniqueId === employeeID) {
          return supervisor;
        }
        queue.push(this.employees.indexOf(subordinate));
      }
    }
    return undefined;
  }

  move(employeeID: number, supervisorID: number): void {
    // store the indexes of the relevant Employee objects in the actions array
    const employeeIndex = this.employees.findIndex(
      (e) => e.uniqueId === employeeID
    );
    if (employeeIndex === -1) {
      throw new Error(`Employee with ID ${employeeID} not found`);
    }

    const oldSupervisorIndex: any = this.getSupervisorIndexById(employeeID);
    if (oldSupervisorIndex === -1) {
      throw new Error(
        `Supervisor for employee with ID ${employeeID} not found`
      );
    }

    const newSupervisorIndex = this.employees.findIndex(
      (e) => e.uniqueId === supervisorID
    );
    if (newSupervisorIndex === -1) {
      throw new Error(`Employee with ID ${supervisorID} not found`);
    }

    this.actions.push({
      ceo: 0,
      employee: employeeIndex,
      oldSupervisor: oldSupervisorIndex,
      newSupervisor: newSupervisorIndex,
    });
    this.currentActionIndex++;

    // perform the move operation
    // remove employee from old supervisor's subordinates list
    this.employees[oldSupervisorIndex].subordinates = this.employees[
      oldSupervisorIndex
    ].subordinates.filter(
      (e) => e.uniqueId !== this.employees[employeeIndex].uniqueId
    );

    // add employee's subordinates to old supervisor's subordinates list
    this.employees[oldSupervisorIndex].subordinates.push(
      ...this.employees[employeeIndex].subordinates
    );

    // remove employee's subordinates from employee
    this.employees[employeeIndex].subordinates = [];

    // add employee to new supervisor's subordinates list
    this.employees[newSupervisorIndex].subordinates.push(
      this.employees[employeeIndex]
    );
  }

  undo(): void {
    // check if there are any actions to undo
    if (this.currentActionIndex < 0) {
      throw new Error(`there is no action to be undo`);
      return;
    }

    // get the indexes of the relevant Employee objects
    const { employee, oldSupervisor, newSupervisor } =
      this.actions[this.currentActionIndex];

    // undo the move operation by restoring the previous state of the app object
    // remove employee from new supervisor's subordinates list
    this.employees[newSupervisor].subordinates = this.employees[
      newSupervisor
    ].subordinates.filter(
      (e) => e.uniqueId !== this.employees[employee].uniqueId
    );

    // add employee to old supervisor's subordinates list
    this.employees[oldSupervisor].subordinates.push(this.employees[employee]);

    // add employee's subordinates back to employee
    this.employees[employee].subordinates.push(
      ...this.employees[oldSupervisor].subordinates.splice(
        -this.employees[employee].subordinates.length
      )
    );

    // move back to previous action
    this.currentActionIndex--;
  }

  redo(): void {
    // check if there are any actions to redo
    if (this.currentActionIndex >= this.actions.length - 1) {
      throw new Error(`there is no action to be redo`);
      return;
    }

    // move to the next action
    this.currentActionIndex++;

    // get the indexes of the relevant Employee objects
    const { employee, oldSupervisor, newSupervisor } =
      this.actions[this.currentActionIndex];

    // perform the move operation again
    // remove employee from old supervisor's subordinates list
    this.employees[oldSupervisor].subordinates = this.employees[
      oldSupervisor
    ].subordinates.filter(
      (e) => e.uniqueId !== this.employees[employee].uniqueId
    );

    // add employee's subordinates to old supervisor's subordinates list
    this.employees[oldSupervisor].subordinates.push(
      ...this.employees[employee].subordinates
    );

    // remove employee's subordinates from employee
    this.employees[employee].subordinates = [];

    // add employee to new supervisor's subordinates list
    this.employees[newSupervisor].subordinates.push(this.employees[employee]);
  }

  findSupervisorById(employeeID: number): number | undefined {
    const queue = [0];
    while (queue.length > 0) {
      const supervisor: any = queue.shift();
      for (const subordinate of this.employees[supervisor].subordinates) {
        if (subordinate.uniqueId === employeeID) {
          return supervisor;
        }
        queue.push(this.employees.indexOf(subordinate));
      }
    }
    return undefined;
  }

  findEmployeeById(employeeID: number): number | undefined {
    const queue = [0];
    while (queue.length > 0) {
      const employee: any = queue.shift();
      if (this.employees[employee].uniqueId === employeeID) {
        return employee;
      }
      queue.push(
        ...this.employees[employee].subordinates.map((e) =>
          this.employees.indexOf(e)
        )
      );
    }
    return undefined;
  }
}

export default EmployeeOrgApp;
