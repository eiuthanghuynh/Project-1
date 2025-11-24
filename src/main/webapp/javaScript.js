async function getAllProducts() {
  const url = "http://localhost:8080/fastfeast/ProductServlet";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    let listPizza = result.filter(p => p.category_id === 'CA01');
    let listHamburger = result.filter(p => p.category_id === 'CA02');
    let listBurrito = result.filter(p => p.category_id === 'CA03');

    printProduct(listPizza, "#pizza");
    printProduct(listBurrito, "#burrito");
    printProduct(listHamburger, "#hamburger");

    attachFoodEvents();
  } catch (error) {
    console.error(error.message);
  }
}

let linkIntroductionSliders = [
  "./assets/Banner1.png",
  "./assets/1.png",
  "./assets/2.png"
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
      `<div class="carousel-item active ${i === 1 ? "active" : ""}">
                <a href=""><img src=${link} class="d-block w-100"
                    alt="..."></a>
              </div>`;
    i++;
  }
  $("#intro").html(introArr);
}

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
$(document).on("click", ".btn-plus", function () {
  let input = $(this).siblings(".foodQty");
  let val = parseInt(input.val()) || 1;
  input.val(val + 1);
});

$(document).on("click", ".btn-minus", function () {
  let input = $(this).siblings(".foodQty");
  let val = parseInt(input.val()) || 1;

  if (val > 1) input.val(val - 1);
});

$("#close").on("click", function () {
  $("#foodModal").modal("hide");;
});

document.addEventListener("DOMContentLoaded", function () {
  printIntroductionSlider()
  getAllProducts();
});