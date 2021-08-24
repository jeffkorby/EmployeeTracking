INSERT INTO department (id, department_name)
VALUES (1, "Sales"),
       (2, "Engineering"),
       (3, "Finance"),
       (4, "Legal");
       

INSERT INTO roles (id, title, salary, department_id)
VALUE (1, "Sales Lead", 100000, 1),
      (2, "Salesperson", 80000, 1),
      (3, "Lead Engineer", 150000, 2),
      (4, "Software Engineer", 120000, 2),
      (5, "Account Manager", 160000, 3),
      (6, "Accountant", 125000, 3),
      (7, "Legal Team", 250000, 4),
      (8, "Salesperson", 190000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUE 
(1, Shallan, Davar, 1, NULL)

(7, Bilbo, Baggins, 4, NULL)    