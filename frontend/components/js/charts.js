const createChart = (canvas, data, type) => {
  let labels = data.label;
  let value = data.value;
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
            label: ['test1'],
            data: value,
            borderWidth: 1,
          },
            {
            label: ['test1'],
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
