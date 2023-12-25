// ApiResponse is a class utility function to standardize api response messages and status codes and data .

class ApiResponse {
  constructor(statusCode, message = "Success", success, data) {
    this.success = statusCode < 400;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export default ApiResponse;
