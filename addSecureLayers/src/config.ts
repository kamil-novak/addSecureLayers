import { ImmutableObject } from 'seamless-immutable'

export interface Config {
  appInfo: {
    appId: string
    portalUrl: string
  }
  textFormat: {
    fontSize: number
    textAlign: any
    fontColor: any
  }
  layers: Array<{}>
}

export type IMConfig = ImmutableObject<Config>
