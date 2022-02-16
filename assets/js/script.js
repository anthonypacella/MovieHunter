//CSS Formatting
const collapsibles = document.querySelectorAll(".collapsible");
collapsibles.forEach((item) =>
    item.addEventListener("click", function () {
        this.classList.toggle("collapsible--expanded");
    })
);

//Obtain the 4 most popular movies from the MovieDB api in the year of 2021
function getPopularMovie() {
    var requestUrl='https://api.themoviedb.org/3/trending/movie/week?api_key=67ee7262b46b2cfedff77e6b877aac65';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var i=0;
            while (i<4) {
                if (data.results[i].title.length<50) {
                    var image = $('<img></img>')
                        .attr('src', 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/'+data.results[i].poster_path)
                        .addClass('col-3 popular-movie')
                        .val(data.results[i].title);;
                    $('#image-container').append(image);
                    var title = $('<h4></h4>').text(data.results[i].title).addClass('col-3').css('text-align', 'center');
                    $('#title-container').append(title);
                    i++;
                }
            }
        })
}

getPopularMovie();

//Save user search to local storage for revisiting purposes
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

//Generate clickable buttons based on search history
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

//When the website is ready, search history buttons will show up
$(document).ready(function() {
    showSearches();
});

//When user clicks the search button with a valid query, he/she will be redirected to the movie info page
$('#search-button').on("click", function(event) {
    event.preventDefault();
    if ($('#search-input').val().length !== 0) {
        saveSearches();
        window.location = './movieinfo.html';
    } else {
        alert("Please put in a movie name :)");
    }
});

//When user clicks the history search button, he/she will be redirected to the movie info page as well
$('#last-search-container').on('click', '.history-button', function(event){
    localStorage.setItem('searchWord', event.target.value);
    window.location = './movieinfo.html';
});

//When the user clicks the popular movie poster, he/she will be redirected to the movie info page as well
$('#image-container').on('click', '.popular-movie', function(event) {
    localStorage.setItem('searchWord', event.target.value);
    window.location = './movieinfo.html';
});

//When the movie info page is ready, it will show the relevant movie information page by accessing local storage stored query
$(document).ready(function() {
    getMovieInfo(localStorage.getItem('searchWord'));
})

//This is the primary function that generates the movie information on the page
function getMovieInfo(name) {
    var requestUrl='https://api.themoviedb.org/3/search/movie?api_key=67ee7262b46b2cfedff77e6b877aac65&language=en-US&query='+name+'&page=1';
    fetch(requestUrl) 
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //get movie rating
            var num = parseInt(data.results[0].vote_average)*0.5;
            console.log(num);
            for(var i=0; i<num; i++) {
                var id = '#star'+i;
                $(id).addClass('fas').removeClass('far');
            }
            //save unique movie id to local storage to avoid pending promises
            localStorage.setItem('movieID', data.results[0].id);
            var releaseDate = data.results[0].release_date;
            var releaseYear = releaseDate.substring(0,4);
            var releaseMonth = releaseDate.substring(5,7);
            var releaseDay = releaseDate.substring(8,10);
            //fetch movie title from api
            $('#movie-title-text').text(data.results[0].title);
            //fetch movie poster from api
            $('#movie-poster-image')
                .attr({
                    'src': 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2/'+data.results[0].backdrop_path,
                    'alt': data.results[0].title
                });
            getMovieTrailer();
            getWatchProvider();
            //fetch the overview of the plot for the movie from api
            $('#movie-summary').text(data.results[0].overview);
            printMovieGenre(data.results[0].genre_ids);
            //fetch released date from api
            $('#movie-date').text(releaseMonth + "-" + releaseDay + "-" + releaseYear);
            getMovieCast();
            printMovieGenre(data.results[0].genre_ids);
            getMovieReview();
            getRecommendation();
        })
}
//get the movie trailer from youtube; information comes from MovieDB
function getMovieTrailer(){
    var id = localStorage.getItem('movieID');
    var requestUrl='https://api.themoviedb.org/3/movie/'+id+'/videos?api_key=67ee7262b46b2cfedff77e6b877aac65';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var i=0;
            while(i<1&&data.results[i].official) {
                $('#movie-trailer').attr('src', 'https://www.youtube.com/embed/'+data.results[i].key);
                i++;
            }   
        })
}

//get the avialble watch provider for the user to buy and rend the movie. Display based on the priority given by MovieDB api
function getWatchProvider() {
    var id = localStorage.getItem('movieID');
    var requestUrl='https://api.themoviedb.org/3/movie/'+id+'/watch/providers?api_key=67ee7262b46b2cfedff77e6b877aac65';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
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

//Use an object to conver movie genre id to words and display on the screen
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

//fetch the first five of the cast from api
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

//fecth the first review of the movie from the api; if there is no reviews, show an error message
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

//fetch similar moviees for users to click and review
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

//Shows the most popular movies among different periods of time from the IMDB api
var top250URL = "https://imdb-api.com/en/API/Top250Movies/k_4s3kqyy2";
var mostPopularMoviesURL = "https://imdb-api.com/en/API/MostPopularMovies/k_4s3kqyy2";
var boxOfficeAllTimeURL = "https://imdb-api.com/en/API/BoxOfficeAllTime/k_4s3kqyy2";

//Declare query selectors
var top250ListEl = document.querySelector("#top250list");
var mostPopularListEl = document.querySelector("#mostPopularlist");
var boxOfficeListEl = document.querySelector("#boxOfficelist");

//Dclare event listeners
top250ListEl.addEventListener("click",saveSearchWord);
mostPopularListEl.addEventListener("click",saveSearchWord);
boxOfficeListEl.addEventListener("click",saveSearchWord);

//Fetch from the IMDB api accordingly
fetch (top250URL)
    .then (function(response) {
        return response.json();
    })
    .then (function(data) {
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

//Redirect to movie info page if user clicks on the top movies
function saveSearchWord(event) {
    var movieClicked = event.target.textContent;
    localStorage.setItem("searchWord",movieClicked);
}