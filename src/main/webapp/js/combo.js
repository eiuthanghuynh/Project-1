let cartItemArr = JSON.parse(localStorage.getItem("cart")) || [];

let comboArr = [
    {
        "product_id": "C1",
        "product_name": "Combo Mừng Khai Trương",
        "product_description": "1 Pizza Hải Sản Nhiệt Đới, 1 Burger Cheese và 1 ly Coca Cola",
        "price": 249000,
        "image_url": "./assets/Banner1.png",
    },
    {
        "product_id": "C2",
        "product_name": "Combo Buổi Trưa Hoàn Hảo",
        "product_description": "1 Burger Double và 1 ly Coca Cola",
        "price": 139000,
        "image_url": "./assets/1.png",
    },
    {
        "product_id": "C3",
        "product_name": "Combo Thứ 3 Vui Vẻ",
        "product_description": "1 Pizza Hải Sản Nhiệt Đới, 1 Burger Cheese và 1 ly Coca Cola",
        "price": 249000,
        "image_url": "./assets/120K.png",
    },

    {
        "product_id": "C4",
        "product_name": "Combo Siêu Tiết Kiệm",
        "product_description": "1 Miếng Pizza Thịt Nguội Xúc Xích, 1 Burrito Gà Giòn và 1 ly Trà Trái Cây",
        "price": 79000,
        "image_url": "./assets/bannercombo1.png",
    },
]

function printCombo() {
    $("#list-combo").html("");
    let str = "";
    for (const combo of comboArr) {
        let price = Number(combo.price)
        str +=
            `<div class="col-md-6">
                        <div class="combo" 
                            data-id="${combo.product_id}" 
                            data-img="${combo.image_url}" 
                            data-title="${combo.product_name}" 
                            data-description="${combo.product_description}" 
                            data-price="${combo.price}"
                        >
                            <img src="${combo.image_url}" alt="">
                            <h1 class="combo-name">${combo.product_name}</h1>
                            <p class="combo-price">${formatPrice(price)}</p>
                        </div>
            </div>`;
    }
    $("#list-combo").html(str);
}

printCombo();

function attachCombo() {
    document.querySelectorAll(".combo").forEach(combo => {
        combo.addEventListener("click", function () {
            let id = $(this).data("id");
            let title = $(this).data("title");
            let price = Number($(this).data("price"));
            let img = $(this).data("img");
            let description = $(this).data("description");
            $(".modal-content").data("id", id);
            $(".modal-content").data("title", title);
            $(".modal-content").data("price", price);
            $(".modal-content").data("img", img);
            $(".modal-content").data("description", description);
            $("#modalTitle").text(title);
            $("#modalPrice").data("price", price);
            $("#modalPrice").text(formatPrice(price));
            $("#modalImg").attr("src", img);
            $("#modalDescription").text(description);
            $("#comboModal").modal("show");
        })
    })
}

attachCombo();
