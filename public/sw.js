self.addEventListener('push', function (e) {
    console.log('push');
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        //notifications aren't supported or permission not granted!
        return;
    }
    if (e.data) {
        console.log("responseevent:::::::::::::",e.data);
        var msg = e.data.json();
        console.log("AAAAAAAAAAAA",msg)
        e.waitUntil(self.registration.showNotification(msg.title, {
            body: msg.body.description,
            icon: msg.icon,
            actions: msg.actions
        }));
        console.log("typeee",msg.body.params.type);
        if(msg.body.params.type === 'share'){
            self.addEventListener('notificationclick', function(event) {
                //var url = event.notification.data.target_url;
                //console.log("URLLL::::::::::::::::::::::",url);
                console.log('[Service Worker] Notification click Received.');
              
                event.notification.close();
              
                event.waitUntil(
                  clients.openWindow('https://admin.movitronic.com/admin/shares-list')
                );
              });

        }
    }
});



  