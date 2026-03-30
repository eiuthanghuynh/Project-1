let jsonData = null;
let cartItemArr = JSON.parse(localStorage.getItem("cart")) || [];

// 1. Render giỏ hàng ngay khi tải trang (Bạn có thể gọi hàm này ở cuối file)
$(document).ready(function () {
  if (cartItemArr.length > 0) {
    printCartBox("#item3"); // Render giỏ hàng vào bên phải
  } else {
    $("#item3").html("<p class='text-center mt-4'>Giỏ hàng của bạn đang trống!</p>");
    $("#order").prop("disabled", true); // Khóa nút đặt hàng nếu giỏ trống
  }
});

// 2. Bắt sự kiện khi người dùng bấm "Đặt Hàng"
$("#customer-infor").on("submit", function (e) {
  e.preventDefault(); // Ngăn form tải lại trang

  // Lấy phương thức thanh toán đang được chọn (Radio button)
  let selectedPayment = $("input[name='payment-method']:checked").val();

  // Validate: Bắt buộc chọn phương thức thanh toán
  if (!selectedPayment) {
    showToast("Vui lòng chọn phương thức thanh toán (Tiền mặt hoặc Mã QR)!", "warning");
    return; // Dừng lại, không hiện Modal
  }

  // Nếu giỏ hàng trống thì không cho đặt
  if (cartItemArr.length === 0) {
    showToast("Giỏ hàng đang trống!", "warning");
    return;
  }

  // Gom dữ liệu
  jsonData = getData(selectedPayment);

  // Hiện popup xác nhận
  $("#modal-confirm").modal("show");
});

// 3. Xử lý khi ấn nút "Xác nhận" trong Modal
$("#btn-confirm").on("click", function () {
  let $btn = $(this);
  let originalText = $btn.text();
  $btn.prop("disabled", true).text("Đang xử lý...");

  $.ajax({
    url: "/fastfeast/api/checkout",
    method: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(jsonData),

    success: function (res) {
      console.log("✅ Checkout thành công", res);
      $("#modal-confirm").modal("hide");

      // Hàm dọn dẹp giỏ hàng dùng chung
      function clearCartAndRedirect() {
        localStorage.removeItem("cart");
        localStorage.removeItem("cartCount");
        cartItemArr = [];
        if (typeof updateCartBadge === "function") updateCartBadge();
        window.location.href = "./Home.html";
      }

      // KIỂM TRA PHƯƠNG THỨC THANH TOÁN
      if (jsonData.paymentMethod === "VietQR") {
        // 1. Tính tổng tiền từ giỏ hàng (vì Servlet QR cần amount)
        let totalAmount = cartItemArr.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);

        // 2. Lấy order_id do Backend Checkout trả về (Cần đảm bảo backend có trả key này)
        let orderId = res.order_id;

        if (!orderId) {
          showToast("Đặt hàng thành công nhưng không lấy được mã đơn. Vui lòng liên hệ quán!", "warning");
          return;
        }

        // 3. Hiện Popup QR và trạng thái loading
        $("#modal-qr").modal("show");
        $("#qr-loading").removeClass("d-none");
        $("#qr-container").addClass("d-none");

        // 4. Gọi API tạo mã VietQR của bạn
        // Lưu ý: Endpoint của bạn dùng req.getParameter nên data truyền vào là dạng form URL-encoded chuẩn của AJAX (không dùng JSON.stringify ở đây)
        $.ajax({
          url: "/fastfeast/api/payment/qr",
          method: "POST",
          data: {
            order_id: orderId,
            amount: totalAmount
          },
          success: function (qrRes) {
            // Backend VietQR trả về String (do dùng resp.getWriter().write()), nên cần parse sang JSON
            let qrData = typeof qrRes === "string" ? JSON.parse(qrRes) : qrRes;

            if (qrData.success) {
              // Gắn dữ liệu vào Modal
              $("#qr-image").attr("src", qrData.qrDataURL);
              $("#qr-amount").text(formatPrice(totalAmount));
              $("#qr-order-id").text(orderId);

              // Tắt loading, hiện QR
              $("#qr-loading").addClass("d-none");
              $("#qr-container").removeClass("d-none");
            }
          },
          error: function (xhr) {
            console.error("Lỗi tạo QR:", xhr.responseText);
            $("#modal-qr").modal("hide");
            showToast("Lỗi hệ thống khi tạo mã QR. Vui lòng thanh toán tiền mặt khi nhận hàng!", "warning");
          }
        });

        // Xử lý khi khách bấm nút "Tôi đã thanh toán" hoặc nút [X] tắt modal QR
        $("#btn-close-qr").off("click").on("click", function () {
          $("#modal-qr").modal("hide");

          // Thông báo cho khách biết
          showToast("Bạn chưa hoàn tất thanh toán. Có thể sửa thông tin và đặt lại!", "warning");

          // QUAN TRỌNG: Phục hồi lại nút "Xác nhận" ở modal trước đó 
          // để khách có thể bấm đặt lại (hệ thống sẽ tạo ra 1 mã đơn hàng mới)
          $("#btn-confirm").prop("disabled", false).text("Xác nhận");
        });

        $("#btn-finish-order").off("click").on("click", function () {
          // Tạm khóa nút này lại và đổi text để khách không bấm đúp 2 lần
          let $finishBtn = $(this);
          $finishBtn.prop("disabled", true).text("Đang xác nhận...");

          /* * (Lưu ý hệ thống: Nếu sau này bạn làm webhook ngân hàng, 
           * chỗ này sẽ gọi API kiểm tra xem tiền đã vào tài khoản chưa. 
           * Hiện tại ta tạm mặc định khách bấm là thành công).
           */

          $("#modal-qr").modal("hide");
          showToast("Cảm ơn bạn! Tiền đã được chuyển và đơn hàng đang được xử lý.", "success");

          // Gọi hàm xóa giỏ hàng và chuyển về trang chủ
          setTimeout(clearCartAndRedirect, 1500);

          // Phục hồi lại trạng thái nút ẩn cho lần mua hàng sau (nếu có)
          setTimeout(() => {
            $finishBtn.prop("disabled", false).text("Tôi Đã Thanh Toán");
          }, 2000);
        });

      } else {
        // LUỒNG TIỀN MẶT (Cash) - Giữ nguyên như cũ
        showToast("Đặt hàng thành công", "success");
        setTimeout(clearCartAndRedirect, 1500);
      }
    },

    error: function (xhr) {
      console.error("❌ Checkout thất bại", xhr.responseText);
      $("#modal-confirm").modal("hide");
      $btn.prop("disabled", false).text(originalText);

      try {
        let errResponse = JSON.parse(xhr.responseText);
        showToast("Lỗi: " + (errResponse.error || "Đặt hàng thất bại"), "error");
      } catch (e) {
        showToast("Đã có lỗi xảy ra từ máy chủ!", "error");
      }
    }
  });
});

