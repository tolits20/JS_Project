import { loadHeaderAndFooter } from "../utils/componentLoader.js";
import network from "../config/network.js";
import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import formValidate from "../utils/validate.js";

const userReq = new request("api/v1", "profile");
let currentUser = {};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString();
}

function loadProfile() {
  userReq.getAll(
    (res) => {
      if (res && res.data) {
        const user = res.data;
        currentUser = user;
        $("#profile-user_id").text(user.user_id || "");
        $("#profile-name").text(user.name || "");
        $("#profile-email").text(user.email || "");
        $("#profile-contact").text(user.contact || "");
        $("#profile-city").text(user.city || "");
        let imgSrc = user.img
          ? `http://${network.ip}:${network.port}/${user.img}`
          : "/assets/images/main.jpg";
        $("#profile-img").attr("src", imgSrc);
        $("#edit-profile-img").attr("src", imgSrc);
        // Prefill modal
        $("#edit-profile-form #name").val(user.name || "");
        $("#edit-profile-form #email").val(user.email || "");
        $("#edit-profile-form #contact").val(user.contact || "");
        $("#edit-profile-form #city").val(user.city || "");
      }
    },
    (err) => {
      alert.notyf.error("Failed to load profile");
    }
  );
}

$(document).ready(() => {
  loadHeaderAndFooter();
  loadProfile();

  // Image preview in modal
  $("#img").on("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#edit-profile-img").attr("src", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle form submit
  $("#edit-profile-form").on("submit", function (e) {
    e.preventDefault();
    // Make password optional for validation
    let validator = $(this).validate();
    if (!$("#password").val()) {
      validator.settings.rules.password = { required: false };
    } else {
      validator.settings.rules.password = {
        required: true,
        rangeLength: [8, 16],
      };
    }
    if (!formValidate("#edit-profile-form", "user")) return;
    const formData = new FormData(this);
    // Remove empty password field
    if (!formData.get("password")) formData.delete("password");
    userReq.update(
      "", // No id needed for current user
      formData,
      (res) => {
        $("#editProfileModal").modal("hide");
        alert.notyf.success("Profile updated!");
        loadProfile();
      },
      (err) => {
        alert.notyf.error("Failed to update profile");
      }
    );
  });
});
