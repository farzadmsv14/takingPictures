import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  stream!: MediaStream;
  photo: string | null = null;
  streamStarted = false;

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.nativeElement.srcObject = this.stream;
      this.streamStarted = true;
    } catch (error) {
      console.error('دسترسی به دوربین ممکن نیست:', error);
    }
  }

  capture() {
    const videoElement = this.video.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d')?.drawImage(videoElement, 0, 0);

    this.photo = canvas.toDataURL('image/png'); 
  }
}
