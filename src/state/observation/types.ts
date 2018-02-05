export interface Observation {
  readonly id: string
  readonly districtId: string
  readonly indicatorId: string
  readonly value: number
  // should not be used, until we know for what this value is, confusing with our calculated ranking
  // readonly ranking: string
}

export interface ObservationState {
    readonly byId: {
        readonly [key: string]: Observation
    }
}