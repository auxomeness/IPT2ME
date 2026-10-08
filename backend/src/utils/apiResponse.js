export function sendSuccess(
  response,
  data = null,
  { status = 200, message = "Request successful" } = {},
) {
  return response.status(status).json({
    success: true,
    message,
    data,
  });
}

export function sendError(response, status, message) {
  return response.status(status).json({
    success: false,
    message,
    data: null,
  });
}
