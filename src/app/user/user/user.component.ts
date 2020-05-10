import {
  Component,
  ElementRef,
  Input, OnInit,
  ViewEncapsulation
} from '@angular/core';
import {UserToken} from '../../models/userToken';
import {Track} from 'ngx-audio-player';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {PlayingQueueService} from '../../services/playing-queue.service';
import {ThemeService} from '../../services/theme.service';
import {Setting} from '../../models/setting';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  currentUser: UserToken;
  @Input() setting: Setting = new Setting(true);

  @Input() msaapDisplayTitle = true;
  @Input() msaapDisplayPlayList = true;
  @Input() msaapPageSizeOptions = [6];
  @Input() msaapDisplayVolumeControls = true;
  @Input() expanded = false;

// Material Style Advance Audio Player Playlist
  msaapPlaylist: Track[] = [
    {
      title: '',
      link: ''
    }
  ];
  sessionTimeoutNotification: boolean;

  constructor(private router: Router, private authService: AuthService, private playingQueueService: PlayingQueueService,
              private elementRef: ElementRef, private themeService: ThemeService) {
    this.authService.currentUserToken.subscribe(
      currentUser => {
        this.currentUser = currentUser;
        this.sessionTimeoutNotification = false;
      }
    );
    this.authService.sessionTimeout.subscribe(
      () => {
        this.sessionTimeoutNotification = true;
      }
    );
    this.playingQueueService.currentQueue.subscribe(
      currentQueue => {
        this.msaapPlaylist = currentQueue;
      }
    );
    this.playingQueueService.update.subscribe(
      () => {
        this.msaapDisplayVolumeControls = !this.msaapDisplayVolumeControls;
        const reEnableVolumeControl = setTimeout(() => {
          this.msaapDisplayVolumeControls = true;
          clearTimeout(reEnableVolumeControl);
        }, 10);
      }
    );
    this.themeService.darkThemeSubject.subscribe(
      next => {
        console.log(next);
        if (next) {
          this.setting = next;
          if (this.setting.darkMode) {
            this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black';
          } else {
            this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'white';
          }
        }
      }
    );
  }

  ngOnInit() {
  }
}
