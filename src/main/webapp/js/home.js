let linkIntroductionSliders = [
  "./assets/combo/combo-mung-khai-truong.png",
  "./assets/combo/combo-buoi-trua-vui-ve.png",
  "./assets/combo/combo-sieu-tiet-kiem.png",
  "./assets/combo/burger.png",
  "./assets.combo/burrito.png",
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