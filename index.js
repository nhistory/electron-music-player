const playpauseBtn = document.querySelector('.playpause-track');
const trackName = document.querySelector('.track-name');
const albumName = document.querySelector('.album-name');
const trackArtist = document.querySelector('.track-artist');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');

let isPlaying = false;
let trackIndex = 0;

// Create new audio element
let currTrack = document.createElement('audio');

// Define the tracks that have to be played
let trackList = [];

window.electronAPI.sendSonglist(async (_event, value) => {
  trackList = value;
  trackList.sort((a, b) => {
    return a.track - b.track;
  });

  console.log(trackList);

  for (let i = 0; i < trackList.length; i++) {
    document.querySelector(`.track-name${i + 1}`).textContent =
      trackList[i].songName;
    document.querySelector(`.track-artist${i + 1}`).textContent =
      trackList[i].artist;
    // console.log(
    //   'data:' +
    //     trackList[i].image.format +
    //     ';base64, ' +
    //     trackList[i].image.data
    // );
  }
});

// Load the first track in the tracklist
setTimeout(() => {
  loadTrack(trackIndex);
}, 100);

// // Update track list information
// document.querySelector('.track-name1').textContent = trackList[0].name;
// document.querySelector('.track-artist1').textContent = trackList[0].artist;
// document.querySelector('.track-name2').textContent = trackList[1].name;
// document.querySelector('.track-artist2').textContent = trackList[1].artist;
// document.querySelector('.track-name3').textContent = trackList[2].name;
// document.querySelector('.track-artist3').textContent = trackList[2].artist;
// document.querySelector('.track-name4').textContent = trackList[3].name;
// document.querySelector('.track-artist4').textContent = trackList[3].artist;

function loadTrack(trackIndex) {
  // clearInterval(updateTimer);
  // resetValues();
  currTrack.src = trackList[trackIndex].path;
  currTrack.load();

  trackName.textContent = trackList[trackIndex].songName;
  albumName.textContent = trackList[trackIndex].album;
  trackArtist.textContent = trackList[trackIndex].artist;
}

// Play and pause track
function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  currTrack.play();
  isPlaying = true;
  playpauseBtn.innerHTML = '<i class="material-icons">pause</i>';
}

function pauseTrack() {
  currTrack.pause();
  isPlaying = false;
  playpauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
}

// Previous and Next track
function nextTrack() {
  if (trackIndex < trackList.length - 1) trackIndex += 1;
  else trackIndex = 0;
  loadTrack(trackIndex);
  playTrack();
  console.log(trackList);
}

function prevTrack() {
  if (trackIndex > 0) trackIndex -= 1;
  else trackIndex = trackList.length;
  loadTrack(trackIndex);
  playTrack();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = currTrack.duration;

  currTrack.currentTime = (clickX / width) * duration;
}

// Time/song update
currTrack.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);
