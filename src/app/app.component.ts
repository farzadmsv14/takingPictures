import { Component, ElementRef, ViewChild } from '@angular/core';
declare var Dropzone: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  stream!: MediaStream;
  streamStarted = false;

  uploadedPhotos: { id: string; url: string }[] = [];

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      this.video.nativeElement.srcObject = this.stream;
      this.streamStarted = true;
    } catch (error) {
      console.error('خطا در فعال‌سازی دوربین:', error);
    }
  }

  captureAndUpload() {
    const videoElement = this.video.nativeElement;

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d')?.drawImage(videoElement, 0, 0);

    const base64Image = canvas.toDataURL('image/jpeg');
    const file = this.base64ToFile(base64Image, `photo-${Date.now()}.jpg`);

    this.uploadFile(file, base64Image);
  }

  uploadFile(file: File, previewUrl: string) {
    const dzElement = document.createElement('div');

    const dropzone = new Dropzone(dzElement, {
      // url: `${environment.gatewayUrl}/FileManager/10`,
      maxFilesize: 50,
      acceptedFiles: 'image/*',
      clickable: true,
      autoProcessQueue: false,
      previewsContainer: false,
      paramName: 'files',
    });

    dropzone.on('sending', () => {
      console.log('📤 در حال ارسال فایل...');
    });

    dropzone.on('success', (file: File, response: any) => {
      const uploadedId = response[0]?.id;
      if (uploadedId) {
        this.uploadedPhotos.push({
          id: uploadedId,
          url: previewUrl,
        });
        console.log('✅ آپلود موفق، ID:', uploadedId);
      }
    });
    const photoIds = this.uploadedPhotos.map((p) => p.id);
    console.log('✅ آپلود موفق، ID:', photoIds);

    dropzone.on('error', (file: File, error: any) => {
      console.error('❌ خطا در آپلود:', error);
    });

    dropzone.addFile(file);
    dropzone.processQueue();
  }

  deletePhoto(photoId: string) {
    this.uploadedPhotos = this.uploadedPhotos.filter(
      (photo) => photo.id !== photoId
    );
    console.log('❌ حذف شد:', photoId);
  }

  private base64ToFile(base64String: string, fileName: string): File {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }
}
