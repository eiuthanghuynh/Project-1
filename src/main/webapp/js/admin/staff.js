$(document).ready(async function () {
    getStaff();
    const res = await fetch('/fastfeast/api/staff/session-info');
    const data = await res.json();

    const roleSelect = $('#staffRole');
    roleSelect.find('option').show();
    if (data.role == 1) {
        roleSelect.find('option[value="0"]').hide();
        roleSelect.find('option[value="1"]').hide();
        roleSelect.val('2');
    } else {
        roleSelect.val('');
    }

    // Mở popup khi nhấn thêm nhân viên
    $('#btnAddStaff').on('click', function () {
        $('#addStaffForm')[0].reset();
        $('#staffId').val('');
        $('.password-section').show();
        $('#staffPassword').prop('required', true);
        $('#addStaffModal').modal('show');
    });

    // Lưu nhân viên
    $('#addStaffForm').on('submit', function (e) {
        e.preventDefault();

        const isEdit = $('#staffId').val() !== '';
        const formData = new FormData(this);

        $.ajax({
            url: isEdit
                ? '/fastfeast/upload/staff/edit'
                : '/fastfeast/upload/staff',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                showToast(isEdit ? 'Cập nhật nhân viên thành công' : 'Thêm nhân viên thành công', 'success');
                $('#addStaffModal').modal('hide');
                $('#staffId').val('');
                getStaff();
            },
            error: function () {
                showToast(isEdit ? 'Cập nhật nhân viên thất bại' : 'Thêm nhân viên thất bại', 'error');
            }
        });
    });

    // Thay đổi thông tin nhân viên
    $(document).on('click', '.btn-edit', function () {
        const staffId = $(this).data('id');
        $('#staffPassword').prop('required', false);
        $('.password-section').hide();

        fetch(`/fastfeast/api/staff/${staffId}`)
            .then(res => res.json())
            .then(staff => {
                $('#staffId').val(staff.staff_id);
                $('#staffName').val(staff.staff_name);
                $('#staffUsername').val(staff.staff_username);
                $('#staffEmail').val(staff.staff_email);
                $('#staffRole').val(staff.role);

                $('#addStaffModal').modal('show');
            });
    });

    // Xóa nhân viên
    let deleteStaffId = null;
    $(document).on('click', '.btn-delete', function () {
        deleteStaffId = $(this).data('id');
        $('#deleteStaffModal').modal('show');
    });

    $('#btnConfirmDeleteStaff').on('click', function () {
        if (!deleteStaffId) return;

        $.ajax({
            url: `/fastfeast/upload/staff/delete?staff_id=${deleteStaffId}`,
            method: 'DELETE',
            success: function () {
                $('#deleteStaffModal').modal('hide');
                deleteStaffId = null;

                showToast('Xóa nhân viên thành công', 'success');
                getStaff();
            },
            error: function () {
                showToast('Bạn không được xóa chính mình & các nhân viên cấp cao', 'error');
            }
        });
    });
});

function getStaff() {
    fetch("api/staff/list")
        .then(response => {
            if (!response.ok) {
                throw new Error("Lỗi kết nối tới máy chủ");
            }
            return response.json();
        })
        .then(data => {
            renderStaffList(data);
        })
        .catch(error => {
            console.error("Lỗi khi lấy danh sách nhân viên:", error);
        });
}

function renderStaffList(staffs) {
    const tableBody = $('#staffTable tbody');
    tableBody.empty();

    staffs.forEach(staff => {
        let roleHtml = '<span class="badge bg-dark">Không xác định</span>';
        if (staff.role == 0) roleHtml = '<span class="badge bg-danger">Quản trị viên</span>';
        else if (staff.role == 1) roleHtml = '<span class="badge bg-primary">Quản lý</span>';
        else if (staff.role == 2) roleHtml = '<span class="badge bg-secondary">Nhân viên</span>';

        const row = `
                    <tr>
                        <td>${staff.staff_id}</td>
                        <td style="font-weight: bold;">${staff.staff_name}</td>
                        <td>${roleHtml}</td>
                        <td>
                            <div>${staff.staff_username}</div>
                            <small style="color: #888">${staff.staff_email || ''}</small>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-warning me-1 btn-edit" title="Sửa" data-id="${staff.staff_id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-delete" title="Xóa" data-id="${staff.staff_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;

        tableBody.append(row);
    });
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