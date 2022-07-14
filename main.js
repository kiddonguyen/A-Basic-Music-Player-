const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const playlist = $(".playlist");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const option = $("#option");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
  duration: 10000,
  iterations: Infinity,
});
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  alreadyPlayedSongs: [],
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: `Grandpop's Uke`,
      singer: `Forrest`,
      path: "./assets/music/01.mp3",
      image: `./assets/img/1.jpg`,
    },
    {
      name: `Lately`,
      singer: `Forrest w/RYCE & Biskwiq`,
      path: "./assets/music/02.mp3",
      image: `./assets/img/2.jpg`,
    },
    {
      name: `Be honest`,
      singer: `Forrest`,
      path: "./assets/music/03.mp3",
      image: `./assets/img/3.jpg`,
    },
    {
      name: `My room`,
      singer: `Forrest w/ Wizard Island`,
      path: "./assets/music/04.mp3",
      image: `./assets/img/4.jpg`,
    },
    {
      name: `Come true`,
      singer: `Khai Dreams (ft.Forrest)`,
      path: "./assets/music/05.mp3",
      image: `./assets/img/5.jpg`,
    },
    {
      name: `Sunday`,
      singer: `Forrest`,
      path: "./assets/music/06.mp3",
      image: `./assets/img/6.jpg`,
    },
    {
      name: `Dance in the living room`,
      singer: `Nvthvn (ft.forrest, OK 2222, Park Bird)`,
      path: "./assets/music/07.mp3",
      image: `./assets/img/7.jpg`,
    },
    {
      name: `Sunday best`,
      singer: `Surfaces`,
      path: "./assets/music/08.mp3",
      image: `./assets/img/8.jpg`,
    },
    {
      name: `Shine on top`,
      singer: `Surfaces`,
      path: "./assets/music/09.mp3",
      image: `./assets/img/9.jpg`,
    },
    {
      name: `Palm trees`,
      singer: `Surfaces`,
      path: "./assets/music/10.mp3",
      image: `./assets/img/10.jpg`,
    },
    {
      name: `Fly away `,
      singer: `Matt Jordan w/ Khai Dreams & Atwood`,
      path: "./assets/music/11.mp3",
      image: `./assets/img/11.jpg`,
    },
    {
      name: `Take some time`,
      singer: `Surfaces`,
      path: "./assets/music/12.mp3",
      image: `./assets/img/12.jpg`,
    },
    {
      name: `Never had`,
      singer: `Forrest`,
      path: "./assets/music/13.mp3",
      image: `./assets/img/13.jpg`,
    },
    {
      name: `Backwards`,
      singer: `Forrest`,
      path: "./assets/music/14.mp3",
      image: `./assets/img/14.jpg`,
    },
    // {
    //   name: `Sheesh!`,
    //   singer: `Surfaces (ft.Tai Vardes)`,
    //   path: "./assets/music/15.mp3",
    //   image: `./assets/img/15.jpg`,
    // },
  ],
  setConfig: function(key, value) {
    this.config[key] = value;
    // (2/2) Uncomment the line below to use localStorage
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  }
  ,
  render: function () {
    const html = this.songs.map((song, currentIndex) => {
      return `
        <div class="song" data-index = ${currentIndex}>
          <div class="thumb" style="background-image: url('${song.image}')"></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `;
    });
    $(".playlist").innerHTML = html.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const app = this;
    const cdWidth = cd.offsetWidth;
    // Xử lý CD quay / dừng
    cdThumbAnimate.pause();
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    // Xử lý khi click play
    playBtn.onclick = function () {
      app.isPlaying ? app.pause() : app.play();
    };
    // Chuyển bài hát next/ prev khi click vào nút
    nextBtn.onclick = function () {
      app.isRandom ? app.playRandomSong() : app.nextSong();
      app.play();
    };
    prevBtn.onclick = function () {
      app.isRandom ? app.playRandomSong() : app.prevSong();

      app.play();
    };
    // Điều khiển nút random
    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle("active", app.isRandom);
    };

    // Điều khiển nút lặp lại
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      // app.setConfig("isRepeat", app.isRepeat);
      repeatBtn.classList.toggle("active", app.isRepeat);
    };
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }

      // Xử lý khi bài hiện tại hoàn thành
      if (audio.currentTime === audio.duration) {
        if (app.isRepeat) {
          audio.currentTime = 0;
        } else {
          app.nextSong();
        }
        app.play();
      }
    };
    // Xử lý khi tua song
    progress.oninput = function () {
      progressPercent = progress.value;

      console.log(progressPercent);
      // audio.currentTime = progressPercent / 100
      audio.currentTime = (progressPercent / 100) * audio.duration;
    };

    // Thay đổi bài hát khi click vào playlist
    playlist.onclick = function (event) {
      const songNode = event.target.closest(".song:not(.active)");
      if (songNode || event.target.closest(".option")) {
        if (songNode) {
          app.currentIndex = songNode.dataset.index;
          app.loadCurrentSong();
          app.play();
        }
        if (event.target.closest(".option")) {
        }
      }
    };
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  }
  ,
  // highlight bài hát khi được active
  highlightSong: function () {
    let songs = $$(".song");
    for (var i = 0; i < songs.length; i++) {
      songs[i].classList.remove("active");
    }
    songs[this.currentIndex].classList.add("active");
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
  },
  playRandomSong: function () {
    // Chỉ mục cho bài hát tiếp theo
    let indexAfter;
    // Thêm chỉ mục bài hát hiện tại vào danh sách đã phát
    this.alreadyPlayedSongs.push(this.currentIndex);
    if (this.alreadyPlayedSongs.length === this.songs.length) {
      this.alreadyPlayedSongs = [];
      console.log(this.alreadyPlayedSongs);
    }

    // Chọn ngẫu nhiên chỉ mục khi ds đã phát có bài đã hát rồi
    do {
      indexAfter = Math.floor(Math.random() * this.songs.length);
    } while (this.alreadyPlayedSongs.includes(indexAfter));

    this.currentIndex = indexAfter;
    this.loadCurrentSong();
  },
  play: function () {
    player.classList.add("playing");
    this.isPlaying = true;
    cdThumbAnimate.play();
    audio.play();
    app.highlightSong();
    this.scrollToActiveSong();
  },
  pause: function () {
    player.classList.remove("playing");
    this.isPlaying = false;
    cdThumbAnimate.pause();
    audio.pause();
  },
  // hàm xử lý sang bài hát sau
  nextSong: function () {
    this.currentIndex++;
    // console.log(this.currentIndex);
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  // hàm xử lý quay về bài hát trước
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  loadCurrentSong: function () {
    // console.log(heading, cdThumb, audio);
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    cdThumbAnimate.cancel();
  },

  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();
    // Đinh nghĩa các thuộc tính cho object
    this.defineProperties();
    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();
    // Tải thông tin bài hát đầu tiên vào ui khi bắt đầu ứng dụng
    this.loadCurrentSong();
    // render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat & random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();
// 1. Render songs
// 2. Scroll top
// 3. Play / Pause / Seek
