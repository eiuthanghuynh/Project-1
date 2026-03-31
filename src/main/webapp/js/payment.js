let jsonData = null;
let cartItemArr = JSON.parse(localStorage.getItem("cart")) || [];

$(document).ready(function () {
  if (cartItemArr.length > 0) {
    printCartBox("#item3");
  } else {
    $("#item3").html("<p class='text-center mt-4'>Giỏ hàng của bạn đang trống!</p>");
    $("#order").prop("disabled", true);
  }
});

$("#customer-infor").on("submit", function (e) {
  e.preventDefault();
  let selectedPayment = $("input[name='payment-method']:checked").val();
  if (!selectedPayment) {
    showToast("Vui lòng chọn phương thức thanh toán (Tiền mặt hoặc Mã QR)!", "warning");
    return;
  }

  if (cartItemArr.length === 0) {
    showToast("Giỏ hàng đang trống!", "warning");
    return;
  }
  jsonData = getData(selectedPayment);
  $("#modal-confirm").modal("show");
});

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
      $("#modal-confirm").modal("hide");

      function clearCartAndRedirect() {
        localStorage.removeItem("cart");
        localStorage.removeItem("cartCount");
        cartItemArr = [];
        if (typeof updateCartBadge === "function") updateCartBadge();
        window.location.href = "./Home.html";
      }

      if (jsonData.paymentMethod === "VietQR") {
        let totalAmount = cartItemArr.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
        let orderId = res.order_id;

        if (!orderId) {
          showToast("Đặt hàng thành công nhưng không lấy được mã đơn. Vui lòng liên hệ quán!", "warning");
          return;
        }

        $("#modal-qr").modal("show");
        $("#qr-loading").removeClass("d-none");
        $("#qr-container").addClass("d-none");

        $.ajax({
          url: "/fastfeast/api/payment/qr",
          method: "POST",
          data: {
            order_id: orderId,
            amount: totalAmount
          },
          success: function (qrRes) {
            let qrData = typeof qrRes === "string" ? JSON.parse(qrRes) : qrRes;

            if (qrData.success) {
              $("#qr-image").attr("src", qrData.qrDataURL);
              $("#qr-amount").text(formatPrice(totalAmount));
              $("#qr-order-id").text(orderId);
              $("#qr-loading").addClass("d-none");
              $("#qr-container").removeClass("d-none");
            }
          },
          error: function (xhr) {
            $("#modal-qr").modal("hide");
            showToast("Lỗi hệ thống khi tạo mã QR. Vui lòng thanh toán tiền mặt khi nhận hàng!", "warning");
          }
        });
        $("#btn-close-qr").off("click").on("click", function () {
          $("#modal-qr").modal("hide");
          showToast("Bạn chưa hoàn tất thanh toán. Có thể sửa thông tin và đặt lại!", "warning");
          $("#btn-confirm").prop("disabled", false).text("Xác nhận");
        });

        $("#btn-finish-order").off("click").on("click", function () {
          let $finishBtn = $(this);
          $finishBtn.prop("disabled", true).text("Đang xác nhận...");

          $("#modal-qr").modal("hide");
          showToast("Cảm ơn bạn! Tiền đã được chuyển và đơn hàng đang được xử lý.", "success");
          setTimeout(clearCartAndRedirect, 1500);
          setTimeout(() => {
            $finishBtn.prop("disabled", false).text("Tôi Đã Thanh Toán");
          }, 2000);
        });

      } else {
        showToast("Đặt hàng thành công", "success");
        setTimeout(clearCartAndRedirect, 1500);
      }
    },

    error: function (xhr) {
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

function getData(paymentMethodValue) {
  let customer = {
    customer_name: $("#customer-name").val().trim(),
    phone: $("#customer-phone").val().trim(),
    email: $("#customer-email").val().trim() || null,
    address: $("#customer-address").val().trim()
  };

  let items = [];
  for (const item of cartItemArr) {
    let noteParts = [];
    if (item.Size) noteParts.push(item.Size);
    if (item.Base) noteParts.push(`Đế ${item.Base}`);
    if (item.Note) noteParts.push(item.Note);

    let orderItem = {
      quantity: item.Quantity,
      price: item.Price,
      note: noteParts.join(" - ")
    }

    let itemIdStr = String(item.Id).toUpperCase();
    if (itemIdStr.startsWith("PC")) {
      orderItem.combo_id = item.Id;
    } else {
      orderItem.product_id = item.Id;
    }
    items.push(orderItem);
  }
  let finalPaymentMethod = (paymentMethodValue === "qr") ? "VietQR" : "Cash";

  let payload = {
    "customer": customer,
    "items": items,
    "paymentMethod": finalPaymentMethod
  };

  return payload;
}

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

    try {
      if (typeof isPizza === "function" && isPizza(item.Base, item.Size)) {
        cartBoxStr += `<p class="paymentProductSize">Kích thước - ${item.Size}</p>
                               <p class="paymentProductBase">Đế - ${item.Base}</p>`;
      } else if (item.Size && item.Base) {
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

function formatPrice(price) {
  if (typeof price !== 'number') return price;
  return price.toLocaleString('vi-VN') + " đ";
}