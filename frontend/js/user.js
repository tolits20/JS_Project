import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";


const params = new URLSearchParams(window.location.search);
const id = params.get("id");
function getUser() {
  const getValues = new request("api/v1", `admin/user`);
  getValues.getById(
    id,
    (response) => {
      console.log(response);
      insertValues(response.data[0]);
    },
    (err) => console.error(err)
  );
}

function insertValues(data) {
  const main = $("#user-edit");
  const fullName = main.find("#fullname").val(data.name);
  const email = main.find("#email").val(data.email);
  const role = main.find("#role").val(data.role);
  const city = main.find("#location").val(data.city);
  const contact = main.find("#phone").val(data.contact);
  const status = main.find("#status").val(data.is_active);
  const img = main
    .find("#imgPreview")
    .attr("src", `http://${network.ip}:${network.port}/${data.img}`);
}

if (id) getUser();

$("#userForm")
  .off("submit")
  .on("submit", (e) => {
    e.preventDefault();
    console.log("clicked");
    const formData = new FormData($("#userForm")[0]);
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}=>${pair[1]}`);
    }

    const update = new request("api/v1", "admin/user");
    update.update(id, formData, (response) => {
      console.log(response), (err) => console.log(err);
    });
  });

//index.js
$("#user-table")
  .off("click")
  .on("click", "#btn-destroy", async (e) => {
    e.preventDefault();
    let target = $(e.target);
    let parent = target.closest("tr");
    const id = target.data("id");
    let result = await alert.deleteConfirmation(
      "Yes,delete it!",
      "Successfully deleted the user"
    );
    if (result) {
      const toDelete = new request("api/v1", "admin/user");
      toDelete.delete(
        id,
        (response) => {
          console.log(response);
          parent.fadeOut(2500);
        },
        (err) => console.error(err)
      );
    }
  });
