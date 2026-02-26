window.orderStatusChart = window.orderStatusChart || null;

$(document).ready(function () {
    loadOrderChart("7d");

    $("#chartRangeButtons button").on("click", function () {
        $("#chartRangeButtons button").removeClass("active");
        $(this).addClass("active");

        const range = $(this).data("range");
        loadOrderChart(range);
    });
});

function loadOrderChart(range) {
    $.ajax({
        url: "/fastfeast/api/dashboard/chart/orders",
        method: "GET",
        data: { range: range },
        dataType: "json",
        success: function (data) {
            renderOrderChart(data);
        },
        error: function () {
            console.error("Không thể tải dữ liệu biểu đồ đơn hàng");
        }
    });
}

function renderOrderChart(data) {
    const labels = data.map(item => item.label);
    const values = data.map(item => item.total);

    const ctx = document
        .getElementById("orderStatusChartPlaceholder")
        .getContext("2d");

    if (window.orderStatusChart) {
        window.orderStatusChart.destroy();
        window.orderStatusChart = null;
    }

    window.orderStatusChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Số đơn hàng",
                data: values,
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    mode: "index",
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}