// canvas 설정
const canvas = document.getElementById("chart");

// 렌더링 할 컨텍스트 타입을 지정합니다.
const ctx = canvas.getContext("2d");

const tooltip = document.getElementById("tooltip");

// 크기 설정
// offsetWidth: border까지 포함된 요소의 너비
// offsetHeight: border까지 포함된 요소의 높이
// canvas.width, canvas.height는 실제 픽셀 크기를 설정하는 속성이므로 canvas의 크기를 HTML 요소의 크기와 일치시킵니다.
const width = (canvas.width = canvas.offsetWidth);
const height = (canvas.height = canvas.offsetHeight);

// 차트 여백 설정
const padding = 50;
const chartWidth = width - padding * 2;
const chartHeight = height - padding * 2;

document.addEventListener("DOMContentLoaded", () => {
    // fetch 함수를 이용하여 원격 API를 호출합니다.
    // fetch 함수는 첫번째 인자로 URL, 두번째 인자로 옵션 객체를 받고 Promise 타입의 객체를 반환합니다.
    // API 호출에 성공한 경우 response(응답) 객체를 resolve하고, 실패한 경우 error(예외) 객체를 reject합니다.
    fetch("chart.csv")
    // 응답 결과를 text 형태로 파싱합니다.
    .then(response => response.text())
    .then(data => {
        const parsedData = parseCSV(data);
        console.log(parsedData);
        const labels = parsedData.labels;
        const datasets = parsedData.datasets;

    // 데이터 범위 설정
    // datasets가 배열이므로 flatMap을 이용하여 하나의 배열로 만듭니다.
 const maxValue = Math.max(...datasets.flatMap(dataset => dataset.data));
 const minValue = Math.min(...datasets.flatMap(dataset => dataset.data));

        drawChart(labels, datasets, maxValue, minValue);
    })
    .catch(error => console.error("Error loading the CSV file: ", error));
});

// CSV를 파싱하는 함수
// 쉼표로 데이터를 구분하여 각 항목에서 공백을 제거합니다.
function parseCSV(csv) {
    let rows = csv.split("\n").map(row => row.split(","));

    // 연도별 데이터를 표시하기 위해 연도를 추출합니다.
    let labels = rows[0].slice(1).map(label => label.trim());

    // 연도에 따른 각 데이터 세트를 저장하는 배열입니다.
    let datasets = [];

    // 출생아수에 해당하는 데이터를 넣습니다. datasets[0]
    datasets.push({
        label: rows[1][0].trim(), 
        data: rows[1].slice(1).map(Number), 
        borderColor: "#4682B4",
        fill: true,
    });

    // 사망자수에 해당하는 데이터를 넣습니다. datasets[1]
    datasets.push({
        label: rows[2][0].trim(), 
        data: rows[2].slice(1).map(Number),
        borderColor: "#32CD32",
        fill: true,
    });

    // 함수 밖에서(label 연도, datasets 데이터 세트) 데이터를 사용하기 위하여 return 합니다.
    return { labels, datasets };
}

