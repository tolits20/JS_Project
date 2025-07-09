import config from "../../config/network.js";
const token = localStorage.getItem("token");
export const network = {
  ip: config.ip,
  port: config.port,
};

export const dataTable = (url, table) => {
  let btnUrl = `http://${config.client.host}/frontend/admin/${table}/edit.html`;
  console.log(url);

  let option = {
    user: [
      { data: "name", className: "fw-bold text-capitalize" },
      { data: "email", className: "fw-bold text-capitalize" },
      {
        data: null,
        className: "fw-bold text-capitalize",
        render: (data, type, row) => {
          return `
    <label class="toggle-switch">
      <input type="checkbox" class="user-status" data-id="${data.user_id}" ${
            data.is_active == 1 ? "checked" : ""
          } value="${data.is_active == 1 ? 0 : 1}">
      <span class="slider"></span>
    </label>
  `;
        },
      },
    ],
    item: [
      { data: "item_name", className: "fw-bold text-capitalize" },
      { data: "category_name", className: "fw-bold text-capitalize" },
      { data: "qty", className: "fw-bold text-capitalize" },
      {
        data: null,
        className: "fw-bold text-capitalize",
        render: (data, type, row) => {
          return "₱ " + parseFloat(data.item_price).toFixed(2);
        },
      },
    ],
    orders: [
      {
        data: null,
        className: "fw-bold text-capitalize",
        render: (data, type, row) => {
          return `#${data.order_id}`;
        },
      },
      { data: "name", className: "fw-bold text-capitalize" },
      {
        data: null,
        render: (data, type, row) => {
          return `<select name='status' class='order-status'>
            <option value='pending'>Pending</option>
            <option value='shipped'>Shipped</option>
            <option value='delivered'>Delivered</option>
            <option value='cancelled'>Cancelled</option>
            <option value='refund'>Refund</option>
          </select>`;
        },
      },
      { data: null, className: "fw-bold text-capitalize" ,
        render:(data)=>{
          return `₱ ${data.total.toFixed(2)}`
        }
      },
      {
        data: null,
        className: "fw-bold text-capitalize",
        render: (data, type, row) => {
          return `${new Date(data.order_placed).toLocaleString()}`;
        },
      },
    ],
  };

  // let columns = table === "user" ? [...option.user] : [...option.item];
  let columns = new Array();
  switch (table) {
    case "user":
      columns = [...option.user];
      break;
    case "item":
      columns = [...option.item];
      break;
    case "order":
      columns = [...option.orders];
      break;
  }

  if (table != "order") {
    columns.push({
      data: null,
      className: "text-end",
      render: function (data, type, row) {
        let id = table === "user" ? data.user_id : data.item_id;
        return `
            <a data-id="${id}" href="${btnUrl}?id=${id}" class="btnEdit btn btn-sm  me-2">
              <i class="fa fa-edit"></i> Edit
            </a>
            <button data-id="${id}" id='btn-destroy' class="btnDestroy btn btn-sm">
              <i class="fa fa-trash"></i> Delete
            </button>`;
      },
    });
  }

  console.log(columns);
  console.log("initializing table...");
  $(`#${table}`).DataTable({
    ajax: {
      url: url,
      dataSrc: "data",
      headers: {
        Authorization: "Bearer " + token,
      },
    },
    paging: false,
    scrollY: 400,
    dom: "Bfrtip",
    buttons: [
      {
        extend: "pdf",
        className: "btn btn-dark",
      },
      {
        extend: "excel",
        className: "btn btn-dark",
      },
    ],
    columns,
    createdRow: function (row, data, dataIndex) {
      $(row).addClass("align-middle");
    },
  });
};
