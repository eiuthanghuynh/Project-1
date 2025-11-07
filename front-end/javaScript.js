let listPizza = [
    {
        "ImageURL": "https://img.dominos.vn/phan-biet-pizza-kieu-my-va-kieu-y-3.jpg",
        "Title": "Pizza Hải Sản",
        "Price": "150.000₫"
    },
    {
        "ImageURL": "https://img.dominos.vn/phan-biet-pizza-kieu-my-va-kieu-y-3.jpg",
        "Title": "Pizza Thịt Bò",
        "Price": "130.000₫"
    },
    {
        "ImageURL": "https://img.dominos.vn/phan-biet-pizza-kieu-my-va-kieu-y-3.jpg",
        "Title": "Pizza Gà BBQ",
        "Price": "140.000₫"
    },
    {
        "ImageURL": "https://img.dominos.vn/phan-biet-pizza-kieu-my-va-kieu-y-3.jpg",
        "Title": "Pizza Chay",
        "Price": "120.000₫"
    },
]

let listBurrito = [
    {
        "ImageURL": "https://upload.wikimedia.org/wikipedia/commons/6/60/Burrito.JPG",
        "Title": "Burrito Hải Sản",
        "Price": "150.000₫"
    },
    {
        "ImageURL": "https://upload.wikimedia.org/wikipedia/commons/6/60/Burrito.JPG",
        "Title": "Burrito Thịt Xông Khói",
        "Price": "120.000₫"
    },
    {
        "ImageURL": "https://upload.wikimedia.org/wikipedia/commons/6/60/Burrito.JPG",
        "Title": "Burrito Kiểu Mỹ",
        "Price": "120.000₫"
    },
    {
        "ImageURL": "https://upload.wikimedia.org/wikipedia/commons/6/60/Burrito.JPG",
        "Title": "Burrito Chay",
        "Price": "110.000₫"
    },
]

let listHamburger = [
    {
        "ImageURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-wHfMDdM8tQwZ9s0JNbEAK3YeUedPxpgXLNoQkJ05aeVQlcmpdMl_0dgc0SDGZMuzvfA&usqp=CAU",
        "Title": "Hamburger Bò",
        "Price": "50.000₫"
    },
    {
        "ImageURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-wHfMDdM8tQwZ9s0JNbEAK3YeUedPxpgXLNoQkJ05aeVQlcmpdMl_0dgc0SDGZMuzvfA&usqp=CAU",
        "Title": "Hamburger Gà",
        "Price": "50.000₫"
    },
    {
        "ImageURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-wHfMDdM8tQwZ9s0JNbEAK3YeUedPxpgXLNoQkJ05aeVQlcmpdMl_0dgc0SDGZMuzvfA&usqp=CAU",
        "Title": "Hamburger Tôm",
        "Price": "60.000₫"
    },
    {
        "ImageURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-wHfMDdM8tQwZ9s0JNbEAK3YeUedPxpgXLNoQkJ05aeVQlcmpdMl_0dgc0SDGZMuzvfA&usqp=CAU",
        "Title": "Hamburger Ba Tầng",
        "Price": "80.000₫"
    },
]

function printPizza() {
    let pizzaItem = "<h2>Pizza</h2>";
    for (const item of listPizza) {
        pizzaItem += 
            `<div class="col-md-3">
              <div class="food-item">
                <img src="${item.ImageURL}">
                <h3>${item.Title}</h3>
                <p class="price">${item.Price}</p>
              </div>
            </div>`;
    }
    $("#pizza").html(pizzaItem);
}

function printBurrito() {
    let burritoItem = "<h2>Burrito</h2>";
    for (const item of listBurrito) {
        burritoItem += 
            `<div class="col-md-3">
              <div class="food-item">
                <img src="${item.ImageURL}">
                <h3>${item.Title}</h3>
                <p class="price">${item.Price}</p>
              </div>
            </div>`;
    }
    $("#burrito").html(burritoItem);
}

function printHamburger() {
    let hamburgerItem = "<h2>Hamburger</h2>";
    for (const item of listHamburger) {
        hamburgerItem += 
            `<div class="col-md-3">
              <div class="food-item">
                <img src="${item.ImageURL}">
                <h3>${item.Title}</h3>
                <p class="price">${item.Price}</p>
              </div>
            </div>`;
    }
    $("#hamburger").html(hamburgerItem);
}

printPizza();
printBurrito();
printHamburger();