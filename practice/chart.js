document.addEventListener("DOMContentLoaded", () => {
    // fetch 함수를 이용하여 원격 API를 호출합니다.
    // fetch 함수는 첫번째 인자로 URL, 두번째 인자로 옵션 객체를 받고 Promise 타입의 객체를 반환합니다.
    // API 호출에 성공한 경우 response(응답) 객체를 resolve하고, 실패한 경우 error(예외) 객체를 reject합니다.
    fetch("chart.csv")
    // 응답 결과를 text 형태로 파싱합니다.
    .then(response => response.text())
    .then(data => {
        const parsedData = parseCSV(data);
        const labels = parsedData.labels;
        const datasets = parsedData.datasets;

    // 데이터 범위 설정
    // datasets가 배열이므로 flatMap을 이용하여 하나의 배열로 만듭니다.
 const maxValue = Math.max(...datasets.flatMap(dataset => dataset.data))
 const minValue = Math.min(...datasets.flatMap(dataset => dataset.data)) - 30028;

        drawChart(parsedData, labels, maxValue, minValue);
    })
    .catch(error => console.error("Error loading the CSV file: ", error));
});

// CSV를 파싱하는 함수
// 쉼표로 데이터를 구분합니다. 단, 쉼표 뒤에 공백이 있으면 안 됨
function parseCSV(csv) {
    let rows = csv.split("\n").map(row => row.split(","));

    // 연도별 데이터를 표시하기 위해 연도를 추출합니다.
    let labels = rows[0].slice(1).map(label => label.trim());

    let datasets = [];

    // 출생아수에 해당하는 데이터를 넣습니다.
    datasets.push({
        label: rows[1][0].trim(), // "출생아수(명)"
        data: rows[1].slice(1).map(Number), // 연도별 출생아수
        borderColor: "#FFD8D9",
        fill: true,
    });

    // 합계출산율에 해당하는 데이터를 넣습니다.
    datasets.push({
        label: rows[2][0].trim(), // "합계출산율(명)"
        data: rows[2].slice(1).map(Number), // 연도별 합계출산율
        borderColor: "yellowgreen",
        fill: true,
    });

    // 함수 밖에서 데이터를 사용하기 위하여 return 합니다.
    return { labels, datasets };
}

// canvas 설정
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const tooltip = document.getElementById("tooltip");

// 크기 설정
const width = (canvas.width = canvas.offsetWidth);
const height = (canvas.height = canvas.offsetHeight);

// 차트 여백 설정
const padding = 50;
const chartWidth = width - padding * 2;
const chartHeight = height - padding * 2;

