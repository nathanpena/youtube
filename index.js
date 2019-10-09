// Options
const CLIENT_ID = '865664335166-9up29vt4b54s96b1vkt38tfvib46f9ff.apps.googleusercontent.com';
const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const playlistInput = document.getElementById('playlist-input');
const videoContainer = document.getElementById('video-container');

// Form submit and change playlist
channelForm.addEventListener('submit', e => {
    e.preventDefault();

    const playlistId = playlistInput.value;

    requestVideoPlaylist(playlistId);
});

// Load auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Init API client library and set up sign in listeners
function initClient() {
    gapi.client
        .init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        })
        .then(() => {
            // Listen for sign in state changes
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            // Handle initial sign in state
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
        });
}

// Update UI sign in state changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display = 'block';
        requestVideoPlaylist('PLKj5UM51wKXgCIVHmOmV-uCiwyTi0Pq_d');
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display = 'none';
    }
}

// Handle login
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

// Handle logout
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

// Add commas to number
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function requestVideoPlaylist(playlistId) {
    const requestOptions = {
        playlistId: playlistId,
        part: 'snippet',
        maxResults: 3
    };

    const request = gapi.client.youtube.playlistItems.list(requestOptions);

    request.execute(response => {
        console.log(response);
        const playListItems = response.result.items;
        if (playListItems) {
            let output = '<br><h4 class="center-align">Latest Videos</h4>';

            // Loop through videos and append output
            playListItems.forEach(item => {
                const videoId = item.snippet.resourceId.videoId;

                output += `
          <div class="col s3">
          <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          </div>
        `;
            });

            // Output videos
            videoContainer.innerHTML = output;
        } else {
            videoContainer.innerHTML = 'No Uploaded Videos';
        }
    });
}