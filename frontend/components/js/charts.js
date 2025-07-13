const createChart = (canvas, data, type) => {
  console.log(data)
  let labels = (data.final).map(label =>label.month);
  let value = (data.final).map(value => value.total);
  $(document).ready(function () {
    console.log(labels);
    console.log(value);
    const ctx = $(canvas);
    console.log(ctx);

    new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
            label: "Monthly Sales",
            data: value,
            borderWidth: 1,
          },
        ],
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          indexAxis: "y",
        },
      },
      error: (error) => {
        console.log(error);
      },
    });
  });
};

export default createChart;
