window.onload = () => {
  setTimeout(() => {
    var header = document.querySelector(".header");
    header.style.height = "100%";
  }, 3000);
};

getData1 = async (page) => {
  let jsonData = await fetch(
    `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`
  );
  let data = await jsonData.json();
  return data;
};

async function fetchApi2(slug) {
  let dataJson = await fetch(`https://ophim1.com/phim/${slug}`);
  let data = await dataJson.json();
  return data;
}

var page = 1;
function dataApi2() {
  return new Promise((resolve, reject) => {
    getData1(page)
      .then((result) => {
        let items = result.items;
        let allData = [];
        items.forEach((items) => {
          slug = items.slug;
          let aData = fetchApi2(slug)
            .then((data2) => {
              return data2;
            })
            .catch((error) => {
              throw error;
            });
          allData.push(aData);
        });
        Promise.all(allData).then((data) => {
          resolve(data);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function Render() {
  dataApi2().then((data) => {
    var phimHan = data.find((phim) => {
      return phim.movie.name == "Cô Đi Mà Lấy Chồng Tôi";
    });
    // In ra tập phim
    if (phimHan !== undefined) {
      var movieLink = phimHan.episodes[0].server_data;
      var pageBox = document.querySelector(".episodes");

      movieLink.forEach((link, index) => {
        var page = document.createElement("a");
        page.classList.add("button");
        page.href = "#!";
        page.innerHTML = `Tập ${index + 1}`;
        pageBox.appendChild(page);
        // chạy tập phim được chọn
        page.onclick = () => {
          var screen = document.querySelector(".screen");
          screen.src = link.link_embed;
        };
      });
    } else {
      var pageBox = document.querySelector(".episodes");
      pageBox.innerText = "Không tìm thấy dữ liệu phim!";
    }
  });
}

Render();

// Thay đổi dữ liệu page để tìm film
function findFilm() {
  page++;
  var pageBox = document.querySelector(".episodes");
  pageBox.innerText = "";
  Render();
}
