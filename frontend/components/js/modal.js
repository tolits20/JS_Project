import request from "../../helper/request.js";
import alert from "./alert.js";

const option = {
  user: {
    title:"User Information",
    html: `
    <input id="swal-input1" class="swal2-input" placeholder="Full Name">
    <input id="swal-input3" class="swal2-input" type="email" placeholder="Email">
    <input id="swal-input4" class="swal2-input" type="password" placeholder="Password">
  `,
    action: () => {
      return {
        name: document.getElementById("swal-input1").value,
        email: document.getElementById("swal-input3").value,
        password: document.getElementById("swal-input4").value,
      };
    },
    endpoint: {
      baseURL: "api/v1",
      resourceURL: "register",
    },
  },
  item: {
    title:'Item Information',
    html: `
        <input type="text" id="itemName" class="swal2-input" placeholder="Item Name">
        <input type="number" id="itemPrice" class="swal2-input" placeholder="Price">
        <input type="text" id="itemCategory" class="swal2-input" placeholder="Category">
        <input type="number" id="itemStock" class="swal2-input" placeholder="Stock Quantity">
        <textarea id="itemDesc" class="swal2-textarea" placeholder="Description"></textarea>
      `,
    action: () => {
      return {
        item_name: document.getElementById("itemName").value.trim(),
        item_price: parseFloat(document.getElementById("itemPrice").value),
        category: document.getElementById("itemCategory").value.trim(),
        stock: parseInt(document.getElementById("itemStock").value),
        item_desc: document.getElementById("itemDesc").value.trim(),
      };
    },
    endpoint: {
      baseURL: "api/v1",
      resourceURL: "admin/item",
    },
  },
};

const modal = (table) => {
  Swal.fire({
    title: option[table].title,
    html: option[table].html,
    focusConfirm: false,
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      let data = option[table].action();
      console.log(data);
      const sendRequest = new request(
        option[table].endpoint.baseURL,
        option[table].endpoint.resourceURL
      );
      sendRequest.create(
        data,
        (response) => {
          console.log(response);
          alert.notyf.success(`${table} is successfully added!`);
        },
        (err) => {
          console.log(err);
          alert.notyf.error(`Failed to add the new ${table}!`);
        }
      );
    }
  });
};

export default modal;