// 4. Hàm thu thập dữ liệu từ Form và LocalStorage
function getData(paymentMethodValue) {
  let customer = {
    customer_name: $("#customer-name").val().trim(),
    phone: $("#customer-phone").val().trim(),
    email: $("#customer-email").val().trim() || null,
    address: $("#customer-address").val().trim()
  };

  let items = [];
  for (const item of cartItemArr) {
    // Gom Note thông minh như chúng ta đã bàn
    let noteParts = [];
    if (item.Size) noteParts.push(item.Size);
    if (item.Base) noteParts.push(`Đế ${item.Base}`);
    if (item.Note) noteParts.push(item.Note);

    items.push({
      product_id: item.Id,
      quantity: item.Quantity,
      price: item.Price,
      note: noteParts.join(" - ")
    });
  }

  // Map giá trị radio HTML (cash/qr) thành chuẩn DTO Backend (Cash/VietQR)
  let finalPaymentMethod = (paymentMethodValue === "qr") ? "VietQR" : "Cash";

  let payload = {
    "customer": customer,
    "items": items,
    "paymentMethod": finalPaymentMethod
  };

  console.log("📦 Dữ liệu chuẩn bị gửi lên Server:", payload);
  return payload;
}

// ==========================================
// CÁC HÀM TIỆN ÍCH HIỂN THỊ (Giữ nguyên của bạn)
// ==========================================

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
      toastEl.classList.add('bg-warning', 'text-dark');
      break;
    default:
      toastEl.classList.add('bg-info');
  }

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

function printCartBox(addr) {
  $(addr).html("");
  let cartBoxStr = `<h1 class="cart-title">Đơn của bạn</h1><div id="cartPageItemList">`;
  let totalPrice = 0;

  for (const item of cartItemArr) {
    let price = item.Price;
    let quantity = item.Quantity;
    let total = price * quantity;
    totalPrice += total;

    cartBoxStr += `
        <div class="paymentProduct" data-id="${item.Id}">
            <div class="row">
                <div class="col-md-4">
                    <img src="${item.Img}" class="paymentProductImg">
                </div>
                <div class="col-md-8">
                    <h1 class="paymentProductTitle">${item.Title}</h1>`;

    // Bắt lỗi nếu hàm isPizza chưa được định nghĩa (Tùy thuộc vào file menu.js của bạn)
    try {
      if (typeof isPizza === "function" && isPizza(item.Base, item.Size)) {
        cartBoxStr += `<p class="paymentProductSize">Kích thước - ${item.Size}</p>
                               <p class="paymentProductBase">Đế - ${item.Base}</p>`;
      } else if (item.Size && item.Base) {
        // Fallback nếu không có hàm isPizza nhưng item vẫn có Size và Base
        cartBoxStr += `<p class="paymentProductSize">Kích thước - ${item.Size}</p>
                                <p class="paymentProductBase">Đế - ${item.Base}</p>`;
      }
    } catch (e) { }

    if (item.Note && item.Note.trim() !== "") {
      cartBoxStr += `<p class="paymentProductNote">Ghi chú - ${item.Note}</p>`;
    }

    cartBoxStr += `<div class="row">
                        <div class="col-md-6">
                            <p class="paymentProductQty">Số lượng - ${item.Quantity}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="paymentProductPrice">${formatPrice(item.Price)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
  }

  cartBoxStr += `</div>`;

  let totalPriceStr = `
    <hr>
    <div id="payMent">
        <p class="paymentProductTotal">Tổng tiền: <span class="fw-bold text-danger">${formatPrice(totalPrice)}</span></p>
    </div>`;

  $(addr).html(cartBoxStr + totalPriceStr);
}

// Hàm format giá tiền giả lập (Phòng trường hợp file cart.js của bạn chưa load kịp)
function formatPrice(price) {
  if (typeof price !== 'number') return price;
  return price.toLocaleString('vi-VN') + " đ";
}