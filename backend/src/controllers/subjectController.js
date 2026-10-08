export function createGetSubjectsController(subjects) {
  return function getSubjects(request, response) {
    const { search } = request.query;

    if (search !== undefined && typeof search !== "string") {
      return response.status(400).json({
        success: false,
        message: "Search must be a string",
        errors: [],
      });
    }

    try {
      const term = search?.trim();
      const data = term ? subjects.search(term) : subjects.list();

      return response.status(200).json({
        success: true,
        message: "Subjects retrieved successfully",
        data,
      });
    } catch {
      return response.status(500).json({
        success: false,
        message: "Unable to retrieve subjects",
        errors: [],
      });
    }
  };
}
