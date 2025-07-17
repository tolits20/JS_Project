const search = (dataSet, element) => {
    console.log(element)
  $(`${element}`).autocomplete({
    source: dataSet,
  });
};

export default  search