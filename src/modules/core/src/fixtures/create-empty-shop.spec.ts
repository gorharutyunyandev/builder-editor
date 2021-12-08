// import { getPageUrlByName, pebCreateEmptyPage, pebCreateEmptyShop } from '..';
// import { PebPageVariant } from '../models/client';

// describe('create-empty-shop', () => {

//   it('should pebCreateEmptyPage', () => {

//       const name = 'New Shop';
//       const newShop = pebCreateEmptyPage('New Shop');

//       expect(newShop.name).toEqual(name);

//     });

//   it('should getPageUrlByName', () => {

//       const pageName = 'New Page';
//       let pageVariant = PebPageVariant.Default;

//       expect(getPageUrlByName(pageName, pageVariant)).toEqual('/new-page');

//       pageVariant = PebPageVariant.Front;

//       expect(getPageUrlByName(pageName, pageVariant)).toEqual('/');

//     });

//   it('should pebCreateEmptyShop', () => {

//       expect(pebCreateEmptyShop().routing[0].url).toEqual('/');

//     });

// });
