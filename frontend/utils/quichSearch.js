const quichSearch = (dataSet, element) => {
  $(`${element}`).autocomplete({
    source: dataSet,
  });
};

export default  quichSearch