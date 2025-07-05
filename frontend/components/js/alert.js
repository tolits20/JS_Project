import { Notyf } from 'https://esm.sh/notyf@3';
const alert = {
  positionedDialog: (text) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `${text}`,
      showConfirmButton: false,
      timer: 1500,
    });
  },
  deleteConfirmation: (confirmText,text) => {
    return new Promise ((resolve,rejects)=>{
        Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${confirmText}`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: `${text}`,
          icon: "success",
        });
        resolve(true)
      }
       rejects(false)
    });
    })
  },
  notyf: new Notyf({
    duration:2000,
    position:{
      x:'right',
      y:'top'
    }
  })
};

export default alert;
