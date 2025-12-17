$(document).ready(function () {
    getProducts();

    // Mở popup khi nhấn thêm sản phẩm
    $('#btnAddProduct').on('click', function () {
        $('#addProductForm')[0].reset();
        $('#productId').val('');
        $('#addProductModal').modal('show');
    });

    // Lưu sản phẩm
    $(document).on('submit', '#addProductForm', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const isEdit = $('#productId').val() !== '';

        $.ajax({
            url: isEdit
                ? '/fastfeast/upload/products/edit'
                : '/fastfeast/upload/products',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                alert('Thêm sản phẩm thành công');
                $('#addProductModal').modal('hide');
                getProducts();
            },
            error: function () {
                alert('Lỗi khi thêm sản phẩm');
            }
        });
    });

    // Thay đổi thông tin sản phẩm
    $(document).on('click', '.btn-edit', function () {
        console.log("Debug: Edit Button Clicked");
        const productId = $(this).data('id');

        fetch(`/fastfeast/api/products/${productId}`)
            .then(res => res.json())
            .then(product => {
                $('#productId').val(product.product_id);
                $('#productName').val(product.product_name);
                $('#productDescription').val(product.product_description);

                $('#productPrice').val(formatPrice(product.price));
                $('#price').val(product.price);

                $('#categoryId').val(product.category_id);

                $('#addProductModal').modal('show');
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
                            <button class="btn btn-sm btn-warning btn-edit me-1" title="Sửa" data-id="${product.product_id}">
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
// Chuyển price nếu >=100tr thì sẽ là 99.999.999 đ
$('#productPrice').on('input', function () {
    let raw = this.value.replace(/\D/g, '');
    let number = Number(raw);

    if (number >= 100000000) {
        number = 99999999;
    }

    this.value = number;
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