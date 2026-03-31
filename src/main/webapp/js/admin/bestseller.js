$(document).ready(function () {
    fetchAllData();

    $(document).on("change", ".check-product", function () {
        if ($(".check-product:checked").length > 4) {
            $(this).prop("checked", false);
            showToast("Bạn chỉ được chọn tối đa 4 sản phẩm nổi bật!", "warning");
        }
    });

    $(document).on("change", ".check-combo", function () {
        if ($(".check-combo:checked").length > 2) {
            $(this).prop("checked", false);
            showToast("Bạn chỉ được chọn tối đa 2 combo nổi bật!", "warning");
        }
    });

    $("#btn-save-bestseller").on("click", function () {
        let $btn = $(this);
        $btn.prop("disabled", true).text("Đang lưu...");

        let selectedProducts = [];
        $(".check-product:checked").each(function () {
            selectedProducts.push($(this).val());
        });

        let selectedCombos = [];
        $(".check-combo:checked").each(function () {
            selectedCombos.push($(this).val());
        });

        $.ajax({
            url: "/fastfeast/api/bestseller",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                product_ids: selectedProducts,
                combo_ids: selectedCombos
            }),
            success: function (res) {
                showToast("Đã lưu thành công danh sách Best Seller!", "success");
                $btn.prop("disabled", false).html(`<i class="fas fa-save me-2"></i> Lưu Thay Đổi`);
            },
            error: function () {
                let errorMsg = xhr.responseJSON && xhr.responseJSON.error
                    ? xhr.responseJSON.error
                    : "Lỗi khi lưu dữ liệu. Vui lòng thử lại!";
                showToast(errorMsg, "error");
                $btn.prop("disabled", false).html(`<i class="fas fa-save me-2"></i> Lưu Thay Đổi`);
            }
        });
    });
});

function fetchAllData() {
    $.ajax({
        url: "/fastfeast/api/products",
        method: "GET",
        success: function (data) {
            renderAdminList(data, "#admin-product-list", "check-product", "product_id", "product_name");
        }
    });

    $.ajax({
        url: "/fastfeast/api/combos",
        method: "GET",
        success: function (data) {
            renderAdminList(data, "#admin-combo-list", "check-combo", "combo_id", "combo_name");
        }
    });
}

function renderAdminList(dataArray, targetId, checkboxClass, idKey, nameKey) {
    if (!dataArray || dataArray.length === 0) return;
    let html = "";

    dataArray.forEach(item => {
        let id = item[idKey];
        let name = item[nameKey];
        let img = item.image_url || "";

        let isChecked = (item.is_bestseller == 1 || item.is_bestseller === true) ? "checked" : "";

        html += `
            <div class="col-md-6">
                <div class="item-card">
                    <input class="form-check-input ${checkboxClass}" type="checkbox" value="${id}" id="chk_${id}" ${isChecked}>
                    <img src="${img}" alt="${name}">
                    <div>
                        <label class="form-check-label fw-bold" for="chk_${id}">${name}</label>
                        <p class="mb-0 text-muted small">${Number(item.price).toLocaleString()} đ</p>
                    </div>
                </div>
            </div>`;
    });

    $(targetId).html(html);
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