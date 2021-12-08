import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { DebugElement } from '@angular/core';

import { PebEditorSnackbarErrorComponent } from './snackbar-error.component';

describe('Snackbar Component', () => {

  let fixture: ComponentFixture<PebEditorSnackbarErrorComponent>;
  let component: PebEditorSnackbarErrorComponent;
  let el: DebugElement;

  beforeEach(async(() => {

    const interfaceDataMock = {
      width: '100px',
      icon: '',
      text: '',
    };
    const matSnackBarMock = {};

    TestBed.configureTestingModule({
      providers: [
        PebEditorSnackbarErrorComponent,
        { provide: MatSnackBarRef, useValue: matSnackBarMock },
        { provide: MAT_SNACK_BAR_DATA, useValue: interfaceDataMock },
      ],
    }).compileComponents().then(() => {

      fixture = TestBed.createComponent(PebEditorSnackbarErrorComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
    });

  }));

  it('should be defined', () => {

    expect(component).toBeDefined();

  });

  // it('should get styleWidth as data.width', () => {
  //
  //   const styleWidthSpy = spyOnProperty(component, 'styleWidth').and.callThrough();
  //   const width = component.styleWidth;
  //   // calling spy
  //   expect(styleWidthSpy).toHaveBeenCalled();
  //   expect(width).toEqual('100px');
  //
  // });

  // it('should get styleWidth as auto', () => {
  //
  //   component.data.width = undefined;
  //
  //   const styleWidthSpy = spyOnProperty(component, 'styleWidth').and.callThrough();
  //   const width = component.styleWidth;
  //
  //   expect(styleWidthSpy).toHaveBeenCalled();
  //   expect(width).toEqual('auto');
  //
  // });

});
