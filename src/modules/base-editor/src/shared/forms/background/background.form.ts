import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { pluck, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

import { PebMediaComponent } from '@pe/builder-media';
import { MediaService } from '@pe/builder-api';

import { AbstractComponent } from '../../../misc/abstract.component';
import { FillType, FillTypes, ImageSizes } from '../../../behaviors/sidebars/_deprecated-sidebars/sidebar.utils';
import { SelectOption } from '../../_old/select/select.component';

interface PeOutputDataMediaStudio {
  thumbnail: string;
  sourceUrl: string;
}

@Component({
  selector: 'editor-background-form',
  templateUrl: './background.form.html',
  styleUrls: [
    '../../../../../base-plugins/sidebars.scss',
    './background.form.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorBackgroundForm extends AbstractComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() label = 'Background';
  @Input() fillTypes: SelectOption[] = FillTypes;
  @Output() blurred = new EventEmitter<void>();

  readonly FillType: typeof FillType = FillType;
  readonly ImageSizes: typeof ImageSizes = ImageSizes;

  sliderUnit = '%';
  bgImageLoading: boolean;
  panelOpened$ = new BehaviorSubject<boolean>(false);

  thumbnail$ = new ReplaySubject<string>();

  constructor(
    public dialog: MatDialog,
    public cdr: ChangeDetectorRef,
    public mediaService?: MediaService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup?.valueChanges.pipe(
      pluck('bgImage'),
      tap((value) => {
        this.thumbnail$.next(value);
      }),
      tap(() => this.cdr.detectChanges()),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  changeBgInputHandler($event) {
    const files = $event.target.files as FileList;
    if (files.length > 0) {
      const file = files[0];
      this.formGroup.controls.file.patchValue(file);
    }
  }

  getFillType(): string {
    return this.formGroup.get('fillType').value && this.formGroup.get('fillType').value.name
      ? this.formGroup.get('fillType').value.name
      : this.formGroup.get('fillType').value;
  }

  openMediaStudio() {
    this.dialog.open(PebMediaComponent, {
      position: {
        top: '0',
        left: '0',
      },
      height: '100vh',
      maxWidth: '100vw',
      width: '100vw',
      panelClass: 'products-dialog',
    }).afterClosed().pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data && data !== '') {
          this.formGroup.get('bgImage').patchValue(data.thumbnail);
        }
      });
  }
}
