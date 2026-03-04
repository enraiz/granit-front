import type { ExportFieldDescriptor } from '@granit/data-export';

export const mockFields: ExportFieldDescriptor[] = [
  { propertyPath: 'Email', clrTypeName: 'String', header: 'Email', format: null, order: 1, isNavigation: false },
  { propertyPath: 'FirstName', clrTypeName: 'String', header: 'First Name', format: null, order: 2, isNavigation: false },
  { propertyPath: 'LastName', clrTypeName: 'String', header: 'Last Name', format: null, order: 3, isNavigation: false },
  { propertyPath: 'BirthDate', clrTypeName: 'DateTimeOffset', header: 'Birth Date', format: 'dd/MM/yyyy', order: 4, isNavigation: false },
  { propertyPath: 'Phone', clrTypeName: 'String', header: 'Phone', format: null, order: 5, isNavigation: false },
  { propertyPath: 'Address.City', clrTypeName: 'String', header: 'City', format: null, order: 6, isNavigation: true },
  { propertyPath: 'Address.PostalCode', clrTypeName: 'String', header: 'Postal Code', format: null, order: 7, isNavigation: true },
  { propertyPath: 'Company.Name', clrTypeName: 'String', header: 'Company', format: null, order: 8, isNavigation: true },
  { propertyPath: 'Status', clrTypeName: 'String', header: 'Status', format: null, order: 9, isNavigation: false },
  { propertyPath: 'CreatedAt', clrTypeName: 'DateTimeOffset', header: 'Created At', format: 'dd/MM/yyyy HH:mm', order: 10, isNavigation: false },
];

export const mockPresets = [
  {
    definitionName: 'Guava.PatientExport',
    presetName: 'Monthly report',
    selectedFields: ['Email', 'FirstName', 'LastName', 'Status'],
    format: 'xlsx',
    includeIdForImport: false,
  },
  {
    definitionName: 'Guava.PatientExport',
    presetName: 'Full export',
    selectedFields: ['Email', 'FirstName', 'LastName', 'BirthDate', 'Phone', 'Address.City', 'Address.PostalCode', 'Company.Name', 'Status', 'CreatedAt'],
    format: 'csv',
    includeIdForImport: true,
  },
];
