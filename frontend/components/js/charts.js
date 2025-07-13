const createChart = (canvas, data, type) => {
  let labels = (data.final).map(label =>label.label);
  let value = (data.final).map(value => value.total);
  $(document).ready(function () {
    const ctx = $(canvas);
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
