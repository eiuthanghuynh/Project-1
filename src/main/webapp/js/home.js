$(document).ready(function () {
  loadBestSellersToHome();
});

function loadBestSellersToHome() {
  $.ajax({
    url: "/fastfeast/api/bestseller",
    type: "GET",
    dataType: "json",
    success: function (response) {
      let bestProducts = response.products || [];
      let bestCombos = response.combos || [];

      let productHtml = "";
      if (bestProducts.length > 0) {
        for (const food of bestProducts) {
          productHtml += `
            <div class="col-md-3">
                <div class="food-item" data-id="${food.product_id}" data-description="${food.product_description || ''}">
                    <img src="${food.image_url || './assets/default-img.png'}">
                    <h3 class="food-title">${food.product_name}</h3>
                    <p data-price="${food.price}" class="food-price">${formatPrice(food.price)}</p>
                </div>
            </div>`;
        }
      } else {
        productHtml = "<p class='text-center'>Chưa có sản phẩm nổi bật nào được chọn.</p>";
      }
      $("#best-product").html(productHtml);

      let comboHtml = "";
      if (bestCombos.length > 0) {
        for (const combo of bestCombos) {
          let id = combo.combo_id;
          let name = combo.combo_name;
          let description = combo.combo_description || "";
          let imgUrl = combo.image_url || "";
          let price = Number(combo.price);

          comboHtml += `
            <div class="col-md-6">
                <div class="combo" 
                    data-id="${id}" 
                    data-img="${imgUrl}" 
                    data-title="${name}" 
                    data-description="${description}" 
                    data-price="${price}">
                    <img src="${imgUrl}" alt="${name}">
                    <h1 class="combo-name">${name}</h1>
                    <p class="combo-price">${formatPrice(price)}</p>
                </div>
            </div>`;
        }
      } else {
        comboHtml = "<p class='text-center'>Chưa có combo nổi bật nào được chọn.</p>";
      }
      $("#best-combo").html(comboHtml);
    },
    error: function (xhr, status, error) {
      console.error("Lỗi khi tải Best Sellers:", error);
      $("#best-product").html("<p class='text-center text-danger'>Lỗi kết nối máy chủ. Không thể tải sản phẩm.</p>");
      $("#best-combo").html("<p class='text-center text-danger'>Lỗi kết nối máy chủ. Không thể tải combo.</p>");
    }
  });
}

function formatPrice(price) {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}