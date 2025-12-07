$(document).ready(function () {
    $('#loginForm').on('submit', async function (e) {
        e.preventDefault();

        $('.message').text('');

        const username = $('#username').val().trim();
        const password = $('#password').val().trim();

        if (!username || !password) {
            $('.message').text('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const response = await fetch('/fastfeast/api/staff/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = '/fastfeast/manage';
            } else {
                $('.message').text(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    });
});