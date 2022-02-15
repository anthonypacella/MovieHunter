//CSS Formatting for Richard
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
                for (var i=0; i<6; i++) {
                    if (data.results[i].title.length<20) {
                        var image = $('<img></img>').attr('src', 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/'+data.results[i].poster_path).addClass('col-3');
                        $('#image-container').append(image);
                        var title = $('<h4></h4>').text(data.results[i].title).addClass('col-3').css('text-align', 'center');
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
    localStorage.setItem('searchWord', $('#search-input').val());
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
            var lastSearch = $('<button></button>')
                .text(searches[i].query)
                .val(searches[i].query)
                .addClass('btn btn-dark history-button')
                .css({
                    'margin': '5px 10px'
                });
            $('#last-search-container').append(lastSearch).addClass('d-flex justify-content-center');
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
        window.location = './movieinfo.html';
    } else {
        alert("Please put in a movie name :)");
    }
});

$('#last-search-container').on('click', '.history-button', function(event){
    console.log(event.target.value);
    localStorage.setItem('searchWord', event.target.value);
    window.location = './movieinfo.html';
})

$(document).ready(function() {
    getMovieInfo(localStorage.getItem('searchWord'));
})

function getMovieInfo(name) {
    var requestUrl='https://api.themoviedb.org/3/search/movie?api_key=67ee7262b46b2cfedff77e6b877aac65&language=en-US&query='+name+'&page=1';
    fetch(requestUrl) 
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //Rate Movie
            var num = parseInt(data.results[0].vote_average)*0.5;
            console.log(num);
            for(var i=0; i<num; i++) {
                var id = '#star'+i;
                $(id).addClass('fas').removeClass('far');
            }
            
            console.log(data);
            localStorage.setItem('movieID', data.results[0].id);
            var releaseDate = data.results[0].release_date;
            var releaseYear = releaseDate.substring(0,4);
            var releaseMonth = releaseDate.substring(5,7);
            var releaseDay = releaseDate.substring(8,10);
            $('#movie-title-text').text(data.results[0].title);
            $('#movie-poster-image')
                .attr({
                    'src': 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/'+data.results[0].backdrop_path,
                    'alt': data.results[0].title
                });
            getWatchProvider();
            $('#movie-summary').text(data.results[0].overview);
            printMovieGenre(data.results[0].genre_ids);
            $('#movie-date').text(releaseMonth + "-" + releaseDay + "-" + releaseYear);
            getMovieCast();
            printMovieGenre(data.results[0].genre_ids);
            getMovieReview();
            getRecommendation();
        })
}


function getWatchProvider() {
    var id = localStorage.getItem('movieID');
    var requestUrl='https://api.themoviedb.org/3/movie/'+id+'/watch/providers?api_key=67ee7262b46b2cfedff77e6b877aac65';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var rent = data.results.US.rent[0].provider_name;
            var buy = data.results.US.buy[0].provider_name;
            localStorage.setItem('rentFrom', rent);
            localStorage.setItem('buyFrom', buy);
            var rentSrc = $('<span></span>').text('Rent from '+localStorage.getItem('rentFrom'));
            var rentImg = $('<img></img>')
                .attr({
                    'src': 'https://www.themoviedb.org/t/p/original'+data.results.US.rent[0].logo_path,
                    'alt': data.results.US.rent[0].provider_name})
                .css({
                    'width': '40px',
                    'border-radius': '10px',
                    'margin': '4px'
                });
            var buySrc = $('<span></span>').text(', Buy from ' + localStorage.getItem('buyFrom'));
            var buyImg = $('<img></img>')
                .attr({
                    'src': 'https://www.themoviedb.org/t/p/original'+data.results.US.buy[0].logo_path,
                    'alt': data.results.US.buy[0].provider_name})
                .css({
                    'width': '40px',
                    'border-radius': '10px',
                    'margin': '4px'
                });
            $('#streaming-platform-name').text('').append(rentSrc, rentImg, buySrc, buyImg);
        })
}

// function getMovieReview() {
//     var id = localStorage.getItem('movieID');
//     var requestUrl='https://api.themoviedb.org/3/movie/'+id+'/reviews?api_key=67ee7262b46b2cfedff77e6b877aac65';
//     fetch(requestUrl)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             console.log(data);
            
//             var reviewCount = data.results.length;
//             var randomNumber = Math.floor(Math.random() * reviewCount);

//             console.log(randomNumber);
//             console.log(data.results);
//             console.log(randomNumber);
//             $("#movie-review-author").text("Author: " + data.results[randomNumber].author);
//             $("#movie-review-content").text(data.results[randomNumber].content);
//             var releaseDate = data.results[0].updated_at;
//             var releaseYear = releaseDate.substring(0,4);
//             var releaseMonth = releaseDate.substring(5,7);
//             var releaseDay = releaseDate.substring(8,10);
//             $("#movie-review-date").text("Submitted: " + releaseMonth + "-" + releaseDay + "-" + releaseYear);
//         })
// }

