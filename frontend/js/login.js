import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";
import formValidate from "../utils/validate.js";

$(document).ready(function () {
  document.getElementById("loginFormElement").onsubmit = async (e) => {
    e.preventDefault();
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value.trim();

    if (!email || !password)
      return console.error("Please fill up the missing fields");

    const form = $("#loginFormElement")[0];
    const data = { email, password };
    console.log(data);

    $.ajax({
      method: "POST",
      url: `http://${network.ip}:${network.port}/api/v1/login`,
      contentType: "application/json",
      data: JSON.stringify(data),
      processData: false,
      dataType: "json",
      success: (response) => {
        console.log(response);
        localStorage.setItem("token", response.token);
        sessionStorage.setItem("message", "loginSuccess");
        localStorage.setItem("role", response.role);
        if (response.role === "admin") {
          location.href = `http://${network.client.host}/frontend/admin/dashboard.html`;
        } else {
          location.href = `http://${network.client.host}/frontend/user/home_page.html`;
        }
      },
      error: (err) => {
        console.error(err);
        alert.notyf.error("Invalid credentials");
      },
    });
  };

  $("#registerFormElement")
    .off("submit")
    .on("submit", (e) => {
      e.preventDefault();
      let valid = formValidate("#registerFormElement", "user");
      console.log(valid)
      if (!valid) return;
      let name = document.getElementById("registerName").value.trim();
      let email = document.getElementById("registerEmail").value.trim();
      let password = document.getElementById("registerPassword").value.trim();
      let confirmPassword = document
        .getElementById("confirmPassword")
        .value.trim();

      // if (password !== confirmPassword)
      //   return console.error("password doesnt match");

      const payload = { name, email, password };
      const user = new request("api/v1", "register");
      user.create(
        payload,
        (response) => {
          console.log(response);
          $("#loginForm").addClass("hidden");
          $("#registerForm").addClass("hidden");
          $("#loginForm").removeClass("hidden");
          alert.notyf.success("Successfully Registered");
        },
        (err) => console.error(err)
      );
    });
});
