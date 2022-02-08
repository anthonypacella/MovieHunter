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
                if(data.results[i].overview !== "") {
                    var title = $('<p></p>').text('Title: ' + data.results[i].title);
                    var overview = $('<p></p>').text('Overview: ' + data.results[i].overview);
                    var card = $('<div></div>').addClass('card col-3');
                    card.append(title, overview);
                $('#popular-container').append(card).addClass('row');
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
            var lastSearch = $('<button></button>').text(searches[i].query);
            $('#last-search-container').append(lastSearch);
        }
    }
}

$(document).ready(function() {
    showSearches();
});

$('#search-button').on("click", function(event) {
    event.preventDefault();
    saveSearches();
    showSearches();
});