//In ra món ăn trong giỏ hàng vào trang cart
function printCartProduct() {
  $("#item2").html("");
  if (cartItemArr.length == 0) {
    $("#item2").html(`<p id="emptyCart2">Giỏ hàng của bạn trống!!!</p>`);
    return;
  }
  let itemStr = `<h1 id="cartItemProduct">Sản Phẩm</h1>
                <hr>`;
  let totalPrice = 0;
  for (const item of cartItemArr) {
    let price = item.Price.replace(/[^\d]/g, "");
    price = Number(price);
    let quantity = Number(item.Quantity);
    let total = price * quantity;
    totalPrice += total;

    itemStr +=
      `<div class="cartProduct" id="${item.Id}">
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
              <button class="btn btn-outline-secondary btn-minus minusQty">-</button>
              <input class="form-control mx-2 foodQty" value="${item.Quantity}" min="1"
                style="width: 60px; text-align: center;" readonly>
                <button class="btn btn-outline-secondary btn-plus plusQty">+</button>
            </div>
          </div>
          <div class="col-md-4">
            <p class="cartProductPrice">${formatPrice(total)}</p>
          </div>
          <div class="col-md-4">
            <p class="deleteCartProduct" id="${item.Id}"><i class="fa-solid fa-trash"></i></p>
          </div>
        </div>
      </div>
      </div >
      </div >
      <hr>`;
  }
  itemStr +=
    `<div id="payMent">
          <p class="cartProductTotalPrice">Tổng tiền: <span>${formatPrice(totalPrice)}</span></p>
          <div class="row">
            <div class="col-md-6"></div>
            <div class="col-md-3"><a href="./Home.html" id="backToMenu"><i
              class="fa-solid fa-arrow-left"></i>Tiếp tục mua
              hàng</a>
            </div>
            <div class="col-md-3"><a href="" id="payConfirm">Thanh toán<i
              class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </div>`;
  $("#item2").html(itemStr);
}
//Khi bấm nút xóa sẽ xóa món ăn ở trang cart
$(document).on("click", ".deleteCartProduct", function () {
  deleteCartProduct($(this).attr("id"));
});


