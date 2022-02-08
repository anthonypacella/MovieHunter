var top250URL = "https://imdb-api.com/en/API/Top250Movies/k_4s3kqyy2";
var top250ListEl = document.querySelector("#top250List");
var mostPopularListEl = document.querySelector("#mostPopularList");
var boxOfficeListEl = document.querySelector("#boxOfficeList");

const collapsibles = document.querySelectorAll(".collapsible");
collapsibles.forEach((item) =>
  item.addEventListener("click", function () {
    this.classList.toggle("collapsible--expanded");
  })
);


fetch (top250URL)
    .then (function(response) {

        return response.json();
    })
    .then (function(data) {

        // console.log(data);

        for (var i = 0; i<250; i++) {

            var newListItemEl = document.createElement("li");
            var newListItem = data.items[i].fullTitle;

            newListItemEl.textContent = newListItem;
            newListItemEl.setAttribute("style", "text-decoration: underline; color: blue");
            newListItemEl.setAttribute("class", "listItem");

            top250ListEl.append(newListItemEl);
        
        }

        top250ListEl.addEventListener("click", findtop250Movie);

        function findtop250Movie (event) {

            console.log(event.target.textContent);

        }


    })


var mostPopularMoviesURL = "https://imdb-api.com/en/API/MostPopularMovies/k_4s3kqyy2";

fetch (mostPopularMoviesURL)
    .then (function(response) {

        return response.json();

    })

    .then (function(data){

        for (var i = 0; i<100; i++) {

            var newListItemEl = document.createElement("li");
            var newListItem = data.items[i].fullTitle;
            newListItemEl.textContent = newListItem;
            newListItemEl.setAttribute("style", "text-decoration: underline; color: blue");

            mostPopularListEl.append(newListItemEl);
        
        }
    })

var boxOfficeAllTimeURL = "https://imdb-api.com/en/API/BoxOfficeAllTime/k_4s3kqyy2"

fetch (boxOfficeAllTimeURL)
    .then (function(response){

        return response.json();

    })

    .then (function(data) {

        for (var i = 0; i<100; i++) {

            var newListItemEl = document.createElement("li");
            var newListItem = data.items[i].title;
            newListItemEl.textContent = newListItem;
            newListItemEl.setAttribute("style", "text-decoration: underline; color: blue");

            boxOfficeListEl.append(newListItemEl);
        
        }

    })

