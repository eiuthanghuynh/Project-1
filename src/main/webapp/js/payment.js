let jsonData = null;

$("#customer-infor").on("submit", function (e) {
  e.preventDefault();

  jsonData = getData();
  $("#modal-confirm").modal("show");
});
$("#modal-confirm").on('shown.bs.modal', function () {
  $(this).trigger("focus");
})
//Nhấn xác nhận
$("#btn-confirm").on("click", function () {
  $("#modal-confirm").modal("hide");
  $.ajax({
    url: "/fastfeast/api/checkout",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(jsonData),

    success: function (res) {
      console.log("✅ Checkout thành công", res);
      // CLEAR CART
      localStorage.removeItem("cart");
      cartItemArr = [];
      updateCartBadge();
      showToast("Đặt hàng thành công", "success");
      setTimeout(() => {
        window.location.href = "./Home.html";
      }, 1500);
    },

    error: function (xhr) {
      console.error("❌ Checkout thất bại", xhr.responseText);
      showToast("Đặt hàng thất bại", "error")
    }
  });
})
//Lấy dữ liệu khách hàng và món ăn
function getData() {
  let jsonData = null;
  let customer = {
    customer_name: $("#customer-name").val(),
    phone: $("#customer-phone").val(),
    email: $("#customer-email").val() || null,
    address: $("#customer-address").val()
  };

  // LẤY DANH SÁCH MÓN ĂN
  let itemsArr = JSON.parse(localStorage.getItem("cart")) || [];
  let items = [];

  for (const item of itemsArr) {
    items.push({
      product_id: item.Id,
      quantity: item.Quantity,
      price: item.Price,
      note: `${item.Base} ${item.Size} ${item.Note || ""}`.trim()
    });
  }

  jsonData = { "customer": customer, "items": items };
  console.log("SEND JSON:", jsonData);

  return jsonData;
}

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

/*In ra review món ăn trong giỏ hàng*/
function printCartBox(addr) {
  $(addr).html("");
  let cartBoxStr = `<h1 class="cart-title">Đơn của bạn</h1>
                      <div id="cartPageItemList">`;
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
                    <h1 class="paymentProductTitle">${item.Title}</h1>
                    <p class="paymentProductQty">Số lượng - ${item.Quantity}</p>
                </div>
            </div>
        </div>`;
  }

  cartBoxStr += `</div>`;

  let totalPriceStr = `
    <hr>
    <div id="payMent">
        <p class="paymentProductTotal">Tổng tiền: <span>${formatPrice(totalPrice)}</span>
        </p>
    </div>`;

  $(addr).html(cartBoxStr + totalPriceStr);
}
