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
          <a href=""><img src=${link} class="d-block w-100" alt="..."></a>
       </div>`;
        i++;
    }
    $("#intro").html(introArr);
}

let allProducts = [];
const itemsPerPage = 4;

function fetchAndPrintAllProducts() {
    $.ajax({
        url: "/fastfeast/api/combos",
        method: "GET",
        dataType: "json",
        success: function (data) {
            allProducts = data;
            renderCarousel();
        },
        error: function (xhr) {
            console.error("Lỗi khi lấy dữ liệu:", xhr.responseText);
            $("#list-combo").html("<p class='text-center text-danger'>Không thể tải danh sách sản phẩm.</p>");
        }
    });
}

function renderCarousel() {
    if (!allProducts || allProducts.length === 0) return;

    const totalSlides = Math.ceil(allProducts.length / itemsPerPage);

    let indicatorsHtml = '';
    let innerHtml = '';

    for (let slideIndex = 0; slideIndex < totalSlides; slideIndex++) {
        let isActive = slideIndex === 0 ? "active" : "";

        indicatorsHtml += `
            <button type="button" data-bs-target="#menuCarousel" data-bs-slide-to="${slideIndex}" 
                    class="${isActive}" aria-current="${isActive ? 'true' : 'false'}" 
                    aria-label="Slide ${slideIndex + 1}" style="background-color: #dc3545;"></button>`;

        innerHtml += `<div class="carousel-item ${isActive}"><div class="row">`;

        let startIndex = slideIndex * itemsPerPage;
        for (let i = 0; i < itemsPerPage; i++) {
            let itemIndex = (startIndex + i) % allProducts.length;
            let item = allProducts[itemIndex];

            let price = Number(item.price);
            let id = item.combo_id || item.product_id;
            let name = item.combo_name || item.product_name;
            let description = item.combo_description || item.product_description || "";
            let imgUrl = item.image_url || "./assets/default-img.png";

            innerHtml += `
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

        innerHtml += `</div></div>`;
    }

    let carouselHtml = `
        <div id="menuCarousel" class="carousel slide" data-bs-interval="false">
            <div class="carousel-inner px-5 pb-4">
                ${innerHtml}
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#menuCarousel" data-bs-slide="prev" style="width: 5%; left: -20px;">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>

            <button class="carousel-control-next" type="button" data-bs-target="#menuCarousel" data-bs-slide="next" style="width: 5%; right: -20px;">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>

            <div class="carousel-indicators" style="bottom: -15px;">
                ${indicatorsHtml}
            </div>
        </div>
    `;

    $("#list-combo").html(carouselHtml);
}

$(document).on("click", ".combo", function () {
    if (document.getElementById("foodForm")) {
        document.getElementById("foodForm").reset();
    }
    $("#only-pizza").html("");
    $(".foodQty").val(1);

    let id = $(this).attr("data-id");
    let title = $(this).attr("data-title");
    let price = $(this).attr("data-price");
    let img = $(this).attr("data-img");
    let description = $(this).attr("data-description");
    let targetModal;
    let targetDataElement;

    if ($("#comboModal").length > 0) {
        targetModal = $("#comboModal");
        targetDataElement = $("#comboModal .modal-content");
    } else if ($("#foodModal").length > 0) {
        targetModal = $("#foodModal");
        targetDataElement = $("#foodModal");
    } else {
        console.error("Lỗi: Không tìm thấy popup Modal nào trên trang này!");
        return;
    }
    targetDataElement.attr("data-id", id);
    targetDataElement.attr("data-title", title);
    targetDataElement.attr("data-price", price);
    targetDataElement.attr("data-img", img);
    targetDataElement.attr("data-description", description);

    $("#modalTitle").text(title);
    if (typeof formatPrice === "function") {
        $("#modalPrice").text(formatPrice(Number(price)));
    } else {
        $("#modalPrice").text(price);
    }
    $("#modalImg").attr("src", img);
    $("#modalDescription").text(description);

    targetModal.modal("show");
});

function formatPrice(price) {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

$(document).ready(function () {
    printIntroductionSlider();
    fetchAndPrintAllProducts();
});