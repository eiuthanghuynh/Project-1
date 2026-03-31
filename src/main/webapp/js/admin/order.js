$(document).ready(function () {
    getOrders();

    let currentOrderId = null;
    $(document).on('click', '.btn-edit-status', function () {
        currentOrderId = $(this).data('id');
        const currentStatus = $(this).data('status');
        $('#editOrderId').val(currentOrderId);
        $('#orderStatus').val(currentStatus);
        $('#editStatusModal').modal('show');
    });

    $(document).on('submit', '#editStatusForm', function (e) {
        e.preventDefault();

        const status = $('#orderStatus').val();
        if (!currentOrderId) return;

        $.ajax({
            url: '/fastfeast/api/orders/update-status',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ order_id: currentOrderId, order_status: status }),
            success: function (res) {
                if (res.success) {
                    showToast('Cập nhật trạng thái thành công', 'success');
                    $('#editStatusModal').modal('hide');
                    getOrders();
                } else {
                    showToast(res.message || 'Cập nhật thất bại', 'error');
                }
            },
            error: function () {
                showToast('Lỗi server', 'error');
            }
        });
    });
});

function getOrders() {
    fetch("api/orders")
        .then(response => {
            if (!response.ok) {
                throw new Error("Lỗi kết nối tới máy chủ");
            }
            return response.json();
        })
        .then(data => {
            renderOrderList(data);
        })
        .catch(error => {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        });
}

function renderOrderList(orders) {
    const statusMap = {
        "Completed": "<span class='badge bg-success'>Hoàn thành</span>",
        "Pending": "<span class='badge bg-warning text-dark'>Đang chờ duyệt</span>",
        "Preparing": "<span class='badge bg-warning text-dark'>Đang chuẩn bị</span>",
        "In Delivery": "<span class='badge bg-info text-dark'>Đang giao</span>",
        "Cancelled": "<span class='badge bg-danger'>Đã hủy</span>"
    };

    const tableBody = $('#orderTable tbody');
    tableBody.empty();

    orders.forEach(order => {
        const status = statusMap[order.order_status] || order.order_status;
        const row = `
                    <tr>
                        <td>${order.order_id}</td>
                        <td>${order.customer_id}</td>
                        <td style="font-weight: bold;">${order.customer_name}</td>
                        <td>${new Date(order.order_date).toLocaleString()}</td>
                        <td>${status}</td>
                        <td>
                            <button class="btn btn-sm btn-success me-1 btn-view-details" title="Xem chi tiết" data-id="${order.order_id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning me-1 btn-edit-status" title="Sửa" data-id="${order.order_id}" data-status="${order.order_status}">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `;

        tableBody.append(row);
    });
}

$(document).on('click', '.btn-view-details', function () {
    const orderId = $(this).data('id');
    $('#detailOrderId').text(orderId);

    fetch(`/fastfeast/api/orders/${orderId}/details`)
        .then(response => {
            if (!response.ok) throw new Error("Lỗi lấy chi tiết");
            return response.json();
        })
        .then(details => {
            renderOrderDetails(details);
            $('#viewDetailsModal').modal('show');
        })
        .catch(error => {
            console.error(error);
            showToast('Không thể tải chi tiết đơn hàng', 'error');
        });
});

function renderOrderDetails(details) {
    const tbody = $('#orderDetailsTable tbody');
    tbody.empty();
    let totalAmount = 0;

    if (!details || details.length === 0) {
        tbody.append('<tr><td colspan="5" class="text-center text-muted">Không có dữ liệu chi tiết cho đơn hàng này.</td></tr>');
        $('#detailTotalAmount').text('0 đ');
        return;
    }

    details.forEach(item => {
        const name = item.combo_name || item.product_name || "Chưa rõ tên";
        const isCombo = item.type === 'combo';
        const typeBadge = isCombo
            ? '<span class="badge bg-warning text-dark"><i class="fas fa-box"></i> Combo</span>'
            : '<span class="badge bg-info text-dark"><i class="fas fa-hamburger"></i> Món lẻ</span>';

        const price = item.price || 0;
        const quantity = item.quantity || 1;
        const lineTotal = price * quantity;

        totalAmount += lineTotal;

        const row = `
            <tr>
                <td>${name}</td>
                <td>${typeBadge}</td>
                <td class="text-center">${quantity}</td>
                <td>${formatPrice(price)}</td>
                <td class="text-danger fw-bold">${formatPrice(lineTotal)}</td>
            </tr>
        `;
        tbody.append(row);
    });

    $('#detailTotalAmount').text(formatPrice(totalAmount));
}

function formatPrice(price) {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// Toast thông báo hành động
function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    let bgClass = 'bg-info';
    let textClass = 'text-white';
    let btnCloseClass = 'btn-close-white';

    switch (type) {
        case 'success':
            bgClass = 'bg-success';
            break;
        case 'error':
            bgClass = 'bg-danger';
            break;
        case 'warning':
            bgClass = 'bg-warning';
            textClass = 'text-dark';
            btnCloseClass = '';
            break;
    }

    const toastId = 'toast-' + Date.now() + Math.floor(Math.random() * 1000);
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center ${textClass} ${bgClass} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close ${btnCloseClass} me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', toastHTML);

    const toastElement = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastElement, { delay: 3000 });

    bsToast.show();
    toastElement.addEventListener('hidden.bs.toast', function () {
        toastElement.remove();
    });
}