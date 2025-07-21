import request from "../../helper/request.js";
import network from "../../config/network.js";

$(document).ready(function () {
  // Helper to get user ID from token (simple base64 decode, not secure, for demo)
  function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.data;
    } catch (e) {
      return null;
    }
  }

  const userId = getUserIdFromToken();
  if (!userId) {
    // Not logged in
    $("#user-profile-container").html(
      "<div class='alert alert-danger'>You must be logged in to view your profile.</div>"
    );
    return;
  }

  // Fetch and display user profile
  function loadUserProfile() {
    const userReq = new request("api/v1", "admin/user");
    userReq.getById(
      userId,
      function (res) {
        if (res.data) {
          const user = res.data[0];
          $("#profile-img").attr(
            "src",
            user.img
              ? `http://${network.ip}:${network.port}/${user.img}`
              : "/frontend/assets/images/main.jpg"
          );
          $("#profile-name").text(user.name);
          $("#profile-email").text(user.email);
          $("#profile-contact span").text(user.contact || "-");
          $("#profile-city span").text(user.city || "-");
          $("#profile-status span").text(
            user.is_active == 1 ? "Active" : "Inactive"
          );
        }
      },
      function (err) {
        $("#user-profile-container").html(
          "<div class='alert alert-danger'>Failed to load profile.</div>"
        );
      }
    );
  }

  loadUserProfile();

  // Open modal and fill form
  $("#edit-profile-btn").on("click", function () {
    const userReq = new request("api/v1", "admin/user");
    userReq.getById(
      userId,
      function (res) {
        if (res.data) {
          const user = res.data[0];
          $("#edit-name").val(user.name);
          $("#edit-email").val(user.email);
          $("#edit-password").val("");
          $("#edit-contact").val(user.contact || "");
          $("#edit-city").val(user.city || "");
          $("#edit-status").val(user.is_active);
        }
        $("#editProfileModal").modal("show");
      },
      function (err) {
        alert("Failed to load profile for editing.");
      }
    );
  });

  // Handle form submit
  $("#edit-profile-form").on("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    // If password is blank, remove it so backend doesn't update
    if (!formData.get("password")) {
      formData.delete("password");
    }
    const userReq = new request("api/v1", "admin/user");
    userReq.update(
      userId,
      formData,
      function (res) {
        $("#editProfileModal").modal("hide");
        loadUserProfile();
        alert("Profile updated successfully!");
      },
      function (err) {
        alert("Failed to update profile.");
      }
    );
  });
});
