importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DINAMIC_CACHE = 'static-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const app_shell = [
    //'/',
    'css/style.css',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js',
]

const app_shell_imutable = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]

self.addEventListener('install', e => {
    // guarda cache static e inmutable
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(app_shell));
    const cacheinmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(app_shell_imutable));

    e.waitUntil(Promise.all([cacheStatic, cacheinmutable]));
});

self.addEventListener('activate', e => {
    // elimina versiones anteriores de cache static
    const resp = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')){
                caches.delete(key);
            }
            if (key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(resp);
});

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res =>{
        if(res){
            return res;
        }
        else{
            return fetch(e.request).then(newRes =>{
                //almacenar en cache dinamico
                return guardaDinamico(DINAMIC_CACHE, e.request, newRes);
            });
        }
    });
})