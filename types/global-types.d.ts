type Url = string;

declare interface ContainsChildren {
  children: React.ReactNode;
}

declare interface ContainsObjectId {
  objectid: string;
}

declare interface ContainsClassName {
  className: string;
}

declare type DTOrthogonalType = 'display' | 'export' | 'filter' | 'sort' | 'type';

declare type DTRenderFunction = (data: string, type: DTOrthogonalType) => string;
