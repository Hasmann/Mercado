const currentUrl = window.location.href;
const currentUrlSplit = currentUrl.split("/");
const statYear = document.querySelector(".statYear");
console.log(currentUrlSplit);
const urlOne = currentUrlSplit[6];
const urlTwo = currentUrlSplit[7];
fetch(`http://localhost:2007/Mercado/Merchant/productStats/${urlOne}/${urlTwo}`)
  .then((response) => response.json())
  .then((data) => {
    // Extract the data from the response
    statYear.innerHTML = urlTwo;
    const salesData = data.data.bM.map((item) => {
      return { month: item.month, value: item.value };
    });

    // Sort the data by month
    salesData.sort((a, b) => a.month - b.month);

    // Extract the labels and values for the chart
    const labels = salesData.map((item) => `Month ${item.month}`);
    const values = salesData.map((item) => item.value);

    // Create the chart using Chart.js
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Monthly Orders",
            data: values,
            backgroundColor: "rgb(167, 199, 231)",
            borderColor: "rgb(25,25,112)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  })
  .catch((error) => {
    console.error(error);
  });
