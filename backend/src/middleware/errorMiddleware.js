import { sendError } from "../utils/apiResponse.js";

export function notFoundHandler(_request, response) {
  return sendError(response, 404, "Route not found");
}

export function errorHandler(error, _request, response, _next) {
  const candidateStatus = Number(error?.status ?? error?.statusCode);
  const status =
    Number.isInteger(candidateStatus) && candidateStatus >= 400 && candidateStatus <= 599
      ? candidateStatus
      : 500;

  const message =
    status >= 500
      ? "Internal server error"
      : error?.type === "entity.parse.failed"
        ? "Invalid JSON request body"
        : error?.message || "Request failed";

  return sendError(response, status, message);
}