function printMovieGenre(genreIds) {
    console.log('genreIds', genreIds);
    const genre = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western'
    }
    for (i=0; i<genreIds.length; i++) {
        var genreName = $('<span></span>').text(genre[genreIds[i]]+'; ');
        $('#movie-genre').text('').append(genreName);
    }
}

function getMovieCast(){
    var id = localStorage.getItem('movieID');
    var requestUrl='https://api.themoviedb.org/3/movie/'+id+'/credits?api_key=67ee7262b46b2cfedff77e6b877aac65&language=en-US';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var castList = $('<div></div>');
            for (var i=0; i<5 && data.cast.length; i++){
                var castName = $('<span></span>').text(data.cast[i].name+'; ');
                castList.append(castName);
            }
            $('#movie-cast').text('').append(castList);
        })
}
function getMovieReview(){
    var id = localStorage.getItem('movieID');
    var requestUrl = 'https://api.themoviedb.org/3/movie/'+id+'/reviews?api_key=67ee7262b46b2cfedff77e6b877aac65&language=en-US&page=1'
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            if (data.total_results===0) {
                $('#movie-review-author').text('No reviews available yet :(');
            } else {
                $('#movie-review-author').text(data.results[0].author_details.username).css('font-weight', 'bold');
                $('#movie-review-content').text(data.results[0].content.trim());
                $('#movie-review-date').text(data.results[0].created_at.substring(0, 10));
            }
        })
}

function getRecommendation() {
    var id = localStorage.getItem('movieID');
    var requestUrl='https://api.themoviedb.org/3/movie/'+id+'/recommendations?api_key=67ee7262b46b2cfedff77e6b877aac65&language=en-US&page=1';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        }) 
        .then(function (data) {
            console.log(data);
            for(var i=0; i<6; i++) {
                var poster = $('<img></img>')
                    .attr({
                        'src': 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/'+data.results[i].poster_path,
                        'alt': data.results[i].title,
                        'title': data.results[i].title
                    })
                    .addClass('col-2 poster')
                $('#recommendation-container').append(poster).addClass('row');
            }
        })
        $(document).on('click', '.poster', function(event){
            localStorage.setItem('searchWord', event.target.title);
            window.location.reload();
        });
}


var top250URL = "https://imdb-api.com/en/API/Top250Movies/k_4s3kqyy2";
var mostPopularMoviesURL = "https://imdb-api.com/en/API/MostPopularMovies/k_4s3kqyy2";
var boxOfficeAllTimeURL = "https://imdb-api.com/en/API/BoxOfficeAllTime/k_4s3kqyy2";

//query selector
var top250ListEl = document.querySelector("#top250list");
var mostPopularListEl = document.querySelector("#mostPopularlist");
var boxOfficeListEl = document.querySelector("#boxOfficelist");

//event listener
top250ListEl.addEventListener("click",saveSearchWord);
mostPopularListEl.addEventListener("click",saveSearchWord);
boxOfficeListEl.addEventListener("click",saveSearchWord);

//fetch
fetch (top250URL)
    .then (function(response) {
        return response.json();
    })
    .then (function(data) {
        console.log(data);
        for (var i = 0; i<250; i++) {
            var newListItemEl = document.createElement("li");
            var newListItem = data.items[i].title;
            newListItemEl.innerHTML = "<a href='movieinfo.html'>" + newListItem + "</a>";
            newListItemEl.setAttribute("class", "listItem");
            top250ListEl.append(newListItemEl);
        }
    })

fetch (mostPopularMoviesURL)
    .then (function(response) {
        return response.json();
    })

    .then (function(data){
        for (var i = 0; i<100; i++) {
            var newListItemEl = document.createElement("li");
            var newListItem = data.items[i].title;
            newListItemEl.innerHTML = "<a href='movieinfo.html'>" + newListItem + "</a>";
            mostPopularListEl.append(newListItemEl);
        }
    })

fetch (boxOfficeAllTimeURL)
    .then (function(response){
        return response.json();
    })

    .then (function(data) {
        for (var i = 0; i<100; i++) {
            var newListItemEl = document.createElement("li");
            var newListItem = data.items[i].title;
            newListItemEl.innerHTML = "<a href='movieinfo.html'>" + newListItem + "</a>";
            boxOfficeListEl.append(newListItemEl);
        }
    })

//functions
function saveSearchWord(event) {

    var movieClicked = event.target.textContent;
    localStorage.setItem("searchWord",movieClicked);

}