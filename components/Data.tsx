export type CsvExportFormData = {
  indicatorCode: string;
  trainingFlags: string;
  trainingAttribute: string;
  startDate: string | Date;
  endDate: string | Date;
  trainingThemes: string;
  encoding: string;
};
