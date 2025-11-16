async function getAllProducts() {
  const url = "http://localhost:8080/fastfood-backend/ProductServlet";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result); // Thay đổi ở đây sau này
  } catch (error) {
    console.error(error.message);
  }
}

let listPizza = [
  {
    "ImageURL": ".access/product/0002212_sf-cocktail-test_300.png",
    "Title": "Pizza Hải Sản Cocktail",
    "Price": "150.000₫"
  },
  {
    "ImageURL": ".access/product/0002214_sf-deluxe_300.png",
    "Title": "Pizza Hải Sản Cao Cấp",
    "Price": "130.000₫"
  },
  {
    "ImageURL": ".access/product/0002211_tropical-sf-test_300.png",
    "Title": "Pizza Hải Sản Nhiệt Đới",
    "Price": "140.000₫"
  },
  {
    "ImageURL": ".access/product/0002216_shrimp-ctl-test_300.png",
    "Title": "Pizza Tôm Cocktail",
    "Price": "120.000₫"
  },
  {
    "ImageURL": ".access/product/0003536_aloha_300.png",
    "Title": "Pizza Thịt Nguội Xúc Xích",
    "Price": "130.000₫"
  },
  {
    "ImageURL": ".access/product/0002221_bacon-sup_300.png",
    "Title": "Pizza Thịt Xông Khói Đặc Biệt",
    "Price": "120.000₫"
  },
  {
    "ImageURL": ".access/product/0002222_ca-bacon_300.png",
    "Title": "Pizza Thịt Nguội Kiểu Canada",
    "Price": "140.000₫"
  },
  {
    "ImageURL": ".access/product/0002223_ck-trio_300.png",
    "Title": "Pizza Gà Nướng 3 Vị",
    "Price": "150.000₫"
  },
  {
    "ImageURL": ".access/product/0002227_h-m_300.png",
    "Title": "Pizza Thịt Nguội & Nấm",
    "Price": "150.000₫"
  },
  {
    "ImageURL": ".access/product/0002219_meat-deluxe_300.png",
    "Title": "Pizza 5 Loại Thịt Đặc Biệt",
    "Price": "150.000₫"
  },
]

let listBurrito = [
  {
    "ImageURL": ".access/product/burrito-nhan-thit-bo-bam.jpg",
    "Title": "Burrito Bò Bằm Sốt Tiêu Đen",
    "Price": "80.000₫"
  },
  {
    "ImageURL": ".access/product/ff90e9e630c4346d8699398cbb2da4bd.jpg",
    "Title": "Burrito Bò Nướng BBQ Hàn Quốc",
    "Price": "100.000₫"
  },
  {
    "ImageURL": ".access/product/3de7660996a24057fb50f57b3e0b1f16.jpg",
    "Title": "Burrito Gà Nướng BBQ",
    "Price": "100.000₫"
  },
  {
    "ImageURL": ".access/product/4ee8be68a07f7eecfa0d3f96788069b4.jpg",
    "Title": "Burrito Tôm Sốt Cay",
    "Price": "80.000₫"
  },
]

let listHamburger = [
  {
    "ImageURL": ".access/product/burger_double_double.jpg",
    "Title": "Burger Double Double",
    "Price": "80.000₫"
  },
  {
    "ImageURL": ".access/product/burger_lchicken.jpg",
    "Title": "Burger Chicken",
    "Price": "50.000₫"
  },
  {
    "ImageURL": ".access/product/burger_mozzarella.jpg",
    "Title": "Burger Mozzarella",
    "Price": "60.000₫"
  },
  {
    "ImageURL": ".access/product/burger_ph_mai_1.jpg",
    "Title": "Cheese Burger",
    "Price": "50.000₫"
  },
  {
    "ImageURL": ".access/product/burger_ramen.jpg",
    "Title": "Burger Ramen",
    "Price": "80.000₫"
  },
  {
    "ImageURL": ".access/product/burger_t_m.jpg",
    "Title": "Shrimp Burger",
    "Price": "60.000₫"
  },
  {
    "ImageURL": ".access/product/burger_b_teriyaki.jpg",
    "Title": "Beef teriyaki Burger",
    "Price": "80.000₫"
  },
]
let linkIntroductionSliders = [
  "./access/Banner1.png",
  "./access/1.png",
  "./access/2.png"
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

function printPizza() {
  let pizzaItem = ``;
  let i = 1;
  let n = calcLoop(listPizza);
  for (let a = 0; a < n; a++) {
    for (const item of listPizza) {
      if (i % 4 == 1) {
        pizzaItem += `<div class="carousel-item ${i === 1 ? "active" : ""}">
                      <div class="row g-4">`;
      }
      pizzaItem +=
        `<div class="col-md-3">
              <div class="food-item" id="pizza-${i}">
                <img src="${item.ImageURL}">
                <h3 class="food-title">${item.Title}</h3>
                <p class="food-price">${item.Price}</p>
              </div>
        </div>`;
      if (i % 4 == 0) {
        pizzaItem += `</div></div>`;
      }
      i++;
    }
  }
  $("#pizza").html(pizzaItem);
}

function printBurrito() {
  let burritoItem = ``;
  let i = 1;
  let n = calcLoop(listBurrito);
  for (let a = 0; a < n; a++) {
    for (const item of listBurrito) {
      if (i % 4 == 1) {
        burritoItem += `<div class="carousel-item ${i === 1 ? "active" : ""}">
                      <div class="row g-4">`;
      }
      burritoItem +=
        `<div class="col-md-3">
              <div class="food-item">
                <img src="${item.ImageURL}">
                <h3 class="food-title">${item.Title}</h3>
                <p class="food-price">${item.Price}</p>
              </div>
        </div>`;
      if (i % 4 == 0) {
        burritoItem += `</div></div>`;
      }
      i++;
    }
  }
  $("#burrito").html(burritoItem);
}

function printHamburger() {
  let hamburgerItem = ``;
  let i = 1;
  let n = calcLoop(listHamburger);
  for (let a = 0; a < n; a++) {
    for (const item of listHamburger) {
      if (i % 4 == 1) {
        hamburgerItem += `<div class="carousel-item ${i === 1 ? "active" : ""}">
                      <div class="row g-4">`;
      }
      hamburgerItem +=
        `<div class="col-md-3">
              <div class="food-item">
                <img src="${item.ImageURL}">
                <h3 class="food-title">${item.Title}</h3>
                <p class="food-price">${item.Price}</p>
              </div>
        </div>`;
      if (i % 4 == 0) {
        hamburgerItem += `</div></div>`;
      }
      i++;
    }
  }
  $("#hamburger").html(hamburgerItem);
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
      let title = $(this).find(".food-title").text();
      let price = $(this).find(".food-price").text();
      let img = $(this).find("img").attr("src");

      $("#modalTitle").text(title);
      $("#modalPrice").text(price);
      $("#modalImg").attr("src", img);

      $("#foodModal").modal("show");
    });
  });
}

$(document).ready(function () {

  // Nút cộng
  $(".btn-plus").click(function () {
    let input = $("#foodQty");
    let current = parseInt(input.val());
    input.val(current + 1);
  });

  // Nút trừ
  $(".btn-minus").click(function () {
    let input = $("#foodQty");
    let current = parseInt(input.val());

    if (current > 1) {
      input.val(current - 1);
    }
  });

});
document.addEventListener("DOMContentLoaded", function () {
  printIntroductionSlider()
  printPizza();
  printBurrito();
  printHamburger();
  attachFoodEvents();
});