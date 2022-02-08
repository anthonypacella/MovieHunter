const collapsibles = document.querySelectorAll(".collapsible");
collapsibles.forEach((item) =>
  item.addEventListener("click", function () {
    this.classList.toggle("collapsible--expanded");
  })
);

function getPopularMovie() {
    var requestUrl='https://api.themoviedb.org/3/discover/movie?primary_release_year=2021&sort_by=vote_average.desc&api_key=67ee7262b46b2cfedff77e6b877aac65';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
                for (var i=0; i<5; i++) {
                    if (data.results[i].title.length<20) {
                        var image = $('<img></img>').attr('src', 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/'+data.results[i].poster_path).addClass('col-3');
                        $('#image-container').append(image);
                        var title = $('<h4></h4>').text(data.results[i].title).addClass('col-3').css('text-align', 'center');
                        console.log(title.text().length);
                        $('#title-container').append(title);
                }
            }
        })
}
getPopularMovie();

function saveSearches() {
    var searches = {
        query: $('#search-input').val()
    };
    localStorage.setItem("searchQuery", JSON.stringify(searches));
    var searchesArr = [];
    searchesArr.push(searches);
    searchesArr = searchesArr.concat(JSON.parse(localStorage.getItem("searchesArr")||"[]"));
    localStorage.setItem("searchesArr", JSON.stringify(searchesArr));
}

function showSearches() {
    var searches = JSON.parse(localStorage.getItem('searchesArr'));
    if (searches !== null) {
        $('#last-search-container').empty();
        for (var i=0; i<searches.length && i<6; i++) {
            var lastSearch = $('<button></button>').text(searches[i].query).addClass('btn btn-dark');
            $('#last-search-container').append(lastSearch);
        }
    }
}

$(document).ready(function() {
    showSearches();
});

$('#search-button').on("click", function(event) {
    event.preventDefault();
    console.log($('#search-input').val().length)
    if ($('#search-input').val().length !== 0) {
        saveSearches();
    } else {
        alert("Please put in a movie name :)");
    }
    showSearches();
});