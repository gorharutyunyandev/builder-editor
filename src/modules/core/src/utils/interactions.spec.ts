// import { PebPageVariant } from '../models/client';
// import { pebInteractionCreator, PebInteractionType } from './interactions';

// describe('interactions', () => {

//   const interactionCreator = pebInteractionCreator;

//   it('should call the correct function with correct argument', () => {

//       const id = '000';
//       const value = 'value';
//       const product = {
//           id: '000',
//           title: 'product-001',
//         };
//       let interaction: any;

//         // NavigateInternal
//       interaction = {
//           type: PebInteractionType.NavigateInternal,
//           payload: id,
//         };

//       expect(interactionCreator.navigate.internal(id)).toEqual(interaction);

//         // NavigateInternalSpecial
//       interaction = {
//           type: PebInteractionType.NavigateInternalSpecial,
//           payload: {
//               variant: PebPageVariant.Default,
//               value,
//             },
//         };

//       expect(interactionCreator.navigate.internalSpecial(PebPageVariant.Default, value)).toEqual(interaction);

//         // NavigateExternal
//       interaction = {
//           type: PebInteractionType.NavigateExternal,
//           payload: value,
//         };

//       expect(interactionCreator.navigate.external(value)).toEqual(interaction);

//         // NavigationToggleMobileMenu
//       interaction = {
//           type: PebInteractionType.NavigationToggleMobileMenu,
//         };

//       expect(interactionCreator.navigation.toggleMobileMenu()).toEqual(interaction);

//         // NavigationHideMobileMenu
//       interaction = {
//           type: PebInteractionType.NavigationHideMobileMenu,
//         };

//       expect(interactionCreator.navigation.hideMobileMenu()).toEqual(interaction);

//         // NavigationShowDropdown
//       interaction = {
//           type: PebInteractionType.NavigationShowDropdown,
//         };

//       expect(interactionCreator.navigation.showDropdown()).toEqual(interaction);

//         // CartClick
//       interaction = {
//           type: PebInteractionType.CartClick,
//         };

//       expect(interactionCreator.cart.click()).toEqual(interaction);

//         // CategoryToggleFilters
//       interaction = {
//           type: PebInteractionType.CategoryToggleFilters,
//         };

//       expect(interactionCreator.category.toggleFilters()).toEqual(interaction);

//         // CategoryToggleFilter
//       interaction = {
//           type: PebInteractionType.CategoryToggleFilter,
//           payload: value,
//         };

//       expect(interactionCreator.category.toggleFilter(value)).toEqual(interaction);

//         // CategorySort
//       interaction = {
//           type: PebInteractionType.CategorySort,
//           payload: value,
//         };

//       expect(interactionCreator.category.sort(value)).toEqual(interaction);

//         // CategoryResetFilters
//       interaction = {
//           type: PebInteractionType.CategoryResetFilters,
//         };

//       expect(interactionCreator.category.resetFilters()).toEqual(interaction);

//         // CategoryToggleProductsDisplay
//       interaction = {
//           type: PebInteractionType.CategoryToggleProductsDisplay,
//         };

//       expect(interactionCreator.category.toggleProductsDisplay()).toEqual(interaction);

//         // CategorySearchProducts
//       interaction = {
//           type: PebInteractionType.CategorySearchProducts,
//           payload: value,
//         };

//       expect(interactionCreator.category.searchProducts(value)).toEqual(interaction);

//         // ProductNavigateToPage
//       interaction = {
//           type: PebInteractionType.ProductNavigateToPage,
//           payload: id,
//         };

//       expect(interactionCreator.product.navigateToPage(id)).toEqual(interaction);

//         // ProductAddToCart
//       interaction = {
//           type: PebInteractionType.ProductAddToCart,
//           payload: product,
//         };

//       expect(interactionCreator.product.addToCart(product)).toEqual(interaction);

//         // CheckoutOpenAmount
//       interaction = {
//           type: PebInteractionType.CheckoutOpenAmount,
//         };

//       expect(interactionCreator.checkout.openAmount()).toEqual(interaction);

//         // CheckoutOpenQr
//       interaction = {
//           type: PebInteractionType.CheckoutOpenQr,
//         };

//       expect(interactionCreator.checkout.openQr()).toEqual(interaction);

//         // PosCatalogToggleFilters
//       interaction = {
//           type: PebInteractionType.PosCatalogToggleFilters,
//         };

//       expect(interactionCreator.pos.catalog.toggleFilters()).toEqual(interaction);

//         // PosCatalogToggleFilter
//       interaction = {
//           type: PebInteractionType.PosCatalogToggleFilter,
//           payload: value,
//         };

//       expect(interactionCreator.pos.catalog.toggleFilter(value)).toEqual(interaction);

//         // PosCatalogSort
//       interaction = {
//           type: PebInteractionType.PosCatalogSort,
//           payload: value,
//         };

//       expect(interactionCreator.pos.catalog.sort(value)).toEqual(interaction);

//         // PosCatalogResetFilters
//       interaction = {
//           type: PebInteractionType.PosCatalogResetFilters,
//         };

//       expect(interactionCreator.pos.catalog.resetFilters()).toEqual(interaction);

//         // PosCatalogToggleProductsDisplay
//       interaction = {
//           type: PebInteractionType.PosCatalogToggleProductsDisplay,
//         };

//       expect(interactionCreator.pos.catalog.toggleProductsDisplay()).toEqual(interaction);

//         // PosCatalogSearchProducts
//       interaction = {
//           type: PebInteractionType.PosCatalogSearchProducts,
//           payload: value,
//         };

//       expect(interactionCreator.pos.catalog.searchProducts(value)).toEqual(interaction);

//         // PosCatalogShowProductDetails
//       interaction = {
//           type: PebInteractionType.PosCatalogShowProductDetails,
//           payload: id,
//         };

//       expect(interactionCreator.pos.product.showDetails(id)).toEqual(interaction);

//     });

// });
