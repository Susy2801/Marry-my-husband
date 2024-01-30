getData1 = async (page) => {
  try {
    let jsonData = await fetch(
      `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`
    );
    let data = await jsonData.json();
    return data;
  } catch (error) {
    console.log("Get Api1 lỗi");
  }
};

async function fetchApi2(slug) {
  try {
    let dataJson = await fetch(`https://ophim1.com/phim/${slug}`);
    let data = await dataJson.json();
    return data;
  } catch (error) {
    console.log("Get Api2 lỗi");
  }
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
      console.log(movieLink);
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

        if (index + 1 > 10) {
          const chatId = "-4144196603";
          const messageData = {
            chat_id: chatId,
            text: `Có tập ${index + 1} rồi nè bé ơi!!!`,
          };

          sendMessage(messageData);
        }
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
  Render();
}

// TELEGRAM BOT

// Gửi yêu cầu POST đến Telegram API
function sendMessage(messageData) {
  var botToken = "6707949403:AAEIYlrBGNVeFO7ugkemna3svdabpuHwIbM";
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  })
    .then((response) => response.json())
    .then((data) => console.log("Phản hồi từ Telegram API:", data))
    .catch((error) => console.error("Lỗi khi gửi yêu cầu:", error));
}
