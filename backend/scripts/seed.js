import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { createDatabase, openGradeDatabase } from "../src/db/connection.js";
import { createGradeModel } from "../src/models/gradeModel.js";
import { StudentModel } from "../src/models/studentModel.js";

const backendDirectory = fileURLToPath(new URL("..", import.meta.url));
dotenv.config({ path: path.join(backendDirectory, ".env") });

const databasePath = process.env.DATABASE_PATH
  ? path.resolve(backendDirectory, process.env.DATABASE_PATH)
  : path.join(backendDirectory, "data", "grades.db");

const demoAccounts = [
  {
    username: "demo.student",
    password: "StudentDemo2026!",
    role: "student",
  },
  {
    username: "demo.instructor",
    password: "InstructorDemo2026!",
    role: "instructor",
  },
  {
    username: "demo.admin",
    password: "AdminDemo2026!",
    role: "admin",
  },
];
const demoSubject = {
  name: "Introduction to Programming",
  instructor: "Demo Instructor",
  section: "BSIT-2A",
};
const demoGrade = 92;

const database = createDatabase(databasePath);
let gradeDatabase;

try {
  const students = new StudentModel(database);
  const seededAccounts = [];
  for (const account of demoAccounts) {
    let student = students.findByUsername(account.username);

    if (!student) {
      student = await students.create(
        account.username,
        account.password,
        account.role,
      );
    } else if (
      !(await bcrypt.compare(account.password, student.password_hash)) ||
      student.role !== account.role
    ) {
      const passwordHash = await bcrypt.hash(account.password, 12);
      database
        .prepare("UPDATE students SET password_hash = ?, role = ? WHERE id = ?")
        .run(passwordHash, account.role, student.id);
      student = students.findByUsername(account.username);
    }

    seededAccounts.push(student);
  }
  const demoStudent = seededAccounts.find((student) => student.role === "student");

  let subject = database
    .prepare(
      `SELECT id FROM subjects
       WHERE name = ? AND instructor = ? AND section = ?`,
    )
    .get(demoSubject.name, demoSubject.instructor, demoSubject.section);

  if (!subject) {
    const result = database
      .prepare(
        "INSERT INTO subjects (name, instructor, section) VALUES (?, ?, ?)",
      )
      .run(demoSubject.name, demoSubject.instructor, demoSubject.section);
    subject = { id: Number(result.lastInsertRowid) };
  }

  gradeDatabase = await openGradeDatabase(databasePath);
  const grades = createGradeModel(gradeDatabase);
  await grades.initialize();

  const existingGrades = await grades.findByStudentId(demoStudent.id);
  const gradeExists = existingGrades.some(
    (grade) => grade.subject_id === subject.id,
  );
  if (!gradeExists) {
    await grades.create({
      student_id: demoStudent.id,
      subject_id: subject.id,
      grade: demoGrade,
    });
  }

  console.log("Local demo data is ready.");
  for (const account of demoAccounts) {
    console.log(`${account.role}: ${account.username} / ${account.password}`);
  }
} finally {
  if (gradeDatabase) {
    await new Promise((resolve, reject) => {
      gradeDatabase.close((error) => (error ? reject(error) : resolve()));
    });
  }
  database.close();
}