// 차트 그리기 (초기화 및 애니메이션 시작)
function drawChart(parsedData, labels, maxValue, minValue) {
    const datasets = parsedData.datasets; // 모든 데이터셋 사용
            const xStep = chartWidth / (labels.length - 1);
            let progress = 0;
            const animationDuration = 2000; // 애니메이션 지속 시간 (밀리초)
            let startTime = performance.now();
            let currentPointIndex = 0;

            // 데이터를 캔버스 좌표로 변환
            function getCanvasCoordinates(datasetIndex, index) {
                const data = datasets[datasetIndex].data;
                const x = padding + xStep * index;
                const y = padding + chartHeight - ((data[index] - minValue) / (maxValue - minValue)) * chartHeight;
                return { x, y };
            }

            // // 라인 그리기 (부드러운 라인 그리기로 대체하여 사용하지 않으므로 주석 처리)
            // function drawLine() {
            //     ctx.beginPath();
            //     ctx.moveTo(getCanvasCoordinates(0).x, getCanvasCoordinates(0).y);
            //     for (let i = 1; i < data.length; i++) {
            //         ctx.lineTo(getCanvasCoordinates(i).x, getCanvasCoordinates(i).y);
            //     }
            //     ctx.strokeStyle = 'rgba(75, 192, 192, 1)';
            //     ctx.lineWidth = 2;
            //     ctx.stroke();
            // }
            
            // 부드러운 라인 그리기(애니메이션)
            function drawSmoothLine(datasetIndex, animatedProgress) {
                // const data = datasets[datasetIndex].data;
                ctx.beginPath();
                ctx.moveTo(getCanvasCoordinates(datasetIndex, 0).x, getCanvasCoordinates(datasetIndex, 0).y);
                for (let i = 1; i <= currentPointIndex; i++) {
                    const previous = getCanvasCoordinates(datasetIndex, i - 1);
                    const current = getCanvasCoordinates(datasetIndex, i);

                    // 마지막 점에 대한 처리입니다.
                    // progressX, progressY는 현재 점과 이전 점의 간격이며 animatedProgress를 곱해 점의 위치를 조정합니다.
                    if (i === currentPointIndex) {
                        const progressX = previous.x + (current.x - previous.x) * animatedProgress;
                        const progressY = previous.y + (current.y - previous.y) * animatedProgress;
                        ctx.lineTo(progressX, progressY);
                    } else {
                        ctx.lineTo(current.x, current.y);
                    }
                }
                ctx.strokeStyle = datasets[datasetIndex].borderColor;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // 애니메이션 루프
            function animateChart(currentTime) {
                const elapsedTime = currentTime - startTime;
                const segmentDuration = animationDuration / (datasets[0].data.length - 1);
                progress = (elapsedTime % segmentDuration) / segmentDuration;

                if (elapsedTime >= segmentDuration * currentPointIndex && currentPointIndex <= datasets[0].data.length - 1) {
                    currentPointIndex++;
                }

                // 캔버스를 지우고 다시 그리기
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawAxes();
                drawLabels();
                drawGridLines();
                datasets.forEach((_, index) => drawSmoothLine(index, progress));

                if (currentPointIndex < datasets[0].data.length - 1 || progress < 1) {
                    requestAnimationFrame(animateChart);
                }
            }

            // x축과 y축 그리기
            function drawAxes() {
                ctx.beginPath();
                ctx.moveTo(padding, padding);
                ctx.lineTo(padding, height - padding);
                ctx.lineTo(width - padding, height - padding);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // 축 라벨 그리기
            function drawLabels() {
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                for (let i = 0; i < labels.length; i++) {
                    const x = padding + xStep * i;
                    const y = height - padding + 20;
                    ctx.fillText(labels[i], x, y);
                }

                // y축 라벨 그리기
                ctx.textAlign = 'right';
                const yStep = (maxValue - minValue) / 5;
                for (let i = 0; i <= 5; i++) {
                    const y = padding + chartHeight - ((yStep * i) / (maxValue - minValue)) * chartHeight;
                    ctx.fillText((minValue + yStep * i).toFixed(0), padding - 10, y + 5);

                    // 가로선 그리기
                    ctx.beginPath();
                    ctx.moveTo(padding, y);
                    ctx.lineTo(width - padding, y);
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // 새로운 함수: 세로선 그리기
            function drawGridLines() {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.lineWidth = 1;
                for (let i = 0; i < labels.length; i++) {
                    const x = padding + xStep * i;
                    ctx.beginPath();
                    ctx.moveTo(x, padding);
                    ctx.lineTo(x, height - padding);
                    ctx.stroke();
                }
}

// // 툴팁 표시 (사용하지 않으므로 주석 처리)
// function showTooltip(event) {
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;
//     for (let i = 0; i < datasets[0].data.length; i++) {
//         const { x, y } = getCanvasCoordinates(0, i);
//         if (Math.abs(mouseX - x) < 10 && Math.abs(mouseY - y) < 10) {
//             tooltip.style.left = `${x}px`;
//             tooltip.style.top = `${y - 30}px`;
//             tooltip.innerHTML = `연도: ${labels[i]}<br>${datasets[0].label}: ${datasets[0].data[i]}<br>${datasets[1].label}: ${datasets[1].data[i]}`;
//             tooltip.style.display = 'block';
//             return;
//         }
//     }
//     tooltip.style.display = 'none';
// }

// 애니메이션
// canvas.addEventListener('mousemove', showTooltip);
startTime = performance.now();
currentPointIndex = 0;
progress = 0;
requestAnimationFrame(animateChart);
};