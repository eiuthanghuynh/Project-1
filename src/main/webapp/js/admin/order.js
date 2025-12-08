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
    const tableBody = $('#orderTable tbody');
    tableBody.empty();

    orders.forEach(order => {
        const row = `
                    <tr>
                        <td>${order.order_id}</td>
                        <td>${order.customer_id}</td>
                        <td style="font-weight: bold;">${order.customer_name}</td>
                        <td>${new Date(order.order_date).toLocaleString()}</td>
                        <td>${order.order_status}</td>
                        <td>
                            <button class="btn btn-sm btn-warning me-1" title="Sửa">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" title="Xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;

        tableBody.append(row);
    });
}

getOrders();