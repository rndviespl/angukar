export interface Action {
  route: string;
  type: any;
  isActive: boolean;
}

export interface Entity {
  name: string;
  structure: string;
  actions: Action[];
}

export interface apiServiceStructure {
  name: string;
  isActive: boolean;
  description: string;
  entities: Entity[];
}

export interface apiServiceShortStructure {
  name: string;
  isActive : boolean;
  description: string;
}