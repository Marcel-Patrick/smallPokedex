/* The first code line implies: new pokemonRepository variable to hold what
IIFE will return, and assign the IIFE to that variable.
Start of wrap of pokemonList array in an IIFE*/
let pokemonRepository = (function () {
  /* This code line implies: an empty array with later shall show up the objects
  (Pokemon) from an external API in my personal pokemaonList */
  let pokemonList = [];
  /* This code line implies: the url to the external API */
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  /* This function is used to Create a modal when pokemon is selected from
  the list */
  function showModal(pokemon) {
    //Get pokemon type
    let pokemonType = pokemon.types[0].type.name;

    //Get image URL
    // jscs:disable
    // This lint was diesabled since we cannot use the dote with the - symbol
    let imgUrl = pokemon.sprites.other['official-artwork']['front_default'];
    // jscs:enable

    //Select the title and the body of the Modal
    let $modalTitle = $('.modal-title');
    let $modalBody = $('.modal-body');

    //Reset the modal content
    $modalTitle.empty();
    $modalBody.empty();

    //Creating element for name in Modal content
    let $nameElement = $('<h1>' + pokemon.name + '</h1>');

    //Creating img in Modal content
    let $imageElement = $('<img class="modal-img" style="width:100%">');
    $imageElement.attr('src', imgUrl);
    $imageElement.addClass(pokemonType + '-pokemon');

    //Creating element for height in Modal content
    let $heightElement = $(
      '<p> Height: ' +
      pokemon.height / 10 +
      ' m</p>' +
      '<span class="sr-only"> height ' +
      pokemon.height / 10 +
      ' meter</span>'
    );

    //Creating element for type in Modal content
    let $typeElement = $(
      '<p> Type: ' +
      pokemonType +
      '</p>' +
      '<span class="sr-only">Type ' +
      pokemonType +
      '</span>'
    );

    //Add the new created Modal
    $modalTitle.append($nameElement);
    $modalBody.append($imageElement);
    $modalBody.append($heightElement);
    $modalBody.append($typeElement);
  }

  /* This code lines implies: a function should add the Pokemon referred to
  with item to the pokemonList array */
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  // This code lines implies: a function should return the pokemonList array
  function getAll() {
    return pokemonList;
  }

  /* This code lines implies: a function that opens additional information after
  clicked one of the displayed buttons */
  function pokemonEventListener(button, pokemon) {
    button.on('click', showDetails.bind(this, pokemon, button));
  }

  /* This code lines implies: a function to load the details of each pokemon
  wich is defined in the API URL+ */
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (details) {
      // Now we add the details to the item
      showModal(details);
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    })
    .catch(function (e) {
      console.error(e);
    });
  }

  /* This code lines implies: a function to add a specific color to each pokemon
  button, after checking the type of the pokemon.
  For 18 different pokemon types add 18 different color to the pokemon button */
  function addColor(pokemon, button) {
    let url = pokemon.detailsUrl;
    return fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (details) {
      let type = details.types[0].type.name;

      //call the class based on the pokemon type
      button.addClass(type + '-pokemon');
    })
    .catch(function (e) {
      console.error(e);
    });
  }

  /* This code lines implies: a function to display each pokemon wich is defined
  in the pokemonList inside a button*/
  function addListItem(pokemon) {
    let $pokemonListElement = $('.pokemon-list');
    let $listItem = $(
      '<li><span class="sr-only">' + pokemon.name + '</span></li>'
    );
    $listItem.addClass('list-group-item liStyle');
    let $button = $('<button></button>');
    $button.addClass('pokemon-Button-Style btn');
    $button.attr('data-toggle', 'modal');
    $button.attr('data-target', '#pokemonModal');
    $button.text(pokemon.name);

    addColor(pokemon, $button);
    $listItem.append($button);
    $pokemonListElement.append($listItem);
    pokemonEventListener($button, pokemon);
  }

  /* This code lines implies: a function to load each pokemon wich is defined
  in the API URL and puch it inside the pokemonList array */
  function loadList() {
    return fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url,
        };
        add(pokemon);
      });
    })
    .catch(function (e) {
      console.error(e);
    });
  }

  /* This code lines implies: a function to show or display the details of each
  pokemon wich now inside the pokemonList array */
  function showDetails(item) {
    loadDetails(item).then(function () {
      console.log(item);
    });
  }

  /* This code lines implies: return all the above funkions and values inside
  the IIFE to the outside */
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };

  // This code line implies: the end of the wrap of pokemonList array in an IIFE
})();

/* This code lines implies: the call and of the funkions inside the IIFE to
display its contents to the outside */
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

$(document).ready(function () {
  $('#search-input').on('keyup', function () {
    var value = $(this).val().toLowerCase();
    $('.pokemon-list .list-group-item').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
