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
        "Completed": "Hoàn thành",
        "In Delivery": "Đang giao hàng",
        "Preparing": "Đang chuẩn bị",
        "Cancelled": "Đã hủy"
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
                            <button class="btn btn-sm btn-warning me-1 btn-edit-status" title="Sửa" data-id="${order.order_id}">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `;

        tableBody.append(row);
    });
}

// Toast thông báo hành động
function showToast(message, type = 'success') {
    const toastEl = document.getElementById('appToast');
    const toastBody = document.getElementById('toastMessage');

    toastBody.textContent = message;

    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');

    switch (type) {
        case 'success':
            toastEl.classList.add('bg-success');
            break;
        case 'error':
            toastEl.classList.add('bg-danger');
            break;
        case 'warning':
            toastEl.classList.add('bg-warning');
            break;
        default:
            toastEl.classList.add('bg-info');
    }

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}