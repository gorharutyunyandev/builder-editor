import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorImageFilterForm } from './image-filter.form';


describe('Editor Opacity Form', () => {

  let fixture: ComponentFixture<EditorImageFilterForm>;
  let  component: EditorImageFilterForm;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      providers: [
        EditorImageFilterForm,
      ],
    }).compileComponents().then(() => {

      fixture = TestBed.createComponent(EditorImageFilterForm);
      component = fixture.componentInstance;
    });

  }));

  it('should be defined', () => {

    expect(component).toBeDefined();

  });

});
