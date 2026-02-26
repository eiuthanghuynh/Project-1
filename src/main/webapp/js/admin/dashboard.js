$(document).ready(function () {
    loadKPI();
    loadOrderStatus();
    loadRecentOrders();
    loadTopProducts();
});

function loadKPI() {
    $.ajax({
        url: "/fastfeast/api/dashboard/kpi",
        method: "GET",
        dataType: "json",
        success: function (data) {
            $("#kpiRevenue").text(formatPrice(data.totalRevenue));
            $("#kpiTotalOrders").text(data.totalOrders);
        }
    });
}

function loadOrderStatus() {
    $.ajax({
        url: "/fastfeast/api/dashboard/order-status",
        method: "GET",
        dataType: "json",
        success: function (data) {
            let preparing = 0;
            let inDelivery = 0;
            let cancelled = 0;

            data.forEach(item => {
                switch (item.order_status) {
                    case "Preparing":
                        preparing += item.total;
                        break;
                    case "In Delivery":
                        inDelivery += item.total;
                        break;
                    case "Cancelled":
                        cancelled += item.total;
                        break;
                }
            });

            const processing = preparing + inDelivery;

            $("#kpiProcessing").text(processing);
            $("#kpiCancelled").text(cancelled);
        }
    });
}

function loadRecentOrders() {
    $.ajax({
        url: "/fastfeast/api/dashboard/recent-orders",
        method: "GET",
        dataType: "json",
        success: function (orders) {
            renderRecentOrders(orders);
        },
        error: function () {
            console.error("Không thể tải đơn hàng gần đây");
        }
    });
}

function renderRecentOrders(orders) {
    const statusMap = {
        "Completed": "<span class='badge bg-success'>Hoàn thành</span>",
        "Preparing": "<span class='badge bg-warning text-dark'>Đang chuẩn bị</span>",
        "In Delivery": "<span class='badge bg-info text-dark'>Đang giao</span>",
        "Cancelled": "<span class='badge bg-danger'>Đã hủy</span>"
    };

    const tableBody = $("#recentOrdersTable");
    tableBody.empty();

    orders.forEach(order => {
        const status = statusMap[order.order_status] || order.order_status;
        const row = `
            <tr>
                <td>${order.order_id}</td>
                <td>${order.customer_name || "-"}</td>
                <td>${status}</td>
                <td>${formatDate(order.order_date)}</td>
            </tr>
        `;
        tableBody.append(row);
    });
}

function loadTopProducts() {
    $.ajax({
        url: "/fastfeast/api/dashboard/top-products",
        method: "GET",
        dataType: "json",
        success: function (products) {
            renderTopProducts(products);
        },
        error: function () {
            console.error("Không thể tải sản phẩm bán chạy");
        }
    });
}

function renderTopProducts(products) {
    const tbody = $("#topProductsTable");
    tbody.empty();

    products.forEach(p => {
        const row = `
            <tr>
                <td>${p.product_name}</td>
                <td><strong>${p.total_quantity}</strong></td>
            </tr>
        `;
        tbody.append(row);
    });
}

function formatPrice(price) {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString("vi-VN");
}