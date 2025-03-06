// THIS IS AUTOMATICALLY GENERATED. DO NOT EDIT.

type TableName= "constituents" | "constituentsxobjects" | "exhibitions" | "exhibitionsxobjects" | "main";

/**
 * FILL ME OUT!!!
 *
 * @minItems 1
 */
declare type Constituents = [ConstituentRecord, ...ConstituentRecord[]];

/**
 * ConstituentRecord
 *
 * this is a description
 */
declare interface ConstituentRecord {

  /**
   * this is a description
   */
  Constituent_ID: number;

  /**
   * this is a description
   */
  First_Name: string | null;

  /**
   * this is a description
   */
  Last_Name: string | null;

  /**
   * this is a description
   */
  Institution: string | null;

  /**
   * this is a description
   */
  Display_Name: string;

  /**
   * this is a description
   */
  Begin_Date: number;

  /**
   * this is a description
   */
  End_Date: number;

  /**
   * this is a description
   */
  Display_Date: string | null;

  /**
   * this is a description
   */
  Nationality: string | null;
}

/**
 * xwalk FILL ME OUT!!!
 *
 * @minItems 1
 */
declare type ConstituentsXObjects = [ConstituentsXObjectsRecord, ...ConstituentsXObjectsRecord[]];

/**
 * FILL ME OUT!!!
 */
declare interface ConstituentsXObjectsRecord {
  rid: number;
  Object_ID: number;
  Constituent_ID: number;
  Role: string;
}

/**
 * FILL ME OUT!!!
 *
 * @minItems 1
 */
declare type Exhibitions = [ExhibitionRecord, ...ExhibitionRecord[]];

/**
 * FILL ME OUT!!!
 */
declare interface ExhibitionRecord {
  Exhibition_ID: number;
  Department: string;
  Title: string;
  Abbreviation: string | null;
  Boiler_Text: string | null;
  Begin_Year: number;
  End_Year: number;
  Display_Date: string | null;
  Remarks: string | null;
  Project_Number: string | null;
  Citation: string | null;
  Organization_Credit_Line: string | null;
  Sponsor_Credit_Line: string | null;
  Sub_Title: string | null;
  Is_In_House: number;
  Is_Virtual: number;
}

/**
 * FILL ME OUT!!!
 *
 * @minItems 1
 */
declare type ExhibitionsXObjects = [ExhibitionsXObjectsRecord, ...ExhibitionsXObjectsRecord[]];

/**
 * FILL ME OUT!!!
 */
declare interface ExhibitionsXObjectsRecord {

  /**
   * this is a description
   */
  rid: number;
  Exhibition_ID: number;
  Object_ID: number;
}

/**
 * FILL ME OUT!!!
 *
 * @minItems 1
 */
declare type Main = [MainRecord, ...MainRecord[]];

/**
 * FILL ME OUT!!!
 */
declare interface MainRecord {

  /**
   * this is a description
   */
  Object_ID: number;
  Department: string;
  Object_Number: string;
  Classification: string;
  Title: string | null;
  Role: string | null;
  First_Name: string | null;
  Last_Name: string | null;
  Medium: string | null;
  Dated: string | null;
  Display_Date: string | null;
  Nationality: string | null;
  Catalogue_Raisonne: string | null;
  Call_Number: string | null;
  Home_Location: string | null;
  StatusFlag: string | null;
  Object_Count: number;
  Dimensions: string | null;
  BeginDate: number | null;
  EndDate: number | null;
  GeoSearchValue: string | null;
  Collection: string | null;
  Series: string | null;
  Portfolio: string | null;
  Descriptive_Title: string | null;
  Folder: string | null;
  Depicted_Location: string | null;
  Non_Display_Title: string | null;
  Link: string | null;
  Display_Name: string | null;
  Institution: string | null;
  After: string | null;
  Explicit_Artist: string | null;
  Compiler: string | null;
  Editor: string | null;
  Photographer: string | null;
  Printer: string | null;
  Printmaker: string | null;
  Publisher: string | null;
  Sponsor: string | null;
  Subject: string | null;
  Country: string | null;
  State: string | null;
  County: string | null;
  City: string | null;
  Locus: string | null;
  Signed: string | null;
  Inscribed: string | null;
  Markings: string | null;
  CreditLine: string | null;
  Chat: string | null;
  Description: string | null;
  Notes: string | null;
  Provenance: string | null;
  PubReferences: string | null;
  CuratorialRemarks: string | null;
  RelatedWorks: string | null;
  PublicAccess: number | null;
  PaperFileRef: string | null;
  UserNumber1: string | null;
  ObjectState: string | null;
  HistAttributions: string | null;
  Bibliography: string | null;
  Edition: string | null;
  PaperSupport: string | null;
  IsTemplate: number;
  DateRemarks: string | null;
}
