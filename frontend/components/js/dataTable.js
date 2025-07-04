import config from "../../config/network.js";
console.log(config);
export const network = {
  ip: config.ip,
  port: config.port,
};
export const dataTable = (url, table) => {
  console.log(table);
  let btnUrl = `http://${config.ip}:${config.port}/admin/user/index.html`;
  if (table === "user") {
    btnUrl = `http://${config.ip}:${config.port}/admin/user/edit.html`;
  }
  let col =
    table === "user"
      ? ["name", "email"]
      : ["item_name", "category", "item_price"];
  let columns = [];
  for (let x in col) {
    columns.push({
      data: col[x],
      className: "fw-bold text-capitalize",
    });
  }
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
  console.log(columns);

  console.log("initializing table...");
  $(`#${table}`).DataTable({
    ajax: {
      url: url,
      dataSrc: "data",
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
