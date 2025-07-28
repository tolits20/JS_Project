import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";
import createChart from "../components/js/charts.js";
import { roleCheck, errorStatus } from "../utils/redirection.js";
import sidebarLinks from "./sidebar-links.js";
import listGenerator from "../utils/listGenerator.js";

roleCheck();

$(document).ready(function () {
  let alertMessage = sessionStorage.getItem("message");
  if (alertMessage === "loginSuccess") {
    alert.notyf.success("Successfully Login!");
    sessionStorage.removeItem("message");
  }

  sidebarLinks()

  const chart1 = new request("api/v1", "admin/chart");
  chart1.getById(
    "ordersPerMonth",
    (response) => {
      console.log(response);
      createChart("#chart1", response, "bar");
    },
    (err) => {
      console.log(err);
      errorStatus(err.status);
      alert.notyf.error("failed to get the monthly sales data.");
    }
  );

  const chart2 = new request("api/v1", "admin/chart");
  chart2.getById(
    "salesPerCategory",
    (response) => {
      console.log(response);
      createChart("#chart2", response, "pie");
    },
    (err) => {
      console.log(err);
      errorStatus(err.status);
      alert.notyf.error("failed to get the monthly sales data.");
    }
  );

  const chart3 = new request("api/v1", "admin/chart");
  chart3.getById(
    "monthlySales",
    (response) => {
      console.log(response);
      createChart("#chart3", response, "bar");
    },
    (err) => {
      console.log(err);
      errorStatus(err.status);
      alert.notyf.error("failed to get the monthly sales data.");
    }
  );

  const userCount = new request("api/v1", "userCount");
  userCount.getAll(
    (response) => {
      console.log(response);
      $("#user-count").text(response[0].total);
    },
    (err) => {
      console.log(err);
    }
  );

  const itemCount = new request("api/v1", "itemCount");
  itemCount.getAll(
    (response) => {
      console.log(response);
      $("#item-count").text(response[0].total);
    },
    (err) => {
      console.log(err);
    }
  );

  const transactionCount = new request("api/v1", "transactionCount");
  transactionCount.getAll(
    (response) => {
      console.log(response);
      $("#transaction-count").text(response[0].total);
    },
    (err) => {
      console.log(err);
    }
  );

  const recentlyDeleted = new request("api/v1", "recentlyDeleted");
  recentlyDeleted.getAll(
    (response) => {
      console.log(response);
      $("#recently-deleted").text(response[0].total);
    },
    (err) => {
      console.log(err);
    }
  );

  const userRank = new request("api/v1", "userRanking");
  userRank.getAll(
    (response) => {
      listGenerator(response, "#user-rank");
    },
    (err) => {
      console.log(err);
    }
  );

  const recentLogs = new request("api/v1", "recentLogs");
  recentLogs.getAll(
    (response) => {
      listGenerator(response, "#latest-activity");
    },
    (err) => {
      console.log(err);
    }
  );
});
