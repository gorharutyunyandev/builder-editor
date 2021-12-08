import { PebPageType, PebPageVariant, PebScreen } from '..';
import { PebAction } from '../models/action';
import { PebShopThemeSnapshot } from '../models/database';
import { createInitialShopSnapshot, pebActionHandler, pebCompileActions } from './compiler';

describe('compiler', () => {

  let snapshot: PebShopThemeSnapshot;
  let action: PebAction;

  beforeEach(() => {

    const snapshotMock = {
      id: '001',
      hash: 'hash-001',
      shop: {} as any,
      pages: {
        page01: {
          id: '01',
          name: 'name01',
          variant: PebPageVariant.Default,
          type: PebPageType.Master,
          data: {} as any,
          templateId: 'temp01',
          stylesheetIds: {
            [PebScreen.Desktop]: 'style01-desktop',
            [PebScreen.Tablet]: 'style01-table',
            [PebScreen.Mobile]: 'style01-mobile',
          },
          contextId: 'context01',
        } as any,
      },
      templates: {
        temp01: {} as any,
      },
      stylesheets: {
        'style01-desktop': {},
        'style01-table': {},
        'style01-mobile': {},
      },
      contextSchemas: {
        context01: {},
      },
      updatedAt: 'date',
    };

    const actionMock = {
      effects: [
        {
          target: 'shop:elem',
          type: 'shop:init',
          payload: {},
        },
      ],
      affectedPageIds: [],
    };

    snapshot = snapshotMock;
    action = actionMock as any;

  });

  it('should createInitialShopSnapshot', () => {

    const initialSnapshot = {
      id: null,
      hash: null,
      shop: null,
      pages: {},
      templates: {},
      stylesheets: {},
      contextSchemas: {},
      updatedAt: null,
    };

    expect(createInitialShopSnapshot()).toEqual(initialSnapshot);

  });

  it('should pebActionHandler', () => {

    let result: any;

    result = pebActionHandler(snapshot, action);

    expect(result.id).toEqual(snapshot.id);

    action.effects[0].target = 'templates:init';

    result = pebActionHandler(snapshot, action);

    expect(result.templates.init).toEqual({});

    action.effects[0].payload = undefined;

    result = pebActionHandler(snapshot, action);

    expect(result.id).toEqual(snapshot.id);

    action.effects[0].target = 'menu:init';

    expect(() => {
      pebActionHandler(snapshot, action);
    }).toThrowError();

    action.effects[0].type = 'test:test' as any;

    expect(() => {
      pebActionHandler(snapshot, action);
    }).toThrowError();

  });

  it('should pebCompileActions', () => {

    expect(pebCompileActions([action])).toBeTruthy();

  });

});
