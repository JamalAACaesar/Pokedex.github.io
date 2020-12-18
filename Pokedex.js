// POKEDEX 
// Below would be the Outline for the Pokedex itself, it has the
// Main screen, the pokemon's name, their height, weight and type of what they are
// Each pokemon would be listed on the left side showing their front and back
// WHile on the right side it has buttons for previous page or next page
// So that the user can choose whatever pokemon they would like to see
// Or not know of and see what type of pokemon they would be.
// As you can see below, there are the document query selectors


var mainScreen = document.querySelector('.main-screen');
var pokeName = document.querySelector('.poke-name');
var pokeID = document.querySelector('.poke-id');
var pokeFrontImage = document.querySelector('.poke-front-image');
var pokeeBackImage = document.querySelector('.poke-back-image');
var pokeTypeOne = document.querySelector('.poke-type-one');
var pokeTypeTwo = document.querySelector('.poke-type-two');
var pokeWeight = document.querySelector('.poke-weight');
var PokeHeight = document.querySelector('.poke-height');
var pokeListItems = document.querySelectorAll('.list-item');
var leftButton = document.querySelector('.left-button')
var rightButton = document.querySelector('.right-button')

// Below here would be the array to show the types of pokemon there would be within
// The pokedex whilist using the api. It makes it a tad-bit easier to hide the types 
// If they were there before on th left screen.
var Elements = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];
// This below would be the buttons for the right side, if the previous has no other options before it,
// The code would prevent it from going backwards if it was null.
// Therefore it would go onto the next page to show the other 20 pokemon in the list on the right side.

var previousURL = null;
var nextURL = null;


// THese below are functions sorted for the pokedex

// The first function is the capitalization function
// It will capitalize each starting of the strings for the names of the pokemon and types

var Capitalize = (str) => str[0].toUpperCase() + str.substr(1);

// This will be the reset screen feature of the pokedex.
// What will happen is that if the previous pokemon has two types 
// It will remove the previous second type and change the first one according to the entry,
// While removing the pokemon from the screen to load the new pokemon's picture.
var resetScreen = () => {
    mainScreen.classList.remove('hide');
    for (var type of Elements) {
        mainScreen.classList.remove(type)

    }
};


//This function will go through the URL of the pokemon API
// Apparently on the API the pokemon list would be showing 20 at a time
// So, it will list each pokemon on the right side of the screen by twenty
// While showing the ID for them as well. It will use the URL from the pokeAPI..

var fetchingPokemon = (url) => {
    fetch(url)
        .then(result => result.json())
        .then(Pokedata => {
            var { results, previous, next } = Pokedata;
            previousURL = previous;
            nextURL = next;

            pokeListItems.forEach(function (item, i) {
                var resultData = results[i];

                if (resultData) {
                    var { name, url } = resultData;
                    var urlArray = url.split('/');
                    var ID = urlArray[urlArray.length - 2];
                    item.textContent = ID + '. ' + Capitalize(name);
                } else {
                    item.textContent = '';
                }
            })




        });

};

// Below here is the function that brings the ID of the pokemon on the left screen
// It will reset the screen whenever the page reloads or keeps it blank AND whenever
// A person clicks the pokemon entry it will show their types, their name, the ID of that pokemon
// The height as well as the weight of the pokemon. It also will show the front and back of each pokemon

var fetchPokeData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(Pokeresult => Pokeresult.json())
        .then(Pokedata => {

            resetScreen();
            var Pokestats = Pokedata['stats'];
            var stats = Pokestats.map(
                function (item) {
                    var baseStat = item.base_stat
                    return baseStat;
                }
            )
            var PokeTypes = Pokedata['types'];
            var PokeFirstType = PokeTypes[0];
            var PokeSecondType = PokeTypes[1];
            pokeTypeOne.textContent = Capitalize(PokeFirstType['type']['name']);
            if (PokeSecondType) {
                pokeTypeTwo.classList.remove('hide');
                pokeTypeTwo.textContent = Capitalize(PokeSecondType['type']['name']);
            } else {
                pokeTypeTwo.classList.add('hide');
                pokeTypeTwo.textContent = '';
            }
            mainScreen.classList.add(PokeFirstType['type']['name'])

            pokeName.textContent = Capitalize(Pokedata['name']);
            pokeID.textContent = "Dex# " + Pokedata['id'].toString().padStart(3, '0');
            pokeWeight.textContent = Pokedata['weight'] + " lbs";
            PokeHeight.textContent = Pokedata['height'] + "''";
            pokeFrontImage.src = Pokedata['sprites']['front_default'] || '';
            pokeeBackImage.src = Pokedata['sprites']['back_default'] || '';


            // Below would be the code for the chart of the website. What occurs here is
            // The creation of the chart that whenever the data is grabbed it will run through the
            // Base stats of every single pokemon that is grabbed.


            var ctx = document.getElementById('myChart').getContext('2d');


            Chart.defaults.global.defaultFontSize = 12;
            Chart.defaults.global.defaultFontColor = 'white'
            var myBarChart = new Chart(ctx, {
                showTooltips: false,
                type: 'bar',
                data: {
                    labels: ['Speed', 'Special-defense', 'Special-attack', 'Defense', 'Attack', 'HP'],
                    datasets: [{
                        label: 'Base-Stat',
                        //Pokemon Stats
                        data: stats,
                        backgroundColor: [
                            'navy',
                            'green',
                            'purple',
                            'yellow',
                            '#96f1ff',
                            '#8673ff'
                        ], yAxes: [{
                            dsplay: true,
                            gridLines: {
                                dsplay: false,
                                color: "white"
                            }

                        }]

                        // hoverBorderWidth: 3,
                        // hoverBorderColor: '#000'
                    }]
                },
                options: {
                     events:['click'],
                    title: {
                        display: true,
                        text: "The Pokemon's base-stats",
                        beginAtZero: true,


                    }
                },

            })
           

        });
       
}

// Below here are the button functions for the pokedex. If the user clicks the previous or next,
// It takes the api's data and show the next list of pokemon on the screen for the user to click
var leftbuttonclick = () => {
    if (previousURL) {
        fetchingPokemon(previousURL);
    }
};

var rightbuttonclick = () => {
    if (nextURL) {
        fetchingPokemon(nextURL);
    }
};

var ListItemClick = (e) => {
    if (!e.target) return;

    var listItem = e.target;
    if (!listItem.textContent) return;

    var id = listItem.textContent.split('.')[0];
    fetchPokeData(id);

};

// LEFT AND RIGHT BUTTONS with event listeners

leftButton.addEventListener('click', leftbuttonclick);
rightButton.addEventListener('click', rightbuttonclick);

// This is a for loop that whenever any of the items were to be clicked, they will bring the data to the left screen
for (var pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', ListItemClick);

};


// This is the pokeapi url for each pokemon listed and as we can see it's set to 20 as the limit.
fetchingPokemon("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20");


(function () {
	var grandTotal = 15 + 30;
} ) ()
Console.log(grandTotal);
