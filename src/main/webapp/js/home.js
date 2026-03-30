let linkIntroductionSliders = [
  "./assets/combo/combo-mung-khai-truong.png",
  "./assets/combo/combo-buoi-trua-vui-ve.png",
  "./assets/combo/combo-sieu-tiet-kiem.png",
  "./assets/combo/burger.png",
  "./assets/combo/burrito.png",
]

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

printIntroductionSlider();

bestFoodArr = [
  {
    "product_id": "P00001",
    "product_name": "Pizza",
    "product_description": "sdfdsfsdfdsf",
    "price": 189000,
    "image_url": "./assets/product/0002211_tropical-sf-test_300.png",
  },
  {
    "product_id": "P00001",
    "product_name": "Pizza",
    "product_description": "sdfdsfsdfdsf",
    "price": 189000,
    "image_url": "./assets/product/0002211_tropical-sf-test_300.png",
  },
  {
    "product_id": "P00001",
    "product_name": "Pizza",
    "product_description": "sdfdsfsdfdsf",
    "price": 189000,
    "image_url": "./assets/product/0002211_tropical-sf-test_300.png",
  },
  {
    "product_id": "P00001",
    "product_name": "Pizza",
    "product_description": "sdfdsfsdfdsf",
    "price": 189000,
    "image_url": "./assets/product/0002211_tropical-sf-test_300.png",
  },
]

bestComboArr = [
  {
    "product_id": "C1",
    "product_name": "Combo Mừng Khai Trương",
    "product_description": "1 Pizza Hải Sản Nhiệt Đới, 1 Burger Cheese và 1 ly Coca Cola",
    "price": 249000,
    "image_url": "./assets/combo/2.png",
  },
  {
    "product_id": "C1",
    "product_name": "Combo Mừng Khai Trương",
    "product_description": "1 Pizza Hải Sản Nhiệt Đới, 1 Burger Cheese và 1 ly Coca Cola",
    "price": 249000,
    "image_url": "./assets/combo/2.png",
  },
]
function formatPrice(price) {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
printProduct(bestFoodArr, "#best-seller");
printCombo(bestComboArr, "#best-combo");