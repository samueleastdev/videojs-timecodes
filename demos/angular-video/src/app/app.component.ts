import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import videojs from 'video.js';
import "videojs-frames";

const PLAYBACK_RATES = [0.5, 1, 1.5, 2];
const VIDEO_URL = "https://d3edqwp3msshbp.cloudfront.net/aladdin-web-optimised.mp4";
const BIF_URL = "https://d3edqwp3msshbp.cloudfront.net/aladdin720.bif";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  videojsPlayerId = "videojsPlayerId";
  framesPlayerId = "videoFramesPlayerId";
  private videojsPlayer;
  private framesPlayer;

  ngAfterViewInit() {
    let setup = {
      'preload': 'metadata',
      'autoplay': false,
      'fluid': true,
      'controls': true,
      'playbackRates': PLAYBACK_RATES,
      'inactivityTimeout': 1000 // ms
    };

    // pure videojs player
    this.videojsPlayer = videojs(this.videojsPlayerId, setup);
    this.setSrc(this.videojsPlayer, VIDEO_URL);

    // videojs-frames player
    this.framesPlayer = videojs(this.framesPlayerId, setup);
    this.setSrc(this.framesPlayer, VIDEO_URL);
    this.enableFrames(BIF_URL);
  }

  enableFrames(bifURL) {
    let options: any = { framerate: 30 };
    if (bifURL) {
      options.bif = bifURL;
    }
    this.framesPlayer.frames(options);
  }

  ngOnDestroy() {
    if (this.videojsPlayer) {
      this.videojsPlayer.dispose();
    }
    if (this.framesPlayer) {
      this.framesPlayer.dispose();
    }
  }

  public setSrc(player, src: string, mimeType = "video/mp4") {
    player.src({type: mimeType, src: src});
  }

}
