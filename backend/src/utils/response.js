export const sendResponse = (res, statusCode, success, message, data = null, errors = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

export const responses = {
  success: (res, data, message = "Success") => sendResponse(res, 200, true, message, data),
  created: (res, data, message = "Resource created successfully") => sendResponse(res, 201, true, message, data),
  badRequest: (res, message = "Bad request", errors = null) => sendResponse(res, 400, false, message, null, errors),
  unauthorized: (res, message = "Unauthorized access") => sendResponse(res, 401, false, message),
  forbidden: (res, message = "Forbidden access") => sendResponse(res, 403, false, message),
  notFound: (res, message = "Resource not found") => sendResponse(res, 404, false, message),
  internalServerError: (res, message = "Internal server error") => sendResponse(res, 500, false, message),
};