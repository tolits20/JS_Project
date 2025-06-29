function formData(form) {
  const formData = new FormData(form);
  let obj = {};
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}=>${pair[1]}`);
    obj[pair[0]] = pair[1];
  }
  return formData;
}

document.getElementById("loginFormElement").onsubmit = async (e) => {
  e.preventDefault();
  let email = document.getElementById("loginEmail").value.trim();
  let password = document.getElementById("loginPassword").value.trim();

  if (!email || !password)
    return console.error("Please fill up the missing fields");

  const form = $("#loginFormElement")[0];
  const data = { email, password };
  console.log(data);

  $.ajax({
    method: "POST",
    url: "http://192.168.1.11:8080/api/v1/login",
    contentType: "application/json",
    data: JSON.stringify(data),
    processData: false,
    dataType: "json",
    success: (response) => {
      console.log(response);
      localStorage.setItem("token", response.token);
      // location.href = "/admin/dashboard.html";
    },
    error: (err) => console.error(err),
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
    },
    (err) => console.error(err)
  );
};
