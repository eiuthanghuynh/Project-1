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
                showToast(isEdit ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công', 'success');
                $('#addProductModal').modal('hide');
                $('#productId').val('');
                getProducts();
            },
            error: function () {
                showToast(isEdit ? 'Cập nhật sản phẩm thất bại' : 'Thêm sản phẩm thất bại', 'error');
            }
        });
    });

    // Thay đổi thông tin sản phẩm
    $(document).on('click', '.btn-edit', function () {
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

    // Xóa sản phẩm
    let deleteProductId = null;
    $(document).on('click', '.btn-delete', function () {
        deleteProductId = $(this).data('id');
        $('#deleteConfirmModal').modal('show');
    });

    $('#btnConfirmDelete').on('click', function () {
        if (!deleteProductId) return;

        $.ajax({
            url: `/fastfeast/api/products/${deleteProductId}`,
            method: 'DELETE',
            success: function () {
                $('#deleteConfirmModal').modal('hide');
                deleteProductId = null;

                showToast('Xóa sản phẩm thành công', 'success');
                getProducts();
            },
            error: function () {
                showToast('Xóa sản phẩm thất bại', 'error');
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
                            <button class="btn btn-sm btn-warning btn-edit me-1" title="Sửa" data-id="${product.product_id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-delete" title="Xóa" data-id="${product.product_id}">
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