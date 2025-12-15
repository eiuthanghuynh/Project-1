$(document).ready(async function () {
    const res = await fetch('/fastfeast/api/staff/session-info');
    const data = await res.json();

    if (!data.success) {
        window.location.href = "/fastfeast/login";
        return;
    }

    // Hiển thị name + role
    $('.sidebar-username').text(data.name);
    const roleText = data.role == 0 ? "Quản trị viên" :
        data.role == 1 ? "Quản lý" :
            "Nhân viên";
    $('.sidebar-role').text(roleText);

    // Ẩn hoặc hiện các trang quản lý theo role
    const menu = $('.sidebar-menu li');
    const showMenu = (pageName) => {
        menu.filter(`[data-page="${pageName}"]`).show();
    };
    if (data.role == 0) {
        // menu.show();
        showMenu('order');
        showMenu('staff');
        showMenu('product');
        $('.logout').show();
    } else if (data.role == 1) {
        menu.hide();
        // showMenu('dashboard');
        showMenu('order');
        showMenu('staff');
        $('.logout').show();
    } else {
        menu.hide();
        showMenu('order');
        $('.logout').show();
    }

    // Load trang theo từng mục
    function loadPage(page) {
        $('.manage-content').load(`/fastfeast/admin/${page}.html`);
    }
    loadPage('dashboard');
    $('.sidebar-menu li a').click(function (e) {
        e.preventDefault();
        const page = $(this).parent().data('page');
        loadPage(page);

        $('.sidebar-menu li').removeClass('current-item');
        $(this).parent().addClass('current-item');
    })

    // Đăng xuất
    $('.logout').click(async function (e) {
        e.preventDefault();

        const res = await fetch('/fastfeast/api/staff/logout', {
            method: 'POST'
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = '/fastfeast/login';
        }
    });
});