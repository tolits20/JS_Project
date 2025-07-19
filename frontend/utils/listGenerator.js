const list = (data, parent) => {
    console.log(data)
  data.forEach((name) => {
    let element = $("<li>");
    element.text(name)
    element.css({
        padding: '6px 0',
        borderBottom: '1px solid #eee',
        fontSize: '13px',
    })
    $(parent).append(element);
  });
};

export default list