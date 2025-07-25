const option = {
  user: {
    rules: {
      email: {
        email: true,
        required: true,
      },
      fullname: {
        required: true,
      },
      password: {
        required: true,
        minlength: 8,
      },
      confirmPassword: {
        equalTo: "#registerPassword",
      },
      phone: {
        number: true,
      },
    },
    messages: {
      email: {
        required: "Please enter your email address.",
        email: "Please enter a valid email address.",
      },
      fullName: {
        required: "Full name is required.",
      },
      password: {
        required: "Please create a password.",
        minlenght: "Password must be minimum of characters.",
      },
      confirmPassword: {
        equalTo: "Passwords do not match.",
      },
      contact: {
        number: "Please enter a valid number.",
        rangeLength: "Contact number must be between 11 and 20 digits.",
      },
    },
  },
  item: {
    rules: {
      item_name: {
        required: true,
      },
      item_price: {
        required: true,
        number: true,
        min: 1,
      },
      stocks: {
        number: true,
        required: true,
        min: 1,
      },
    },
    messages: {
      item_name: {
        required: "Please enter the item name.",
      },
      item_price: {
        required: "Please enter the item price.",
        number: "The price must be a valid number.",
        min: "The price must be at least 1.",
      },
      stocks: {
        required: "Please enter the stock quantity.",
        number: "Stock quantity must be a valid number.",
        min: "Stock quantity must be at least 1.",
      },
    },
  },
  image: {
    item_img: {
      rules: {
        item_image: {
          required: false,
          accept: ".png",
        },
      },
      messages: {
        item_image: {
          accept: "File type must be jpg, jpeg or png type",
        },
      },
    },
    user_img: {
      rules: {
        img: {
          accept: ".png",
        },
      },
      messages: {
        img: {
          accept: "File type must be jpg, jpeg or png type",
        },
      },
    },
  },
};

const formValidate = (form, type, subtype = null) => {
  let valid = false;
  console.log($(form)[0]);
  let selected = subtype ? option[type][subtype] : option[type];
  $(form).validate({
    rules: selected.rules,
    messages: selected.messages,
    errorPlacement: (error, element) => {
      error.addClass("my-error");
      error.insertAfter(element);
    },
  });
  return $(form).valid();
};

export default formValidate;
