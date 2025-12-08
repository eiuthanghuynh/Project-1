function getProducts() {
    fetch("api/products")
        .then(response => {
            if (!response.ok) {
                throw new Error("Lỗi kết nối tới máy chủ");
            }
            return response.json();
        })
        .then(data => {
            renderProductList(data);
        })
        .catch(error => {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        });
}

function renderProductList(products) {
    const tableBody = $('#productTable tbody');
    tableBody.empty();

    products.forEach(product => {
        const row = `
                    <tr>
                        <td>${product.product_id}</td>
                        <td style="font-weight: bold;">${product.product_name}</td>
                        <td>${product.product_description}</td>
                        <td>${formatPrice(product.price)}</td>
                        <td>
                            <img src="${product.image_url}" alt="${product.product_name}" width="100px">
                        </td>
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

function formatPrice(price) {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

getProducts();