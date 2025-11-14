let listPizza = [
  {
    "ImageURL": "./Resources for project/0002212_sf-cocktail-test_300.png",
    "Title": "Pizza Hải Sản Cocktail",
    "Price": "150.000₫"
  },
  {
    "ImageURL": "./Resources for project/0002214_sf-deluxe_300.png",
    "Title": "Pizza Hải Sản Cao Cấp",
    "Price": "130.000₫"
  },
  {
    "ImageURL": "./Resources for project/0002211_tropical-sf-test_300.png",
    "Title": "Pizza Hải Sản Nhiệt Đới",
    "Price": "140.000₫"
  },
  {
    "ImageURL": "./Resources for project/0002216_shrimp-ctl-test_300.png",
    "Title": "Pizza Tôm Cocktail",
    "Price": "120.000₫"
  },
  {
    "ImageURL": "./Resources for project/0003536_aloha_300.png",
    "Title": "Pizza Thịt Nguội Xúc Xích",
    "Price": "130.000₫"
  },
  {
    "ImageURL": "./Resources for project/0002221_bacon-sup_300.png",
    "Title": "Pizza Thịt Xông Khói Đặc Biệt",
    "Price": "120.000₫"
  },
  {
    "ImageURL": "./Resources for project/0002222_ca-bacon_300.png",
    "Title": "Pizza Thịt Nguội Kiểu Canada",
    "Price": "140.000₫"
  },
  {
    "ImageURL": "./Resources for project/0002223_ck-trio_300.png",
    "Title": "Pizza Gà Nướng 3 Vị",
    "Price": "150.000₫"
  },
  {
    "ImageURL": "./Resources for project/0002227_h-m_300.png",
    "Title": "Pizza Thịt Nguội & Nấm",
    "Price": "150.000₫"
  },
  {
    "ImageURL": "./Resources for project/0002219_meat-deluxe_300.png",
    "Title": "Pizza 5 Loại Thịt Đặc Biệt",
    "Price": "150.000₫"
  },
]

let listBurrito = [
  {
    "ImageURL": "./Resources for project/burrito-nhan-thit-bo-bam.jpg",
    "Title": "Burrito Bò Bằm Sốt Tiêu Đen",
    "Price": "80.000₫"
  },
  {
    "ImageURL": "./Resources for project/ff90e9e630c4346d8699398cbb2da4bd.jpg",
    "Title": "Burrito Bò Nướng BBQ Hàn Quốc",
    "Price": "100.000₫"
  },
  {
    "ImageURL": "./Resources for project/3de7660996a24057fb50f57b3e0b1f16.jpg",
    "Title": "Burrito Gà Nướng BBQ",
    "Price": "100.000₫"
  },
  {
    "ImageURL": "./Resources for project/4ee8be68a07f7eecfa0d3f96788069b4.jpg",
    "Title": "Burrito Tôm Sốt Cay",
    "Price": "80.000₫"
  },
]

let listHamburger = [
  {
    "ImageURL": "./Resources for project/burger_double_double.jpg",
    "Title": "Burger Double Double",
    "Price": "80.000₫"
  },
  {
    "ImageURL": "./Resources for project/burger_lchicken.jpg",
    "Title": "Burger Chicken",
    "Price": "50.000₫"
  },
  {
    "ImageURL": "./Resources for project/burger_mozzarella.jpg",
    "Title": "Burger Mozzarella",
    "Price": "60.000₫"
  },
  {
    "ImageURL": "./Resources for project/burger_ph_mai_1.jpg",
    "Title": "Cheese Burger",
    "Price": "50.000₫"
  },
  {
    "ImageURL": "./Resources for project/burger_ramen.jpg",
    "Title": "Burger Ramen",
    "Price": "80.000₫"
  },
  {
    "ImageURL": "./Resources for project/burger_t_m.jpg",
    "Title": "Shrimp Burger",
    "Price": "60.000₫"
  },
  {
    "ImageURL": "./Resources for project/burger_b_teriyaki.jpg",
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
              <div class="food-item">
                <img src="${item.ImageURL}">
                <h3>${item.Title}</h3>
                <p class="price">${item.Price}</p>
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
                <h3>${item.Title}</h3>
                <p class="price">${item.Price}</p>
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
                <h3>${item.Title}</h3>
                <p class="price">${item.Price}</p>
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
document.addEventListener("DOMContentLoaded", function () {
  printIntroductionSlider()
  printPizza();
  printBurrito();
  printHamburger();
});