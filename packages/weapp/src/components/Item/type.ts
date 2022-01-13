export interface Formula {
  sortId: number
  formulaId: string
  rarity: number
  itemId: string
  count: number
  goldCost: number
  apCost: number
  formulaType: string
  buffType: string
  extraOutcomeRate: number
  extraOutcomeGroup: ExtraOutcomeGroup[]
  costs: Cost[]
  requireRooms: RequireRoom[]
  requireStages: RequireStage[]
}

export interface Cost {
  id: string
  count: number
  type: string
}

export interface ExtraOutcomeGroup {
  weight: number
  itemId: string
  itemCount: number
}

export interface RequireRoom {
  roomId: string
  roomLevel: number
  roomCount: number
}

export interface RequireStage {
  stageId: string
  rank: number
}
