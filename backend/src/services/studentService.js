import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const TOKEN_LIFETIME = "1h";

export class StudentService {
  constructor(studentModel, jwtSecret) {
    if (!jwtSecret || Buffer.byteLength(jwtSecret, "utf8") < 32) {
      throw new Error("JWT_SECRET must contain at least 32 bytes");
    }

    this.studentModel = studentModel;
    this.jwtSecret = jwtSecret;
  }

  async login(username, password) {
    const student = this.studentModel.findByUsername(username);
    const passwordMatches = student
      ? await bcrypt.compare(password, student.password_hash)
      : false;

    if (!passwordMatches) {
      return null;
    }

    const token = jwt.sign(
      { sub: String(student.id), role: student.role },
      this.jwtSecret,
      { algorithm: "HS256", expiresIn: TOKEN_LIFETIME },
    );

    return {
      token,
      student: { id: student.id, username: student.username, role: student.role },
    };
  }

  listStudents() {
    return this.studentModel.list();
  }
}
