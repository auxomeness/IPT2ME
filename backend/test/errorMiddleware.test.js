import { describe, expect, it, vi } from "vitest";
import {
  errorHandler,
  notFoundHandler,
} from "../src/middleware/errorMiddleware.js";

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}

describe("HTTP error middleware", () => {
  it("returns a JSON 404 for unknown routes", () => {
    const response = createResponse();

    notFoundHandler({}, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Route not found",
      data: null,
    });
  });

  it("preserves client error status and message", () => {
    const response = createResponse();

    errorHandler({ status: 422, message: "Invalid grade" }, {}, response, vi.fn());

    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid grade",
      data: null,
    });
  });

  it("returns a safe message for malformed JSON", () => {
    const response = createResponse();

    errorHandler(
      { status: 400, type: "entity.parse.failed", message: "parser detail" },
      {},
      response,
      vi.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid JSON request body",
      data: null,
    });
  });

  it("hides internal server error details", () => {
    const response = createResponse();

    errorHandler({ message: "database password leaked" }, {}, response, vi.fn());

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
      data: null,
    });
  });
});
