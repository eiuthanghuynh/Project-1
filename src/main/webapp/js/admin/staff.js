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
                        <td>${staff.id}</td>
                        <td style="font-weight: bold;">${staff.name}</td>
                        <td>${roleHtml}</td>
                        <td>
                            <div>${staff.username}</div>
                            <small style="color: #888">${staff.email || ''}</small>
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

getStaff();