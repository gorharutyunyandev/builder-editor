import { ComponentRef, Injectable } from '@angular/core';
import { EMPTY, merge, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

import { pebCreateLogger, PebElementDef, PebElementType, PebShopContainer } from '@pe/builder-core';
import {
  AbstractEditElementPlugin,
  AfterGlobalInit,
  PebEditorElementPropertyVideo,
  PebEditorElementVideo,
  SelectedMedia,
  SelectOption,
  VideoSourceType,
  VideoSubTab,
} from '@pe/builder-editor';

import { PebEditorVideoSidebarComponent } from './video.sidebar';
import { PebVideoElement } from '../client';

const log = pebCreateLogger('editor:plugins:edit-video');

@Injectable()
export class PebEditorVideoPlugin extends AbstractEditElementPlugin<PebEditorVideoSidebarComponent>
  implements AfterGlobalInit {
  static elementTypes = [PebElementType.Video];
  VideoSourceType = VideoSourceType;

  sourceTypeOptions: SelectOption[] = [
    { name: 'My video', value: VideoSourceType.MyVideo },
    // { name: 'Link', value: VideoSourceType.Link },
  ];

  sidebarComponent = PebEditorVideoSidebarComponent;

  logger = { log };

  afterGlobalInit(): Observable<any> {
    return this.singleElementOfTypeSelected().pipe(
      switchMap((elCmp: PebEditorElementVideo) => {
        this.initVideoForm(elCmp);
        this.initPositionForm(elCmp);
        this.initDimensionsForm(elCmp);
        this.initOpacityForm(elCmp);
        this.initProportionsForm(elCmp);

        const sidebarRef = this.initSidebar(elCmp);

        this.initAlignmentForm(sidebarRef);

        return merge(
          this.handleAlignmentForm(elCmp, sidebarRef),
          this.handleVideoForm(elCmp, sidebarRef),
          this.handleVideoElement(elCmp, sidebarRef),
          this.handlePositionForm(elCmp),
          this.handleDimensionsForm(elCmp),
          this.handleOpacityForm(elCmp),
          this.handleProportionsForm(elCmp),
        ).pipe(
          takeUntil(this.state.selectionChanged$()),
          finalize(() => sidebarRef.destroy()),
        );
      }),
    );
  }

  private initVideoForm(elementCmp: PebEditorElementVideo) {
    const initialValue = {
      videoSubTab: VideoSubTab.Media,
      sourceOptions: this.sourceTypeOptions,
      sourceType: this.sourceTypeOptions[0],
      source: elementCmp.definition?.data?.source,
      preview: elementCmp.definition?.data?.preview,
      file: elementCmp.definition?.data?.file,
      autoplay: elementCmp.definition?.data?.autoplay,
      controls: elementCmp.definition?.data?.controls,
      loop: elementCmp.definition?.data?.loop,
      sound: elementCmp.definition?.data?.sound,
    };

    elementCmp.video = {
      initialValue,
      form: this.formBuilder.group({
        sourceType: [initialValue.sourceType],
        source: [initialValue.source],
        file: [initialValue.file],
        preview: [initialValue.preview],
        autoplay: [initialValue.autoplay],
        controls: [initialValue.controls],
        loop: [initialValue.loop],
        sound: [initialValue.sound],
      }),
      update: null,
      submit: new Subject<Event>(),
    };
  }

  private handleVideoForm(
    elementCmp: PebEditorElementVideo,
    sidebarRef: ComponentRef<PebEditorVideoSidebarComponent>,
  ): Observable<any> {
    const video = elementCmp.video;
    const videoElement = elementCmp.target as PebVideoElement;

    return merge(
      // Catches VideoForm changes
      video.form.valueChanges.pipe(
        switchMap((changes) => {
          const newElementDef: PebElementDef = {
            ...elementCmp.definition,
            data: {
              ...elementCmp.definition.data,
              ...changes,
            },
          };

          return this.store.updateElement(newElementDef).pipe(
            tap(() => {
              elementCmp.detectChanges();
            }),
          );
        }),
      ),
      // Catches VideoForm events when uploading video
      video.submit.pipe(
        switchMap((changes: Event) => {
          return this.uploadVideo(changes, sidebarRef).pipe(
            tap((result) => {
              const payload: SelectedMedia = {
                preview: result.preview,
                source: result.blobName,
              };

              this.patchForm(payload, video);
            }),
          );
        }),
      ),
      // Handle loading spinner on VideoElement according to VideoForm
      sidebarRef.instance.editorVideoForm.isLoading$.pipe(
        tap((isLoading: boolean) => {
          videoElement.isVideoLoading = isLoading;
          videoElement.cdr.detectChanges();
        }),
      ),
    );
  }

  private handleVideoElement(
    elementCmp: PebEditorElementVideo,
    sidebarRef: ComponentRef<PebEditorVideoSidebarComponent>,
  ): Observable<any> {
    const isVideoElement = elementCmp.target instanceof PebVideoElement;

    if (!isVideoElement) {
      return EMPTY;
    }

    const videoElement = elementCmp.target as PebVideoElement;

    return merge(
      this.events.contentContainer.dblclick$.pipe(
        tap((evt: MouseEvent) => {
          const elCmp = this.renderer.getElementComponentAtEventPoint(evt);
          if (elCmp.definition.id === elementCmp.definition.id) {
            sidebarRef.instance.editorVideoForm?.clickOnFileInput();
          }
        }),
        takeUntil(videoElement.videoUploaded$()),
      ),
    );
  }

  private uploadVideo(
    $event: Event,
    sidebarRef: ComponentRef<PebEditorVideoSidebarComponent>,
  ): Observable<{ preview: string, blobName: string }> {
    const target = $event.target as HTMLInputElement;
    const files: FileList = target.files;

    sidebarRef.instance.editorVideoForm.isLoading$.next(true);
    sidebarRef.instance.editorVideoForm.previewError = false;
    sidebarRef.instance.editorVideoForm.videoDuration = null;
    sidebarRef.instance.editorVideoForm.cdr.detectChanges();

    return this.mediaService.uploadVideo(files.item(0), PebShopContainer.BuilderVideo).pipe(
      switchMap((response: { preview: string, blobName: string }) => {
        return of(response);
      }),
      catchError((err) => {
        if (err.error?.message) {
          sidebarRef.instance.openSnackbarError({
            text: err.error.message,
          });
        }
        sidebarRef.instance.editorVideoForm.isLoading$.next(false);
        sidebarRef.instance.editorVideoForm.isLoading$.complete();
        sidebarRef.instance.editorVideoForm.cdr.detectChanges();

        return throwError(err);
      }),
      finalize(() => {
        sidebarRef.instance.editorVideoForm.isLoading$.next(false);
        sidebarRef.instance.editorVideoForm.isLoading$.complete();
        sidebarRef.instance.editorVideoForm.cdr.detectChanges();
      }),
    );
  }

  patchForm(payload: SelectedMedia, video: PebEditorElementPropertyVideo) {
    video.form.get('source').patchValue(payload.source);
    video.form.get('preview').patchValue(payload.preview);
  }
}
