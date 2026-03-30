$(document).ready(function () {
    // Gọi cả 2 hàm tải dữ liệu khi trang vừa load
    getCombos();
    loadProductsForCheckboxes();

    // Mở popup khi nhấn thêm combo
    $('#btnAddCombo').on('click', function () {
        $('#addComboForm')[0].reset();
        $('#comboId').val('').prop('readonly', false);
        $('input[name="product_ids"]').prop('checked', false);
        $('#addComboModal').modal('show');
    });

    // Filter món ăn
    $('#searchProduct').on('blur change', function () {
        var value = $(this).val().toLowerCase().trim();

        $('#productCheckboxes .form-check').each(function () {
            var productName = $(this).find('.fw-bold').text().toLowerCase();
            var isMatch = productName.indexOf(value) > -1;

            if (isMatch) {
                $(this).removeClass('d-none');
            } else {
                $(this).addClass('d-none');
            }
        });
    });

    $('#searchProduct').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            $(this).blur();
        }
    });

    // Lưu combo
    $(document).on('submit', '#addComboForm', function (e) {
        e.preventDefault();

        if ($('input[name="product_ids"]:checked').length === 0) {
            showToast('Vui lòng chọn ít nhất 1 món ăn cho combo!', 'warning');
            return;
        }

        const formData = new FormData(this);
        const isEdit = $('#comboId').prop('readonly');

        $.ajax({
            url: isEdit
                ? '/fastfeast/upload/combos/edit'
                : '/fastfeast/upload/combos',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                showToast(isEdit ? 'Cập nhật combo thành công' : 'Thêm combo thành công', 'success');
                $('#addComboModal').modal('hide');
                $('#comboId').val('');
                getCombos();
            },
            error: function () {
                showToast(isEdit ? 'Cập nhật combo thất bại' : 'Thêm combo thất bại', 'error');
            }
        });
    });

    // Thay đổi thông tin combo
    $(document).on('click', '.btn-edit', function () {
        const comboId = $(this).data('id');

        fetch(`/fastfeast/api/combos/${comboId}`)
            .then(res => res.json())
            .then(combo => {
                $('#comboId').val(combo.combo_id).prop('readonly', true);
                $('#comboName').val(combo.combo_name);
                $('#comboDescription').val(combo.combo_description);
                $('#comboPrice').val(formatPrice(combo.price));
                $('#price').val(combo.price);
                $('#comboDayOfWeek').val(combo.day_of_week || '');
                $('input[name="product_ids"]').prop('checked', false);

                if (combo.product_ids && combo.product_ids.length > 0) {
                    combo.product_ids.forEach(productId => {
                        $(`#chk_${productId}`).prop('checked', true);
                    });
                }

                $('#addComboModal').modal('show');
            });
    });

    // Xóa combo
    let deleteComboId = null;
    $(document).on('click', '.btn-delete', function () {
        deleteComboId = $(this).data('id');
        $('#deleteConfirmModal').modal('show');
    });

    $('#btnConfirmDelete').on('click', function () {
        if (!deleteComboId) return;

        $.ajax({
            url: `/fastfeast/api/combos/${deleteComboId}`,
            method: 'DELETE',
            success: function () {
                $('#deleteConfirmModal').modal('hide');
                deleteComboId = null;

                showToast('Xóa combo thành công', 'success');
                getCombos();
            },
            error: function () {
                showToast('Xóa combo thất bại', 'error');
            }
        });
    });

});

function loadProductsForCheckboxes() {
    fetch('/fastfeast/api/products')
        .then(response => response.json())
        .then(products => {
            const container = $('#productCheckboxes');
            container.empty();

            products.forEach(p => {
                const checkboxHtml = `
                    <div class="form-check mb-2 d-flex align-items-center border-bottom pb-2">
                        <input class="form-check-input me-3" type="checkbox" name="product_ids" value="${p.product_id}" id="chk_${p.product_id}">
                        <label class="form-check-label w-100" for="chk_${p.product_id}" style="cursor: pointer;">
                            <div class="d-flex align-items-center">
                                <img src="${p.image_url}" width="40" height="40" class="me-3 rounded" style="object-fit: cover;">
                                <div>
                                    <div class="fw-bold">${p.product_name}</div>
                                    <div class="text-danger small">${formatPrice(p.price)}</div>
                                </div>
                            </div>
                        </label>
                    </div>
                `;
                container.append(checkboxHtml);
            });
        })
        .catch(error => {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            $('#productCheckboxes').html('<div class="text-danger text-center mt-4">Không thể tải danh sách món ăn.</div>');
        });
}

// Fetch API và hiện danh sách combo
function getCombos() {
    fetch("/fastfeast/api/combos")
        .then(response => {
            if (!response.ok) {
                throw new Error("Lỗi kết nối tới máy chủ");
            }
            return response.json();
        })
        .then(data => {
            renderComboList(data);
        })
        .catch(error => {
            console.error("Lỗi khi lấy danh sách combo:", error);
        });
}

// Hiện danh sách combo
function renderComboList(combos) {
    const tableBody = $('#comboTable tbody');
    tableBody.empty();

    const dayNames = {
        1: "Thứ 2", 2: "Thứ 3", 3: "Thứ 4",
        4: "Thứ 5", 5: "Thứ 6", 6: "Thứ 7", 7: "Chủ nhật"
    };

    combos.forEach(combo => {
        // Đếm số lượng món ăn, nếu null thì gán là 0
        const productCount = combo.product_ids ? combo.product_ids.length : 0;
        let dayBadge = '';
        if (combo.day_of_week && dayNames[combo.day_of_week]) {
            dayBadge = `<span class="badge bg-info mt-1 ms-1"><i class="far fa-calendar-check"></i> ${dayNames[combo.day_of_week]}</span>`;
        }

        const row = `
            <tr>
                <td>${combo.combo_id}</td>
                <td>
                    <div style="font-weight: bold;">${combo.combo_name}</div>
                    <span class="badge bg-warning mt-1"><i class="fas fa-utensils me-1"></i> ${productCount} món</span>
                </td>
                <td>${combo.combo_description}</td>
                <td class="text-danger fw-bold">${formatPrice(combo.price)}</td>
                <td>
                    <img src="${combo.image_url}" alt="${combo.combo_name}" width="80px" style="border-radius: 8px; object-fit: cover;">
                </td>
                <td>
                    <button class="btn btn-sm btn-warning btn-edit me-1" title="Sửa" data-id="${combo.combo_id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-delete" title="Xóa" data-id="${combo.combo_id}">
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
$('#comboPrice').on('input', function () {
    let raw = this.value.replace(/\D/g, '');
    let number = Number(raw);

    if (number >= 100000000) {
        number = 99999999;
    }

    this.value = number;
    $('#price').val(this.value);
});

$('#comboPrice').on('blur', function () {
    if (!this.value) return;

    const number = Number(this.value);
    this.value = number.toLocaleString('vi-VN') + ' đ';
});

$('#comboPrice').on('focus', function () {
    this.value = this.value.replace(/\D/g, '');
    $('#price').val(this.value);
});

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