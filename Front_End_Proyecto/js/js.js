document.addEventListener('DOMContentLoaded', function() {
  // Inicialización de Sidenav
  var sidenavElems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sidenavElems);

  // Inicialización del carrusel (solo si existe en la página)
  var carouselElems = document.querySelectorAll('.carousel');
  if (carouselElems.length > 0) {
    var carouselInstances = M.Carousel.init(carouselElems, {
      fullWidth: true,
      indicators: true
    });

    // Lógica de navegación personalizada del carrusel
    var movePrev = document.querySelector('.movePrevCarousel');
    var moveNext = document.querySelector('.moveNextCarousel');

    if (movePrev && moveNext) {
      var instance = M.Carousel.getInstance(carouselElems[0]);
      
      movePrev.addEventListener('click', function(e) {
        e.preventDefault();
        instance.prev();
      });

      moveNext.addEventListener('click', function(e) {
        e.preventDefault();
        instance.next();
      });
    }
  }
});
