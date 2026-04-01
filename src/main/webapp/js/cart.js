//In ra món ăn trong giỏ hàng vào trang cart
window.cartItemArr = JSON.parse(localStorage.getItem("cart")) || [];
function printCartProduct(addr) {
  $(addr).html("");

  if (cartItemArr.length == 0) {
    $(addr).html(`<p id="emptyCart2">Giỏ hàng của bạn trống!!!</p>`);
    return;
  }
  let itemStr = `<h1 id="cartItemProduct">Sản Phẩm</h1>
                <hr>
                <div id="cartPageItemList">`;
  let totalPrice = 0;
  for (const item of cartItemArr) {
    let price = item.Price;
    let quantity = item.Quantity;
    let total = price * quantity;
    totalPrice += total;

    itemStr +=
      `<div class="cartProduct" data-id="${item.Id}">
                    <div class="row">
                        <div class="col-md-6" id="itemLeft">
                            <div class="row">
                                <div class="col-md-4">
                                    <img src="${item.Img}"
                                        alt="" class="cartItemImg">
                                </div>
                                <div class="col-md-8">
                                    <h1 class="cartProductTitle">${item.Title}</h1>`;
    if (isPizza(item.Base, item.Size)) {
      itemStr += `                  <p class="cartProductInfor">Kích thước - ${item.Size}</p>
                                    <p class="cartProductInfor">Đế - ${item.Base}</p>`;
    }
    if (item.Note != "") {
      itemStr += `<p class="cartItemInfor">Ghi chú - ${item.Note}</p>`;
    }
    itemStr += `<p class="cartProductInfor">Số lượng - ${item.Quantity}</p>
                                </div >
                            </div >
                        </div >
      <div class="col-md-6" id="itemRight">
        <div class="row">
          <div class="col-md-4">
            <div class="quantity-box d-flex align-items-center">
              <button class="btn btn-outline-secondary btn-minus cartMinus">-</button>
              <input class="form-control mx-2 foodQty" value="${item.Quantity}" min="1"
                style="width: 60px; text-align: center;" readonly>
                <button class="btn btn-outline-secondary btn-plus cartPlus">+</button>
            </div>
          </div>
          <div class="col-md-4">
            <p class="cartProductPrice">${formatPrice(total)}</p>
          </div>
          <div class="col-md-4">
            <p class="deleteCartProduct" data-id="${item.Id}"><i class="fa-solid fa-trash"></i></p>
          </div>
        </div>
      </div>
      </div >
      </div >
      <hr>`;
    itemStr += `</div>`;
  }
  let paymentStr =
    `<div id="payMent">
          <p class="cartProductTotalPrice">Tổng tiền: <span>${formatPrice(totalPrice)}</span></p>
          <div class="row">
            <div class="col-md-6"></div>
            <div class="col-md-3"><a href="./" id="backToMenu"><i
              class="fa-solid fa-arrow-left"></i>Tiếp tục mua
              hàng</a>
            </div>
            <div class="col-md-3"><a href="./checkout" id="payConfirm">Thanh toán<i
              class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </div>`;
  $(addr).html(itemStr + paymentStr);
}
// Thay đổi số lượng thức ăn cần order trong cart
$(document).on("click", ".cartPlus", function () {
  let parent = $(this).closest(".cartProduct");
  let id = parent.data("id");

  let item = cartItemArr.find(x => x.Id === id);
  if (!item) return;

  item.Quantity++;
  saveCart();
  printCartProduct("#item2");
  updateCartBadge();
});

$(document).on("click", ".cartMinus", function () {
  let parent = $(this).closest(".cartProduct");
  let id = parent.data("id");

  let item = cartItemArr.find(x => x.Id === id);
  if (!item) return;

  if (item.Quantity > 1) {
    item.Quantity--;
    saveCart();
    printCartProduct("#item2");
    updateCartBadge();
  } else {
    removeCartItem(id);
  }
});

$(document).ready(function () {
    printCartProduct("#item2");
    
    if (typeof updateCartBadge === "function") {
         updateCartBadge();
    }
});