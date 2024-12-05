
type Url = string;

type TableName = 'main';

declare interface HasChildren {
  children: React.ReactNode;
}

declare interface ContainsObjectId {
  objectid: string;
}

declare interface MainRecord {
  objectID:              number;
  objectNumber:          string;
  objectCount:           number;
  medium:                string;
  dimensions:            string;
  dated:                 string;
  department:            string;
  title:                 string;
}

/*
declare interface MainRecord {
  objectID:              number;
  objectNumber:          string;
  objectCount:           number;
  medium:                string;
  dimensions:            string;
  dated:                 string;
  department:            string;
  title:                 string;
  collection:            string;
  series:                string;
  portfolio:             string;
  descriptiveTitle:      string;
  folder:                string;
  locationDepicted:      string;
  nonDisplayTitle:       string;
  titleFromObjects:      string;
  homeLocation:          string;
  filePath:              string;
  role:                  string;
  firstName:             string;
  lastName:              string;
  displayName:           string;
  nationality:           string;
  institution:           string;
  beginDate:             number;
  endDate:               number;
  displayDate:           string;
  prefix:                string;
  suffix:                string;
  after:                 string;
  artist:                string;
  compiler:              string;
  editor:                string;
  photographer:          string;
  photographicPublisher: string;
  printer:               string;
  printmaker:            string;
  publisher:             string;
  sponsor:               string;
  subject:               string;
  country:               string;
  state:                 string;
  county:                string;
  city:                  string;
  locus:                 string;
  geoSearchValue:        string;
}
*/

