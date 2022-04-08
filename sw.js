const CACHENAME = "cache-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";
const CACHE_INMUTABLE_NAME = "inmutable-v1";

const APP_SHELL = [
    './', 
    'index.html', 
    'pages/home.html', 
    'pages/no_response.html',
    'css/style.css', 
    'css/styleHome.css', 
    'img/7.png', 
    'img/fondo1.jpg', 
    'js/app.js'
];
const APP_INMUTABLE = ['https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
    'https://code.jquery.com/jquery-3.6.0.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
    'https://fonts.googleapis.com/css?family=Sofia',
    'https://fonts.googleapis.com/css?family=Audiowide'
];

self.addEventListener('install', evento=>{
    const instalandoCache = caches.open(CACHENAME).then(cache =>{
        cache.addAll(APP_SHELL);
    });

    const instalandoCacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache=>{
        return cache.addAll(APP_INMUTABLE);
    });

    evento.waitUntil(Promise.all([instalandoCache, instalandoCacheInmutable]));
});

self.addEventListener('fetch', event => {
    const respuestaFullback = caches.match(event.request).then(respuesta => {

        if (respuesta) return respuesta;
        console.log("No existe, error de red");

        fetch(event.respuesta).then(nuevarespuesta => {
            caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                cache.put(event.request, nuevarespuesta);
                limpiarCache(CACHE_DYNAMIC_NAME, 100);


            });
            return nuevarespuesta.clone();
        }).catch(error => {
            console.log("catch fetch");
            if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/pages/no_response.html');
            };
        });

    });

    event.respondWith(respuestaFullback);
});

function limpiarCache(cache_name, items_number) {
    caches.open(cache_name).then(cache => {
        return cache.keys().then(keys => {
            console.log(keys);
            if (keys.length > items_number) {
                cache.delete(keys[0]).then(limpiarCache(cache_name, items_number));
            }
        });
    });
}
