// CSV 파일 경로
const path = "/practice/chart.csv";

// CSV 데이터 파싱
Papa.parse(path, {
    download: true,
    header: true,
    complete: function(results){
        const years = ['2019', '2020', '2021', '2022', '2023'];

        const birthData = years.map(year => results.data[0][year]);
        const fertilityData = years.map(year => results.data[1][year]);

        const ctx = document.getElementById("chart").getContext("2d");

        // Chart.defaults.borderColor = "#712";
        const myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: years,
                datasets: [
                    {
                        label: "출생아수",
                        data: birthData.map(Number),
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1
                    },
                    {
                        label: '합계출산율',
                        data: fertilityData.map(Number),
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    },
                ]
            },
            options: {
                scales: {
                    x: {
                         // beginAtZero의 값이 true인 경우 데이터가 0 밑의 값으로 내려가지 않습니다.
                        beginAtZero: true,
                        grid: {
                            // index가 0(축)인 값만 색깔을 넣습니다. (차트 안의 선들을 제거합니다.)
                            color: (ctx) => (ctx.index === 0 ? "#712" : "transparent"),
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: function (context) {
                                if (context.tick.value === 0) {
                                    return "#712";
                                }
                                return "transparent";
                            }
                        }
                    }
                }
            }
        });
        console.log(results);
        console.log(myChart);
    }
});