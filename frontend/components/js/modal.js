import request from "../../helper/request.js";

const option = {
  user: {
    html: `
    <input id="swal-input1" class="swal2-input" placeholder="Full Name">
    <input id="swal-input3" class="swal2-input" type="email" placeholder="Email">
    <input id="swal-input4" class="swal2-input" type="password" placeholder="Password">
  `,
    action: () => {
      return {
        firstName: document.getElementById("swal-input1").value,
        email: document.getElementById("swal-input3").value,
        password: document.getElementById("swal-input4").value,
      };
    },
  },
  item: {
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
  },
};

const modal = (table) => {
  Swal.fire({
    title: "User Information",
    html: option[table].html,
    focusConfirm: false,
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      let data = option[table].action();
      console.log(data);
    }
  });
};

export default modal;
