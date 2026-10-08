export class StudentService {
  constructor(studentModel) {
    this.studentModel = studentModel;
  }

  listStudents() {
    return this.studentModel.list();
  }
}
