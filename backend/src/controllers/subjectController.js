import { getSubjects as findSubjects } from "../services/subjectService.js";

export function getSubjects(_request, response) {
  try {
    const subjects = findSubjects();

    return response.status(200).json({
      success: true,
      message: "Subjects retrieved successfully",
      data: subjects,
    });
  } catch {
    return response.status(500).json({
      success: false,
      message: "Unable to retrieve subjects",
      errors: [],
    });
  }
}
