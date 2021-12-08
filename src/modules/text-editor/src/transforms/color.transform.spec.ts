import { colorTransform } from './color.transform';
import { rgbToHex } from './utils.transform';

describe('colorTransform', () => {

  let transform: any;
  let execCommandSpy: any;
  let queryCommandValueSpy: any;
  let doc: any;
  let rgb: string;
  let hex: string;

  rgb = 'rgb(23,32,250)';
  hex = rgbToHex(rgb);

  beforeEach(() => {

    transform = colorTransform;

    doc = {
      execCommand() {
        return;
      },
      queryCommandValue() {
        return;
      },

    };

    execCommandSpy = spyOn(doc, 'execCommand').and.callThrough();
    queryCommandValueSpy = spyOn(doc, 'queryCommandValue').and.returnValue(rgb);

  });

  // it('should call queryCommandValue and convert rgbToHex', () = {
  //   const result = transform.get(doc);
  //   expect(queryCommandValueSpy) .toHaveBeenCalled();
  //   expect(result).toEqual(hex);
  // });

  // it('should call execCommand', () = {
  //   transform.change(doc);
  //   expect(execCommandSpy).toHaveBeenCalled();
  // });

});
