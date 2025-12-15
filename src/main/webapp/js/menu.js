async function getAllProducts() {
  const url = "http://localhost:8080/fastfeast/api/products";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    let listPizza = result.filter(p => p.category_id === 'CA01');
    let listHamburger = result.filter(p => p.category_id === 'CA02');
    let listBurrito = result.filter(p => p.category_id === 'CA03');
    menuArr = [...listPizza, ...listBurrito, ...listHamburger];
    printProduct(listPizza, "#pizza");
    printProduct(listBurrito, "#burrito");
    printProduct(listHamburger, "#hamburger");

    attachFoodEvents();
  } catch (error) {
    console.error(error.message);
  }
}

let menuArr;

let linkIntroductionSliders = [
  "./assets/Banner1.png",
  "./assets/1.png",
  "./assets/2.png",
  "./assets/bannercombo1.png",
  "./assets/bannercombo2.png",
]

function calcLoop(list) {
  let a = list.length % 4;
  switch (a) {
    case 0:
      return 1;
      break;
    case 1:
      return 4;
      break;
    case 2:
      return 2;
      break;
    case 3:
      return 4;
      break;
    case 4:
      return 1;
      break;
    default:
      break;
  }
}

function formatPrice(price) {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function printProduct(list, selector) {
  let html = ``;
  let i = 1;
  let n = calcLoop(list);
  for (let a = 0; a < n; a++) {
    for (const item of list) {
      if (i % 4 == 1) {
        html += `<div class="carousel-item ${i === 1 ? "active" : ""}">
                      <div class="row g-4">`;
      }
      html +=
        `<div class="col-md-3">
              <div class="food-item" id="${selector.substring(1)}-${i}" data-description="${item.product_description}">
                <img src="${item.image_url}">
                <h3 class="food-title">${item.product_name}</h3>
                <p class="food-price">${formatPrice(item.price)}</p>
              </div>
        </div>`;
      if (i % 4 == 0) {
        html += `</div></div>`;
      }
      i++;
    }
  }
  $(selector).html(html);
}

function printIntroductionSlider() {
  let introArr = ``;
  let i = 1;
  for (const link of linkIntroductionSliders) {
    introArr +=
      `<div class="carousel-item ${i === 1 ? "active" : ""}">
                <a href=""><img src=${link} class="d-block w-100"
                    alt="..."></a>
              </div>`;
    i++;
  }
  $("#intro").html(introArr);
}
//Tạo popup cho món ăn
function attachFoodEvents() {
  document.querySelectorAll(".food-item").forEach(item => {
    item.addEventListener("click", function () {
      document.getElementById("foodForm").reset();
      $("#only-pizza").html("");
      $(".foodQty").val(1);

      let title = $(this).find(".food-title").text();
      let price = $(this).find(".food-price").text();
      let img = $(this).find("img").attr("src");
      let description = $(this).data("description");

      $("#modalTitle").text(title);
      $("#modalPrice").text(price);
      $("#modalImg").attr("src", img);
      $("#modalDescription").text(description);
      if (title.toLowerCase().includes("pizza")) {
        let str = `
        <h2 class="modal-body-title">KÍCH THƯỚC</h2>
        <input type="radio" class="btn-check" name="options" id="size1" autocomplete="off" checked>
        <label class="btn btn-secondary" for="size1">Size S</label>
        <input type="radio" class="btn-check" name="options" id="size2" autocomplete="off">
        <label class="btn btn-secondary" for="size2">Size M</label>
        <input type="radio" class="btn-check" name="options" id="size3" autocomplete="off">
        <label class="btn btn-secondary" for="size3">Size L</label>
        <h2 class="modal-body-title">ĐẾ</h2>
        <input type="radio" id="thick" name="pizza-base" checked>
        <label for="thick" class="pizza-base">Dày</label>
        <input type="radio" id="thin" name="pizza-base">
        <label for="thin" class="pizza-base">Mỏng</label>`;
        $("#only-pizza").html(str);
      }
      $("#foodModal").modal("show");
    });
  });
}

// Thay đổi số lượng thức ăn cần order trong popup
$(document).on("click", ".modalPlus", function () {
  let input = $(this).closest(".quantity-box").find(".foodQty");
  let val = parseInt(input.val()) || 1;
  input.val(val + 1);
  saveCart();
  updateCartBadge();
});

$(document).on("click", ".modalMinus", function () {
  let input = $(this).closest(".quantity-box").find(".foodQty");
  let val = parseInt(input.val()) || 1;
  if (val > 1) {
    input.val(val - 1);
  }
  saveCart();
  updateCartBadge();
});
// Tìm kiếm món ăn
function searchFood(keywork) {
  $("#result").html("");
  key = keywork.toLowerCase();
  let result = menuArr.filter(food => food.product_name.toLowerCase().includes(key));
  if (result.length === 0) {
    $("#result").html(`<p class="noInfor">Không tìm thấy món ăn</p>`);
    return;
  }
  // In món ăn đã tìm
  printFood(result, "#result")
  function printFood(result, selector) {
    let resultStr = "";
    let i = 1;
    for (const food of result) {
      resultStr +=
        `<div class="col-md-3">
              <div class="food-item" id="${food.product_name.split(" ")[0].toLowerCase()}-${i}" data-description="${food.product_description}">
                <img src="${food.image_url}">
                <h3 class="food-title">${food.product_name}</h3>
                <p class="food-price">${formatPrice(food.price)}</p>
              </div>
        </div>`;
      i++;
    }
    $(selector).html(resultStr);
    attachFoodEvents();
  }
}
// Xóa tìm kiếm
$("#deleteInput").on("click", function () {
  $("#searching").val("");
  $("#result").html("");
  $("#pizza-slider").css("display", "block");
  $("#hamburger-slider").css("display", "block");
  $("#burrito-slider").css("display", "block");
});
// Đóng modal
$("#close").on("click", function () {
  $("#foodModal").modal("hide");
});
// Nhấn nút tìm kiếm
$("#searchingButton").on("click", function () {
  search();
});

function search() {
  let keywork = $("#searching").val().trim();
  if (!keywork) {
    getAllProducts();
    return;
  }
  $("#pizza-slider").css("display", "none");
  $("#hamburger-slider").css("display", "none");
  $("#burrito-slider").css("display", "none");
  searchFood(keywork);
}
// thay đổi tìm kiếm
$("#searching").on("change", function () {
  if ($("#searching").val().length === 0) {
    $("#result").html("");
    $("#pizza-slider").css("display", "block");
    $("#hamburger-slider").css("display", "block");
    $("#burrito-slider").css("display", "block");
  }
});
//nhấn enter để tìm
$("#searching").keydown(function (e) {
  if (e.key === "Enter") {
    search();
  }
});
// Hover giỏ hàng sẽ hiện các món ăn trong giỏ
$("#cartWrapper").hover(
  function () {
    $("#cart").stop().fadeIn(200);
    printCart();
  },
  function () {
    $("#cart").stop().fadeOut(200);
  }
);
// Bấm nút thêm vào giỏ hàng sẽ add món ăn vào
let cartItemArr = [];
let nextId = 1
function addCartItem(title, price, img, qty, note, base, size) {
  cartItemArr.push({
    "Id": nextId++,
    "Title": title,
    "Price": price,
    "Img": img,
    "Quantity": qty,
    "Note": note,
    "Size": size,
    "Base": base
  });
}
function findCartItem(title, size, base, note) {
  return cartItemArr.find(item =>
    item.Title === title &&
    (item.Size || "") === (size || "") &&
    (item.Base || "") === (base || "") &&
    (item.Note || "") === (note || "")
  );
}
// Xóa item
function deleteCartItem(id) {
  id = Number(id);
  const index = cartItemArr.findIndex(item => item.Id === id);
  if (index !== -1) {
    cartItemArr.splice(index, 1);
  }
  saveCart();
  updateCartBadge();
  printCart();
  printCartProduct();
}
// kiểm tra có phải là pizza hay không
function isPizza(base, size) {
  if (base == "" && size == "") {
    return false;
  }
  return true;
}
// in item ra giỏ hàng
function printCart() {
  $("#item").html("");
  if (cartItemArr.length == 0) {
    $("#item").html(`<p id="emptyCart">Giỏ hàng của bạn trống!!!</p>`);
    return;
  }
  let itemStr = `<div id="cartItemList">`;
  let totalPrice = 0;
  for (const item of cartItemArr) {
    let price = item.Price.replace(/[^\d]/g, "");
    price = Number(price);
    let quantity = Number(item.Quantity);
    let total = price * quantity;
    totalPrice += total;

    itemStr +=
      `<div class="cartItem">
        <div class="row">
          <div class="col-md-3">
            <img src="${item.Img}" alt=""
              class="cartItemImg">
          </div>
          <div class="col-md-6">
            <h1 class="cartItemTitle">${item.Title}</h1>`;
    if (isPizza(item.Base, item.Size)) {
      itemStr +=
        `<p class="cartItemInfor">Kích thước - ${item.Size}</p>
        <p class="cartItemInfor">Đế - ${item.Base}</p>`;
    }
    if (item.Note != "") {
      itemStr += `<p class="cartItemInfor">Ghi chú - ${item.Note}</p>`;
    }
    itemStr +=
      `<p class="cartItemInfor">Số lượng - ${item.Quantity}</p>
      </div >
      <div class="col-md-3" id="cartPrice">
        <p class="deleteCartItem" id="${item.Id}"><i class="fa-solid fa-trash"></i></p>
        <p class="cartItemInfor cartItemPrice">${formatPrice(total)}</p>
      </div>
        </div >
      <hr>
      </div>`;
  }
  itemStr += `</div>`;
  let paymentStr =
    `<div class="payment">
      <div class="row">
        <div class="col-md-6">
          <p class="cartItemTitle">Tổng Tiền</p>
        </div>
        <div class="col-md-6">
          <p id="cartItemTotal">${formatPrice(totalPrice)}</p>
        </div>
        <div class="col-md-12">
          <button type="button" id="pay">Thanh toán</button>
        </div>
      </div>
    </div > `;
  $("#item").html(itemStr + paymentStr);
  showScroll();
}
// khi click nút thêm lấy dữ liệu
$("#addToCart").on("click", function () {
  let title = $("#modalTitle").text();
  let price = $("#modalPrice").text();
  let img = $("#modalImg").attr("src");
  let qty = $(".foodQty").val();
  let note = $("#foodNote").val();
  let size = $("input[name='options']:checked").next("label").text();
  let base = $("input[name='pizza-base']:checked").next("label").text();
  let existItem = findCartItem(title, size, base, note);
  if (existItem) {
    existItem.Quantity = Number(existItem.Quantity) + Number(qty);
  } else {
    addCartItem(title, price, img, qty, note, base, size);
  }
  $("#foodModal").modal("hide");
  saveCart();
  updateCartBadge();
  printCart();
  updateScroll();
});
//Khi bấm thùng rác sẽ xóa món ăn khỏi giỏ hàng
$(document).on("click", ".deleteCartItem", function () {
  deleteCartItem($(this).attr("id"));
});
//Bấm vào giỏ hàng sẽ chuyển sang trang giỏ hàng
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartItemArr));
}
function updateCartBadge() {
  $("#countCart").text(cartItemArr.length);
  localStorage.setItem("cartCount", cartItemArr.length);
}
function deleteCartProduct(id) {
  id = Number(id);
  const index = cartItemArr.findIndex(item => item.Id === id);
  if (index !== -1) {
    cartItemArr.splice(index, 1);
  }
  saveCart();
  updateCartBadge();
  printCartProduct();
}
// Khi load trang
window.addEventListener("beforeunload", function () {
  localStorage.setItem("cartLastClosed", Date.now());
});
window.onload = function () {
  // Lấy thời gian đóng tab trước đó
  let lastClosed = localStorage.getItem("cartLastClosed");

  if (lastClosed) {
    let gap = Date.now() - Number(lastClosed);
    // Nếu cách lúc đóng tab > 1 ngày thì xóa giỏ hàng
    if (gap > 86400000) {
      localStorage.removeItem("cart");
      localStorage.removeItem("cartCount");
    }
  }
   
  // --- Load lại giỏ ---
  let savedCart = localStorage.getItem("cart");
  cartItemArr = savedCart ? JSON.parse(savedCart) : [];

  if (cartItemArr.length > 0) {
    nextId = Math.max(...cartItemArr.map(item => item.Id)) + 1;
  } else {
    nextId = 1;
  }

  let savedCount = localStorage.getItem("cartCount");
  document.getElementById("countCart").textContent = savedCount ?? cartItemArr.length;

  if (window.location.pathname.includes("Cart.html")) {
    printCartProduct();
  }
};
//Khi thêm trên 4 món ăn sẽ có nút Scroll
function showScroll() {
  const $list = $("#cartItemList");
  if ($list.length === 0) return;

  if (cartItemArr.length >= 4) {
    $list.css("overflow-y", "auto");
  } else {
    $list.css("overflow-y", "hidden");
  }
}

// Load trang
document.addEventListener("DOMContentLoaded", function () {
  printIntroductionSlider();
  getAllProducts();
});