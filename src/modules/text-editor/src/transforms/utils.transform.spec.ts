// import { getParentElementByTag, rgbToHex } from './utils.transform';

// describe('rgbToHex and getParentElementByTag', () => {

//   const rgb = 'rgb(22,250,33)';
//   const rgbSpaced = 'rgb(22 250 33)';
//   const hex = '#16fa21';

//   const doc = jasmine.createSpyObj('doc', [
//     'getSelection',
//   ]);

//   doc.getSelection.and.returnValue(null);

//   it('should test rgbToHex', () => {
//     expect(rgbToHex(rgb)).toEqual(hex);
//     expect(rgbToHex('')).toBeFalsy();
//     expect(rgbToHex(rgbSpaced)).toEqual(hex);
//     expect(rgbToHex('rgb(2,3,4)')).toEqual('#020304');
//   });

//   it('should test getParentElementByTag', () => {
//     expect(getParentElementByTag(doc, 'A')).toBeFalsy();

//   });

// });
