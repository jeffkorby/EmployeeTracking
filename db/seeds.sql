INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");
       

INSERT INTO roles (title, salary, department_id)
VALUE ("Sales Lead", 100000, 1),
      ("Salesperson", 80000, 1),
      ("Lead Engineer", 150000, 2),
      ("Software Engineer", 120000, 2),
      ("Account Manager", 160000, 3),
      ("Accountant", 125000, 3),
      ("Legal Team", 250000, 4),
      ("Salesperson", 190000, 4);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUE ("Kaladin", "Stormblessed", 1, NULL),
      ("Shallan", "Davar", 1, 1),
      ("Adolin", "Kholin", 2, NULL),
      ("Navani", "Kholin", 2, 3),
      ("Aragorn", "Elessar", 3, NULL),
      ("Gandalf", "Greyhame", 3, 5),
      ("Bilbo", "Baggins", 4, NULL),
      ("Samwise", "Gamgee", 4, 7);