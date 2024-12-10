// THIS IS AUTOMATICALLY GENERATED. DO NOT EDIT.

type TableName = 'constituents' | 'constituentsxobjects' | 'exhibitions' | 'exhibitionsxobjects' | 'main';

declare interface ConstituentsRecord {
  Constituent_ID: number;
  First_Name: string;
  Last_Name: string;
  Institution: string;
  Display_Name: string;
  Begin_Date: number;
  End_Date: number;
  Display_Date: string;
  Nationality: string;
}

declare interface ConstituentsxobjectsRecord {
  rid: number;
  Constituent_ID: number;
  Object_ID: number;
  Role: string;
}

declare interface ExhibitionsRecord {
  Exhibition_ID: number;
  Department: string;
  Title: string;
  Abbreviation: string;
  Boiler_Text: string;
  Begin_Year: number;
  End_Year: number;
  Display_Date: string;
  Remarks: string;
  Project_Number: string;
  Citation: string;
  Organization_Credit_Line: string;
  Sponsor_Credit_Line: string;
  Sub_Title: string;
  Is_In_House: number;
  Is_Virtual: number;
}

declare interface ExhibitionsxobjectsRecord {
  rid: number;
  Exhibition_ID: number;
  Object_ID: number;
}

declare interface MainRecord {
  Object_ID: number;
  Department: string;
  Object_Number: string;
  Title: string;
  Role: string;
  First_Name: string;
  Last_Name: string;
  Medium: string;
  Dated: string;
  Display_Date: string;
  Nationality: string;
  Home_Location: string;
  Object_Count: number;
  Dimensions: string;
  BeginDate: number;
  EndDate: number;
  GeoSearchValue: string;
  Collection: string;
  Series: string;
  Portfolio: string;
  Descriptive_Title: string;
  Folder: string;
  Depicted_Location: string;
  Non_Display_Title: string;
  Title_From_Objects: string;
  Link: string;
  Display_Name: string;
  Institution: string;
  After: string;
  Explicit_Artist: string;
  Compiler: string;
  Editor: string;
  Photographer: string;
  Printer: string;
  Printmaker: string;
  Publisher: string;
  Sponsor: string;
  Subject: string;
  Country: string;
  State: string;
  County: string;
  City: string;
  Locus: string;
}
