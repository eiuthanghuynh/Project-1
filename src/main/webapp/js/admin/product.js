$(document).ready(function () {

    // Mở popup khi nhấn thêm sản phẩm
    $('#btnAddProduct').on('click', function () {
        $('#addProductForm')[0].reset();
        $('#addProductModal').modal('show');
    });

    // Lưu sản phẩm
    $(document).on('submit', '#addProductForm', function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        $.ajax({
            url: '/fastfeast/upload/products',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                alert('Thêm sản phẩm thành công');
                getProducts();
            },
            error: function () {
                alert('Lỗi khi thêm sản phẩm');
            }
        });
    });

});

// Fetch API và hiện danh sách sản phẩm
function getProducts() {
    fetch("/fastfeast/api/products")
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

// Hiện danh sách sản phẩm
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

// Chuyển input price trong popup thành dạng tiền việt
$('#productPrice').on('input', function () {
    this.value = this.value.replace(/\D/g, '');
    $('#price').val(this.value);
});

$('#productPrice').on('blur', function () {
    if (!this.value) return;

    const number = Number(this.value);
    this.value = number.toLocaleString('vi-VN') + ' đ';
});

$('#productPrice').on('focus', function () {
    this.value = this.value.replace(/\D/g, '');
    $('#price').val(this.value);
});

getProducts();