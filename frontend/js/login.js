import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";

document.getElementById("loginFormElement").onsubmit = async (e) => {
  e.preventDefault();
  let email = document.getElementById("loginEmail").value.trim();
  let password = document.getElementById("loginPassword").value.trim();

  // Prevent multiple submissions
  if (e.target.dataset.submitting === "true") {
    return;
  }
  e.target.dataset.submitting = "true";

  if (!email || !password)
    return console.error("Please fill up the missing fields");

  // Show loading state
  const loginBtn = document.querySelector('button[type="submit"]');
  const originalText = loginBtn.textContent;
  loginBtn.textContent = "Logging in...";
  loginBtn.disabled = true;

  const data = { email, password };
  console.log(data);

  $.ajax({
    method: "POST",
    url: `http://${network.ip}:${network.port}/api/v1/login`,
    contentType: "application/json",
    data: JSON.stringify(data),
    processData: false,
    dataType: "json",
    timeout: 30000, // 30 second timeout
    success: (response) => {
      console.log("Login successful:", response);
      localStorage.setItem("token", response.token);
      sessionStorage.setItem("message", "loginSuccess");
      localStorage.setItem("role", response.role);

      // Debug the redirect URLs
      const adminUrl = `http://${network.client.host}/frontend/admin/dashboard.html`;
      const userUrl = `http://${network.client.host}/frontend/user/home_page.html`;

      console.log("Network config:", network);
      console.log("Admin redirect URL:", adminUrl);
      console.log("User redirect URL:", userUrl);

      if (response.role === "admin") {
        console.log("Redirecting to admin dashboard...");
        window.location.href = adminUrl;
      } else {
        console.log("Redirecting to user home...");
        window.location.href = userUrl;
      }
    },
    error: (err) => {
      console.error("Login error:", err);

      // Reset button state
      loginBtn.textContent = originalText;
      loginBtn.disabled = false;

      if (err.statusText === "timeout") {
        alert(
          "Connection timeout. Please check your internet connection and try again."
        );
      } else {
        alert("Login failed. Please try again.");
      }
    },
    complete: () => {
      // Reset button state on completion
      loginBtn.textContent = originalText;
      loginBtn.disabled = false;
      e.target.dataset.submitting = "false";
    },
  });
};

document.getElementById("registerFormElement").onsubmit = async (e) => {
  e.preventDefault();
  let name = document.getElementById("registerName").value.trim();
  let email = document.getElementById("registerEmail").value.trim();
  let password = document.getElementById("registerPassword").value.trim();
  let confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (password !== confirmPassword)
    return console.error("password doesnt match");
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
};
