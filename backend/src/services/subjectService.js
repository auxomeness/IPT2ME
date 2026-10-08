import { Subject } from "../models/Subject.js";

export function getSubjects() {
  return Subject.findAll();
}
