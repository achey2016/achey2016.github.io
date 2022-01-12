console.log('[Service Worker] registering');
appName = 'pvse';
appVersion = '2.0.alpha31';
cacheName =  appName + '-v' + appVersion ;
alllist = [ 'Style.css',
            'index.html',
            'index.html?test=1',
            'index.html?test=2',
            'index.html?test=3',
            'index.html?test=4',
            'index.html?test=5',
            'offline.html',
            'scripts.js',
            'stim/angle0alt.svg',
            'stim/longueur0.svg',
            'stim/longueur0alt.svg',
            'stim/milieu0alt.svg',
            'stim/posrel0.svg',
            'stim/posrel0alt.svg',
            'stim/taille0.svg',
            'stim/taille0alt.svg',
            'stim/angle.svg',
            'stim/angle1alt.svg',
            'stim/angle2alt.svg',
            'stim/angle3alt.svg',
            'stim/angle4alt.svg',
            'stim/angle5alt.svg',
            'stim/angle6alt.svg',
            'stim/longueur1.svg',
            'stim/longueur1alt.svg',
            'stim/longueur2.svg',
            'stim/longueur2alt.svg',
            'stim/longueur3.svg',
            'stim/longueur3alt.svg',
            'stim/longueur4.svg',
            'stim/longueur4alt.svg',
            'stim/longueur5.svg',
            'stim/longueur5alt.svg',
            'stim/longueur6.svg',
            'stim/longueur6alt.svg',
            'stim/milieu.svg',
            'stim/milieu.svg?i=1',
            'stim/milieu.svg?i=2',
            'stim/milieu.svg?i=3',
            'stim/milieu.svg?i=4',
            'stim/milieu.svg?i=5',
            'stim/milieu.svg?i=6',
            'stim/milieu.svg?i=7',
            'stim/milieu.svg?i=8',
            'stim/milieu.svg?i=9',
            'stim/milieu.svg?i=10',
            'stim/milieu.svg?i=11',
            'stim/milieu.svg?i=12',
            'stim/milieu1alt.svg',
            'stim/milieu2alt.svg',
            'stim/milieu3alt.svg',
            'stim/milieu4alt.svg',
            'stim/milieu5alt.svg',
            'stim/milieu6alt.svg',
            'stim/milieu1alt.svg?i=2',
            'stim/milieu2alt.svg?i=2',
            'stim/milieu3alt.svg?i=2',
            'stim/milieu4alt.svg?i=2',
            'stim/milieu5alt.svg?i=2',
            'stim/milieu6alt.svg?i=2',
            'stim/posrel1.svg',
            'stim/posrel1alt.svg',
            'stim/posrel2.svg',
            'stim/posrel2alt.svg',
            'stim/posrel3.svg',
            'stim/posrel3alt.svg',
            'stim/posrel4.svg',
            'stim/posrel4alt.svg',
            'stim/posrel5.svg',
            'stim/posrel5alt.svg',
            'stim/posrel6.svg',
            'stim/posrel6alt.svg',
            'stim/taille1.svg',
            'stim/taille1alt.svg',
            'stim/taille2.svg',
            'stim/taille2alt.svg',
            'stim/taille3.svg',
            'stim/taille3alt.svg',
            'stim/taille4.svg',
            'stim/taille4alt.svg',
            'stim/taille5.svg',
            'stim/taille5alt.svg',
            'stim/taille6.svg',
            'stim/taille6alt.svg'];
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installation');
    // D'abord on va vider le cache avec les anciennes versions  
    // liste des versions a conserver
    var cachesToKeep = [cacheName, 'immuable'];
  
    e.waitUntil( (async() => {
      try {
        const keyList = await caches.keys();
        console.log('[Service Worker] Nettoyage du cache');
        await Promise.all(keyList.map(function(key) {
            if (cachesToKeep.indexOf(key) === -1 && key.indexOf(appName + "-v") === 0) {
              console.log('[Service Worker] Suppression de ', key);
              return caches.delete(key);
            }
        }));
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Mise en cache globale: app shell et contenu');
        await Promise.all(alllist.map(async(key) => {
          console.log('[Service Worker] Mise en cache de',key);
          // le cache du sw est different du cache HTTP
          // cache: 'no-store' contourne le cache HTTP et permet d'acceder au serveur
          // cache: 'reload' met a jour le cache HTTP en interrogeant le serveur
          // par defaut s'il y a une donnee fraiche en cache HTTP 
          // le serveur n'est pas interroge
          const fetchResponse = await fetch(key, {
            mode:'no-cors',
            cache:'no-store'
          });
          if(fetchResponse && fetchResponse.ok) {
            console.log('fetchResponse: ', fetchResponse.url);
            return cache.put(fetchResponse.url, fetchResponse.clone());
          } else {
            throw new TypeError('error fetching' + key);
          }
        }));
        console.log('[Service Worker] skip waiting');
        await self.skipWaiting();
        return true;
      } catch (error) {
        console.log('Install failed: ', error);
        return error;
      }
    })());
});
self.addEventListener('activate',(e) => {
  console.log('[Service Worker] Activation');
  e.waitUntil((async() => {
    try {
      console.log('[Service Worker] claim clients');
      await self.clients.claim();
      console.log('[Service Worker] inform clients');
      const clientList = await self.clients.matchAll();
      return Promise.all(clientList.map((c) => c.postMessage(cacheName + ' activated')));
    } catch(error) {
      console.log('Activate failed: ',error);
      return error;
    }
  })());
});
self.addEventListener('message',(e) => {
  console.log('[Service Worker] message received',e.data);
  if (e.data === "version") {
    e.source.postMessage('version: ' + cacheName);
  }
});
self.addEventListener('fetch', (event) => {
  event.respondWith((async() => {
    const cache = await caches.open(cacheName);
    try {
        // d'abord voir sur le reseau
        // le cache du sw est different du cache HTTP
        // cache: 'no-store' contourne le cache HTTP et permet d'acceder au serveur
        // cache: 'reload' met a jour le cache HTTP en interrogeant le serveur
        // par defaut s'il y a une donnee fraiche en cache HTTP le serveur n'est pas interroge
        const fetchResponse = await fetch(event.request, {
          mode:'no-cors',
          cache:'no-store'
        });
        if(fetchResponse) {
            console.log('fetchResponse: ', event.request.url);
            await cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
        }
    } catch(error1) {
      console.log('Fetch failed: ', error1);
      try {
        // en cas d'echec interroger le cache du sw
        const cachedResponse = await cache.match(event.request);
        if(cachedResponse) {
            console.log('cachedResponse: ', event.request.url);
            return cachedResponse;
        }
      } catch (error) {
        const cachedResponse = await cache.match('offline.html');
        return cachedResponse;
      }
    }
  })());
});
