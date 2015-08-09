var connection = new RTCMultiConnection();
        connection.session = {
            audio: true
        };

        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false
        };

        connection.onstream = function(e) {
            audioContainer.insertBefore(e.mediaElement, audioContainer.firstChild);
        };

// Is the session part. To create / to join

        var sessions = {};
        connection.onNewSession = function(session) {
            if (sessions[session.sessionid]) return;
            sessions[session.sessionid] = session;

            var tr = document.createElement('tr');
            tr.innerHTML = '<td><strong>' + session.extra['session-name'] + '</strong> is running a conference!</td>' +
                '<td><button class="join">Join</button></td>';
            roomsList.insertBefore(tr, roomsList.firstChild);

            var joinRoomButton = tr.querySelector('.join');
            joinRoomButton.setAttribute('data-sessionid', session.sessionid);
            joinRoomButton.onclick = function() {
                this.disabled = true;

                var sessionid = this.getAttribute('data-sessionid');
                session = sessions[sessionid];

                if (!session) throw 'No such session exists.';

                connection.join(session);
            };
        };

        var audioContainer = document.getElementById('audios-container') || document.body;
        var roomsList = document.getElementById('rooms-list');

        document.getElementById('setup-new-conference').onclick = function() {
            this.disabled = true;
            connection.extra = {
                'session-name': document.getElementById('conference-name').value || 'Anonymous'
            };
            connection.open();
        };

        // setup signaling to search existing sessions
        connection.connect();

        (function() {
            var uniqueToken = document.getElementById('unique-token');
            if (uniqueToken)
                if (location.hash.length > 2) uniqueToken.parentNode.parentNode.parentNode.innerHTML = '<h2 style="text-align:center;"><a href="' + location.href + '" target="_blank">Share this link</a></h2>';
                else uniqueToken.innerHTML = uniqueToken.parentNode.parentNode.href = '#' + (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace(/\./g, '-');
        })();