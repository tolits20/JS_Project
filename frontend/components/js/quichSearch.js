const search = (dataSet, element) => {
  $(`${element}`).autocomplete({
    source: dataSet,
  });
};

export default  search