/** @jsx jsx */
import { React, AllWidgetProps, jsx, SessionManager } from 'jimu-core'
import { IMConfig } from '../config'
import { JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import FeatureLayer from 'esri/layers/FeatureLayer'
import MapImageLayer from 'esri/layers/MapImageLayer'

import { getStyle } from './lib/style'
const userSvg = require('./assets/user.svg')

// Interface
interface IState {
  jimuMapView: JimuMapView
  userSession: any
  trySignIn: number
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, IState> {
  signInRef: React.RefObject<HTMLDivElement>
  constructor (props) {
    super(props)
    this.signInRef = React.createRef()
  }

  // State
  state = {
    jimuMapView: null,
    userSession: null,
    trySignIn: 0
  }

  // Inicializační funkce
  // Spustí se po načtení view, viz metoda render
  initWidget = async (jmv: JimuMapView) => {
    if (jmv) {
      this.setState({
        jimuMapView: jmv
      })
      const userSession = await SessionManager.getInstance().getMainSession()
      if (userSession) {
        this.toggleLoginInfo(userSession)
        this.addLayers()
        this.signInRef.current.removeEventListener('click', this.signInHandler, true)
      }
    }
  }

  // Přihlášení
  signInHandler = async () => {
    this.setState({
      trySignIn: this.state.trySignIn + 1
    })
    if (this.state.trySignIn > 0) {
      SessionManager.instance = null
    }
    const userSession = await SessionManager.getInstance().signIn('/', true, this.props.config.appInfo.portalUrl, this.props.config.appInfo.appId)
    if (this.state.trySignIn > 1) {
      // Ošetření vlastního bugu: Při opakovaném otevření a zavření přihlašovacího okna, po úspěšném přihlášení za nezjištěných okolností
      // nedojde k přidání vrstev a je vyvoláno znovu přihlašovací okno. Dočasným řešením je reload aplikace
      location.reload()
    }
    this.setState({
      userSession: userSession,
      trySignIn: 0
    })
    if (userSession) {
      this.toggleLoginInfo(userSession)
      this.addLayers()
    }
  }

  // Odhlášení
  signOutHandler = async () => {
    const userSession = await SessionManager.getInstance().getMainSession()
    SessionManager.getInstance().removeSession(userSession)
    this.toggleLoginInfo(null)
    console.log(SessionManager.getInstance())
    SessionManager.getInstance().signOut()
    location.reload()
  }

  // Přidávání vrstev
  addLayers = async () => {
    const layers: any = this.props.config.layers
    const mapLayersState = []
    if (layers.length < 1) {
      return
    }
    for (const layer of layers) {
      if (layer.type === 'FEATURE_LAYER') {
        const featureLayer = new FeatureLayer(layer.settings)
        try {
          await this.state.jimuMapView.view.map.add(featureLayer, 'manual')
          if (layer.position) {
            mapLayersState.push({ id: featureLayer.id, position: layer.position, title: featureLayer.title })
          }
        } catch (err) {
          console.error('Vrstvu se nepodařilo přidat do mapy: ', err)
        }
      }
      if (layer.type === 'MAP_SERVICE') {
        const mapImageLayer = new MapImageLayer(layer.settings)
        try {
          await this.state.jimuMapView.view.map.add(mapImageLayer, 'manual')
          if (layer.position) {
            mapLayersState.push({ id: mapImageLayer.id, position: layer.position, title: mapImageLayer.title })
          }
        } catch (err) {
          console.error('Vrstvu se nepodařilo přidat do mapy: ', err)
        }
      }
    }

    mapLayersState.forEach((mapLayerState) => {
      const countMapLayers = this.state.jimuMapView.view.map.toJSON().operationalLayers.length
      const layer = this.state.jimuMapView.view.map.findLayerById(mapLayerState.id)
      this.state.jimuMapView.view.map.reorder(layer, countMapLayers - mapLayerState.position)
    })
  }

  // Modifikace HTML elementu
  toggleLoginInfo = async (userSession) => {
    this.setState({
      userSession: userSession
    })

    if (userSession) {
      const user = await userSession.getUser()
      const username = user.username
      const thumbnail = user.thumbnail ? `${this.props.portalUrl}/sharing/rest/community/users/${username}/info/${user.thumbnail}` : userSvg

      this.signInRef.current.innerHTML = `<span><span class="logBtn">Odhlásit</span> | ${username}</span> 
                                          <img style="width: ${this.props.config.textFormat.fontSize + 6}px; height: ${this.props.config.textFormat.fontSize + 6}px" class="userThb" src="${thumbnail}" />`
      this.signInRef.current.removeEventListener('click', this.signInHandler, true)
      this.signInRef.current.addEventListener('click', this.signOutHandler, true)
    } else {
      this.signInRef.current.innerHTML = '<span class="logBtn">Přihlásit</span>'
      this.signInRef.current.removeEventListener('click', this.signOutHandler, true)
      this.signInRef.current.addEventListener('click', this.signInHandler, true)
    }
  }

  // Render
  render () {
    return (
      <div css={getStyle(this.props.theme)} style={{ height: '100%' }}>
        <div className="widget-body" style={{ fontSize: this.props.config.textFormat.fontSize, justifyContent: this.props.config.textFormat.textAlign, color: this.props.config.textFormat.fontColor }}>
          {/* Navázání na widget mapy  */}
          { Object.prototype.hasOwnProperty.call(this.props, 'useMapWidgetIds') &&
            this.props.useMapWidgetIds &&
            this.props.useMapWidgetIds[0] && (
              <JimuMapViewComponent
                useMapWidgetId={this.props.useMapWidgetIds?.[0]}
                onActiveViewChange={this.initWidget}
              />
          )
        }
          <div className='logBox' ref={this.signInRef}>
            <span className='logBtn' onClick={this.signInHandler}>Přihlásit</span>
          </div>
        </div>
      </div>
    )
  }
}
