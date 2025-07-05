import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";

let alertMessage = sessionStorage.getItem('message')
if(alertMessage==='loginSuccess'){
  alert.notyf.success("Successfully Login!")
  sessionStorage.removeItem('message')
}