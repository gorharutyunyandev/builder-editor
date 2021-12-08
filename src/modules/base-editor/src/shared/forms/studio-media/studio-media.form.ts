import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, takeUntil } from 'rxjs/operators';

import { PebMediaComponent } from '@pe/builder-media';
import { MediaType } from '@pe/builder-core';

import { AbstractComponent } from '../../../misc/abstract.component';
import { SelectedMedia } from '../../../behaviors/sidebars/_interfaces/selected-media.interface';

@Component({
  selector: 'editor-studio-media-form',
  templateUrl: './studio-media.form.html',
  styleUrls: ['./studio-media.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorStudioMediaForm extends AbstractComponent {
  @Input() formGroup: FormGroup;
  @Input() label = 'Choose media from payever Studio';
  @Input() type: MediaType = MediaType.Images;

  constructor(
    private dialog: MatDialog,
  ) {
    super();
  }

  openStudio(): void {
    const dialog = this.dialog.open(
      PebMediaComponent,
      {
        position: {
          top: '0',
          left: '0',
        },
        data: {
          type: this.type,
        },
        height: '100vh',
        maxWidth: '100vw',
        width: '100vw',
        panelClass: 'products-dialog',
      },
    );
    dialog.afterClosed().pipe(
      takeUntil(this.destroyed$),
      filter(data => data && data !== ''),
    ).subscribe((data) => {
      if (this.type === MediaType.Images) {
        this.formGroup.patchValue({
          src: data.thumbnail,
        });
      } else if (this.type === MediaType.Videos) {
        this.formGroup.patchValue({
          source: data.sourceUrl,
          preview: data.thumbnail,
        });
      }
    });
  }
}
