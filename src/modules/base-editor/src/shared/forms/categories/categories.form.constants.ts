export enum CategoryType {
  none = 'none',
  all = 'all',
  custom = 'custom',
}

export interface CategoryTypeOption {
  name: string;
  value: CategoryType;
}

// tslint:disable-next-line: variable-name
export const CategoryTypeOptions: CategoryTypeOption[] = [
  { name: 'None', value: CategoryType.none },
  { name: 'All categories', value: CategoryType.all },
  { name: 'Custom', value: CategoryType.custom },
];
