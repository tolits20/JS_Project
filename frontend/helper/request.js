import network from "../config/network.js";
const token = localStorage.getItem("token");
const request = class {
  constructor(baseURL, resource) {
    this.baseURL = baseURL;
    this.token = token;
    this.resource = resource;
    this.ipHost = `http://${network.ip}:${network.port}`;
  }

  __getHeaders() {
    return {
      "Cache-Control": "no-cache",
      Authorization: "Bearer " + this.token,
    };
  }

  __config(data) {
    const isFormData = data instanceof FormData;
    return {
      contentType: isFormData ? false : "application/json",
      processData: false,
      data: isFormData ? data : JSON.stringify(data),
    };
  }

  getAll(success, error) {
    $.ajax({
      method: "GET",
      url: `${this.ipHost}/${this.baseURL}/${this.resource}`,
      dataType: "json",
      success: success,
      error: error,
    });
  }

  getById(id, success, error) {
    $.ajax({
      method: "GET",
      url: `${this.ipHost}/${this.baseURL}/${this.resource}/${id}`,
      dataType: "json",
      success: success,
      error: error,
    });
  }

  create(data, success, error) {
    $.ajax({
      method: "POST",
      url: `${this.ipHost}/${this.baseURL}/${this.resource}`,
      ...this.__config(data),
      dataType: "json",
      success: success,
      error: error,
    });
  }

  update(id, data, success, error) {
    $.ajax({
      method: "POST",
      url: `${this.ipHost}/${this.baseURL}/${this.resource}/${id}`,
      ...this.__config(data),
      headers: this.__getHeaders(),
      dataType: "json",
      success: success,
      error: error,
    });
  }

  delete(id, success, error) {
    $.ajax({
      method: "DELETE",
      url: `${this.ipHost}/${this.baseURL}/${this.resource}/${id}`,
      ...this.__config(),
      headers: this.__getHeaders(),
      dataType: "json",
      success: success,
      error: error,
    });
  }
};

export default request;
