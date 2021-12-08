// import { Inject, Injectable, Injector, Optional } from '@angular/core';
// import { combineLatest, Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
// import { curry } from 'lodash-es';

// import { CONTEXT_SERVICES } from '@pe/builder-core';

// import { BUILDER_APP_STATE_SERVICE } from '../viewer.constants';
// import { ContextBuilder, ContextParameter, ContextSchema } from './context.service';

// import { access } from 'fs';


// describe('ContextService', () => {
//   let service: ContextBuilder;
//   let schema: ContextSchema;
//   let params: ContextParameter[];
//   let path: string;
//   let state: any;


//   beforeEach(() => {

//     TestBed.configureTestingModule({
//       providers: [
//         ContextBuilder,
//       ],
//     });

//     service = TestBed.get(ContextBuilder);

//   });


//   it('PebTextEditorService should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should create context service', () => {
//     expect(service).toBeDefined();
//   });

//   it('should call state$ property', () => {
//     expect(service.state$).toBeDefined();
//   });


//   it('should test getter state', () => {
//     expect(service.state).toBeUndefined();
//   });

//   it('should call validateSchema method', () => {
//     const spy = spyOn(service, 'validateSchema').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service.validateSchema(schema);
//     expect(spy).toHaveBeenCalledTimes(1);
//   });


//   it('should call resolveParams method', () => {
//     const spy = spyOn(service, '_resolveParams').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service._resolveParams(params);
//     expect(spy).toHaveBeenCalledTimes(1);
//   });
//    /*
//     it('should call resolveStateParameter method', () => {
//       const spy = spyOn(service, 'resolveStateParameter').and.callThrough();
//       expect(spy).not.toHaveBeenCalled();
//       service.resolveStateParameter(path, state);
//       expect(spy).toHaveBeenCalledTimes(1);
//    });
//    */

//   it('should call buildSchema method', () => {
//     const spy = spyOn(service, 'buildSchema').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service.buildSchema(schema);
//     expect(spy).toHaveBeenCalledTimes(1);
//   });


// });
