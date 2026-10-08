import { describe, expect, it, vi } from "vitest";
import { sendError, sendSuccess } from "../src/utils/apiResponse.js";

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}

describe("standard API response helpers", () => {
  it("wraps successful data with a message and status", () => {
    const response = createResponse();
    const payload = [{ id: 1 }];

    sendSuccess(response, payload, { status: 201, message: "Created" });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      message: "Created",
      data: payload,
    });
  });

  it("uses standard defaults for a success response", () => {
    const response = createResponse();

    sendSuccess(response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      message: "Request successful",
      data: null,
    });
  });

  it("wraps errors in the same envelope", () => {
    const response = createResponse();

    sendError(response, 403, "Forbidden");

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Forbidden",
      data: null,
    });
  });
});
