console.log('[Service Worker] registering');
appName = 'cible';
appVersion = '0.2.22';
cacheName =  appName + '-v' + appVersion ;
alllist = [ 'Style.css',
            'index.html',
            'cible.js',
            'Cible.png',
            'offline.html'
          ];
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
      if (error1.toString().match(/certificat/)) {
        // Safari oublie vite les certificats auto-signes acceptes
        // event ????? 
        // tenter un fetch de la racine pour sortir du scope du sw
        try {
          const racine = await fetch("/");
          if (racine) {
            console.log('fetching / was successfull, retrying...');
            const fetchResponse2 = await fetch(event.request, {
              mode:'no-cors',
              cache:'no-store'
            });
            if(fetchResponse2) {
                console.log('fetchResponse: ', event.request.url);
                await cache.put(event.request, fetchResponse2.clone());
                return fetchResponse2;
            }
          }
        } catch (error) {
          self.clients.matchAll()
            .then((a) => 
              a.forEach(c => 
                c.postMessage('error: ' + error1.toString())))
          try {
            // servir la réponse en cache qui affichera le message d'erreur
            const cachedResponse = await cache.match(event.request);
            if(cachedResponse) {
                console.log('cachedResponse: ', event.request.url);
                return cachedResponse;
            }
          } catch (error) {
            // si on arrive là c'est que le cache est incomplet / corrompu
            const cachedResponse = await cache.match('offline.html');
            return cachedResponse;
          }
        }
      }
      // autre erreur: la rapporter
      self.clients.matchAll()
        .then((a) =>
          a.forEach(c =>
            c.postMessage('error: ' + error1.toString())))
      try {
        // servir la réponse en cache qui affichera le message d'erreur
        const cachedResponse = await cache.match(event.request);
        if(cachedResponse) {
            console.log('cachedResponse: ', event.request.url);
            return cachedResponse;
        }
      } catch (error) {
        // si on arrive là c'est que le cache est incomplet / corrompu
        const cachedResponse = await cache.match('offline.html');
        return cachedResponse;
      }
    }
  })());
});
