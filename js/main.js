'use strict';

var HOTEL_PHOTOS = 4;
var ADVERTS_COUNT = 8;

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var getRandomNumber = function (min, max) {
  var randomNumber = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNumber);
};

var getNewArrayRandomLength = function (array) {
  var newArrayLength = getRandomNumber(0, array.length);
  var newArray = array.slice(0, newArrayLength);

  return newArray;
};

var types = [
  'palace',
  'flat',
  'house',
  'bungalo',
];

var featuresInHotel = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

var mapPins = document.querySelector('.map__pins');

var pinWidth = mapPins.querySelector('img').clientWidth;

var mapOverlay = document.querySelector('.map__overlay');
var mapOverlayWidth = mapOverlay.clientWidth;
var pinCoordinate = mapOverlayWidth - pinWidth;

var getHotelPhotos = function (photosCount) {
  var hotelPhotos = [];

for (var i = 0; i < photosCount; i++) {
  hotelPhotos.push('http://o0.github.io/assets/images/tokyo/hotel' + i +1 '.jpg');
}

return hotelPhotos;
}

var hotelPhotos = getHotelPhotos(HOTEL_PHOTOS);

var getAdverts = function (count) {
  var allHotels = [];
for (var i = 0; i < 8; i++) {
  var locationX = getRandomNumber(pinWidth, pinCoordinate);
  var locationY = getRandomNumber(130, 630);
  var iNext = i + 1;

  allHotels.push({
    author: {
      avatar: 'img/avatars/user' + '0' + iNext + '.png'
    },
    offer: {
      title: 'Это тайтл',
      address: locationX + ',' + locationY,
      price: getRandomNumber(1000, 5000),
      type: types[getRandomNumber(0, 3)],
      rooms: getRandomNumber(1, 5),
      guests: getRandomNumber(1, 6),
      checkin: '12:00',
      checkout: '12:00',
      features: getNewArrayRandomLength(featuresInHotel),
      description: 'строка с описанием',
      photos: getNewArrayRandomLength(hotelPhotos),
    },
    location: {
      x: locationX,
      y: locationY
    }
  });
}
return allHotels;
}

var allHotels = getAdverts(ADVERTS_COUNT);


var renderHotel = function (hotels, template) {
  var hotelElement = template.cloneNode(true);
  var hotelElementImg = hotelElement.querySelector('img');

  hotelElement.style = 'left: ' + hotels.location.x + 'px; top: ' + hotels.location.y + 'px;';
  hotelElementImg.src = hotels.author.avatar;
  hotelElementImg.style.alt = hotels.offer.title;

  return hotelElement;
};

var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');


var getFragment (hotels) {
  var fragment = document.createDocumentFragment();
for (var i = 0; i < hotels.length; i++) {
  var newHotel = renderHotel(allHotels[i], pinTemplate);
  fragment.appendChild(newHotel);
}
}

fragment(allHotels);

mapPins.appendChild(fragment);

var getMatchedValue = function (type) {

  var matchedTypes = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец',
  };

  return matchedTypes[type];
};

var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

var renderMapHotel = function (hotel, template) {
  var hotelMapElement = template.cloneNode(true);

  hotelMapElement.querySelector('.popup__title').innerHTML = hotel.offer.title;
  hotelMapElement.querySelector('.popup__text--address').innerHTML = hotel.offer.address;
  hotelMapElement.querySelector('.popup__text--price').innerHTML = hotel.offer.price + '₽/ночь';
  hotelMapElement.querySelector('.popup__type').innerHTML = getMatchedValue(hotel.offer.type);
  hotelMapElement.querySelector('.popup__text--capacity').innerHTML = allHotels[0].offer.rooms + ' комнаты для ' + hotel.offer.guests + ' гостей';
  hotelMapElement.querySelector('.popup__text--time').innerHTML = 'Заезд после ' + hotel.offer.checkin + ', выезд до ' + hotel.offer.checkout;
  hotelMapElement.querySelector('.popup__features').innerHTML = hotel.offer.features;
  hotelMapElement.querySelector('.popup__description').innerHTML = hotel.offer.description;
  hotelMapElement.querySelector('.popup__avatar').src = hotel.author.avatar;


  var photosLength = hotel.offer.photos.length;
  var popupPhotos = hotelMapElement.querySelector('.popup__photos');
  var popupPhoto = popupPhotos.querySelector('.popup__photo');


  if (photosLength > 0) {
    hotel.offer.photos.forEach(function (item, index) {
      if (index === 0) {
        popupPhoto.src = item;
        return;
      }
      var popupPhotoTemplate = popupPhoto.cloneNode(true);
      popupPhotoTemplate.src = item;
      popupPhotos.appendChild(popupPhotoTemplate);
    });
  } else {
    popupPhotos.textContent = '';
  }

  return hotelMapElement;
};


var mapBlock = document.querySelector('.map');
var fragmentMap = document.createDocumentFragment();
var newMapHotel = renderMapHotel(allHotels[0], cardTemplate);
fragmentMap.appendChild(newMapHotel);

mapBlock.appendChild(fragmentMap);