// 차트 그리기 (초기화 및 애니메이션 시작)
function drawChart(labels, datasets, maxValue, minValue) {
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

            // 라인 그리기 (부드러운 라인 그리기로 대체하여 사용하지 않으므로 주석 처리)
            // function drawLine(datasetIndex) {
            //     ctx.beginPath();
            //     ctx.moveTo(getCanvasCoordinates(datasetIndex, 0).x, getCanvasCoordinates(datasetIndex, 0).y);
            //     for (let i = 1; i < labels.length; i++) {
            //         const { x, y } = getCanvasCoordinates(datasetIndex, i);
            //         ctx.lineTo(x, y);
            //     }
            //     ctx.strokeStyle = datasets[datasetIndex].borderColor;
            //     ctx.lineWidth = 2;
            //     ctx.stroke();
            // }
            
            // 부드러운 라인 그리기 (애니메이션 효과로 사용하지 않으므로 주석 처리)
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

            // 애니메이션 루프 (사용하지 않으므로 주석 처리)
            function animateChart(currentTime) {
                const elapsedTime = currentTime - startTime;
                const segmentDuration = animationDuration / (labels.length - 1);
                progress = (elapsedTime % segmentDuration) / segmentDuration;

                if (elapsedTime >= segmentDuration * currentPointIndex && currentPointIndex <= labels.length - 1) {
                    currentPointIndex++;
                }

                // 캔버스를 지우고 다시 그리기
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawAxes();
                drawLabels();
                drawGridLines();
                datasets.forEach((_, index) => drawSmoothLine(index, progress));

                if (currentPointIndex < labels.length - 1 || progress < 1) {
                    requestAnimationFrame(animateChart);
                }
            }

            // x축과 y축 그리기
            function drawAxes() {
                ctx.beginPath();
                ctx.moveTo(padding, padding);
                ctx.lineTo(padding, height - padding);
                ctx.lineTo(width - padding, height - padding);
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // 축 라벨 그리기
            // fillStyle을 먼저 정의하고 fillText를 선언합니다.
            function drawLabels() {
                ctx.textAlign = 'center';
                ctx.font = 'bold 12px Arial';

                ctx.fillStyle = datasets[0].borderColor; // 출생아수 색상
                ctx.fillText(`● 출생아수(명)`, width / 2 - 50, height / 10);
            
                ctx.fillStyle = datasets[1].borderColor; // 합계출산율 색상
                ctx.fillText('● 사망자수(명)', width / 2 + 50, height / 10);

                // x축 라벨(연도) 그리기
                for (let i = 0; i < labels.length; i++) {
                    const x = padding + xStep * i;
                    const y = height - padding + 20;
                    ctx.fillStyle = "#000";
                    ctx.fillText(labels[i], x, y);
                }

                // y축 라벨(데이터 세트) 그리기
                ctx.fillStyle = '#000';
                ctx.textAlign = 'right';
                ctx.font = '8px';
                const yStep = (maxValue - minValue) / labels.length;
                for (let i = 0; i < labels.length; i++) {
                    const y = padding + chartHeight - ((yStep * i) / (maxValue - minValue)) * chartHeight;
                    ctx.fillText((minValue + yStep * i).toFixed(0), padding - 10, y + 5);

                    // 가로선 그리기 (차트의 가독성을 높이기 위하여 가로선을 투명하게 표시하였습니다.)
                    ctx.beginPath();
                    ctx.moveTo(padding, y);
                    ctx.lineTo(width - padding, y);
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
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

// 툴팁 표시
// getBoundingClientRect(): 캔버스 요소의 크기와 위치 정보(좌표 변환에 사용, 여기서는 rect라는 변수로 사용됩니다.)
// mouseX, mouseY: 각각의 마우스 포인터 좌표를 반환 (mouseY 값은 사용중이지 않아서 주석 처리 하였습니다.)
function showTooltip(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    // const mouseY = event.clientY - rect.top;
    
    for (let i = 0; i < labels.length; i++) {
        const { x, y } = getCanvasCoordinates(0, i);
        // 연도 label x축으로 5 미만 떨어져 있는 y축 라벨을 hover하면 해당 연도에 대한 데이터를 툴팁으로 띄웁니다.
        if (Math.abs(mouseX - x) < 5) {
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y - 30}px`;
            tooltip.innerHTML = `연도: ${labels[i]}<br>${datasets[0].label}: ${datasets[0].data[i]}<br>${datasets[1].label}: ${datasets[1].data[i]}`;
            tooltip.style.display = 'block';
            return;
        }
    }
    tooltip.style.display = 'none';
}

// 애니메이션
canvas.addEventListener('mousemove', showTooltip);
startTime = performance.now();
currentPointIndex = 0;
progress = 0;
requestAnimationFrame(animateChart);
};