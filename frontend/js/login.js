function formData(form) {
  const formData = new FormData(form);
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}=>${pair[1]}`);
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
  const data = await formData(form);
};

document.getElementById("registerFormElement").onsubmit = async (e) => {
  e.preventDefault();
  let name = document.getElementById("registerName").value.trim();
  let email = document.getElementById("registerEmail").value.trim();
  let password = document.getElementById("registerPassword").value.trim();
  let confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (password !== confirmPassword)
    return console.error("password doesnt match");
  const payload ={name,email,password}
  const form = $("#registerFormElement")[0];
  const data = await formData(form);

  const user = new request("api/v1", "register");
  user.create(
    payload,
    (response) => {
      console.log(response);
      // location.href = "/admin/dashboard.html";
    },
    (err) => console.error(err)
  );
};
