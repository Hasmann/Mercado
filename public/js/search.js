const search = document.querySelector(".searchButton");

search.addEventListener("click", function (e) {
  const input = document.querySelector(".navInput").value;

  const setTime = setTimeout(() => {
    window.location.href = `http://localhost:2007/Mercado/User/search/${input}?page=1`;
  }, 1000);
});
