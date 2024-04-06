console.log("lets write javascript");

let currentsong = new Audio(); // global variable

function secondsToMinutesSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
const totalSeconds = 125;
const formattedTime = secondsToMinutesSeconds(totalSeconds);
console.log(formattedTime); // Output: "02:05"


async function getsongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")


    let songs = []
    for (let index = 0; index < as.length; index++) {

        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs


}

const playMusic = (track , pause=false)=>{
   // let audio = new Audio("/songs/" + track)
   currentsong.src = "/songs/" + track
   if(!pause){
       currentsong.play()
       play.src = "pause.svg"
   }
   document.querySelector(".songinfo").innerHTML = decodeURI(track)
   document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function main() {

    

    
    // Get the list of all the songs 
    let songs = await getsongs()
    playMusic(songs[0],true)

    // show all the songs in the playlists
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li>
        <img class="invert" src="music.svg" alt="">
        <div class="info">
         <div> ${song.replaceAll("%20", " ")}</div>
         <div> aman</div>
        </div>
        <div class="playnow">
            <span>play now</span>
            <img class="invert" src="play.svg" alt="">
         </div>
        </li>`;
    }

    // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.getElementsByTagName("div")[1].innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    // attach an event listner to play, next and previous 
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "pause.svg"
        }
        else{
            currentsong.pause()
            play.src = "play.svg"
        }
    })

    //listen for time update event
    currentsong.addEventListener("timeupdate", ()=>{
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 +"%"
    })

    // add an event listner  to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent +"%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100
    })

    // add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
      document.querySelector(".left").style.left = "0"
    })

    // add event listner for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%"
      }) 



}
main()
