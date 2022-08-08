/** @jsx jsx */
import { React, jsx, FormattedMessage } from 'jimu-core'
import { AllWidgetSettingProps } from 'jimu-for-builder'
import { TextInput, TextArea, Tooltip, Button, NumericInput, Select, Option } from 'jimu-ui'
import { HelpOutlined } from 'jimu-icons/outlined/suggested/help'
import { MapWidgetSelector, SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { ColorPicker } from 'jimu-ui/basic/color-picker'
import { IMConfig } from '../config'

import { getStyle } from './lib/style'

export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>, any> {
  constructor (props) {
    super(props)

    this.state = {
      // Config
      appInfoInput: {
        appId: this.props.config.appInfo.appId,
        portalUrl: this.props.config.appInfo.portalUrl
      },
      textFormatInput: {
        fontSize: this.props.config.textFormat.fontSize,
        textAlign: this.props.config.textFormat.textAlign,
        fontColor: this.props.config.textFormat.fontColor
      },
      dataSources: null,
      layersInput: []
    }
  }

  presetColors = [
    { label: '#050505', value: '#050505', color: '#050505' },
    { label: '#FF9F0A', value: '#FF9F0A', color: '#FF9F0A' },
    { label: '#089BDC', value: '#089BDC', color: '#089BDC' },
    { label: '#FFD159', value: '#FFD159', color: '#FFD159' },
    { label: '#74B566', value: '#74B566', color: '#74B566' },
    { label: '#FF453A', value: '#FF453A', color: '#FF453A' },
    { label: '#9868ED', value: '#9868ED', color: '#9868ED' },
    { label: '#43ABEB', value: '#43ABEB', color: '#43ABEB' }
  ]

  // Výběr mapy
  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    })
  }

  // AppId
  onAppIdChange = (event: any) => {
    this.setState(prevState => ({
      appInfoInput: {
        ...prevState.appInfoInput,
        appId: event.target.value
      }
    }))
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('appInfo', {
        ...this.props.config.appInfo,
        appId: event.target.value
      })
    })
  }

  // Portal URL
  onPortalUrlChange = (event: any) => {
    this.setState(prevState => ({
      appInfoInput: {
        ...prevState.appInfoInput,
        portalUrl: event.target.value
      }
    }))
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('appInfo', {
        ...this.props.config.appInfo,
        portalUrl: event.target.value
      })
    })
  }

  // Datové zdroje - vrstvy
  onDataSourceChange = (event: any) => {
    this.setState(prevState => ({
      dataSources: {
        ...prevState.dataSources,
        dataSources: event.target.value
      }
    }))
  }

  onDataSourceSubmit = () => {
    if (!this.state.dataSources) {
      return
    }
    const layers = []
    let jsonDataSources = null
    const updateDataSources = `{"layers": ${this.state.dataSources.dataSources}}`

    try {
      jsonDataSources = JSON.parse(updateDataSources)
      jsonDataSources.layers.forEach((layer) => {
        layers.push(layer)
      })
    } catch (err) {
      alert(`Zápis JSON nastavení není validní:\n\n'${err}`)
      console.error('Zápis JSON nastavení není validní: ', err)
      return
    }

    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('layers', layers)
    })
  }

  // Velikost textu
  onFontSizeChange = (event: any) => {
    console.log(event)
    this.setState(prevState => ({
      textFormatInput: {
        ...prevState.textFormatInput,
        fontSize: event
      }
    }))
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('textFormat', {
        ...this.props.config.textFormat,
        fontSize: event
      })
    })
  }

  // Zarovnání textu
  onTextAlignChange = (event: any) => {
    this.setState(prevState => ({
      textFormatInput: {
        ...prevState.textFormatInput,
        textAlign: event.target.value
      }
    }))
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('textFormat', {
        ...this.props.config.textFormat,
        textAlign: event.target.value
      })
    })
  }

  // Barva textu
  onFontColorChange = (event: any) => {
    console.log(event)
    this.setState(prevState => ({
      textFormatInput: {
        ...prevState.textFormatInput,
        fontColor: event
      }
    }))
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('textFormat', {
        ...this.props.config.textFormat,
        fontColor: event
      })
    })
  }

  render () {
    return (
      <div css={getStyle(this.props.theme)}>
        <div className="widget-setting">
          <SettingSection>
              <h6 className="setting-text-level-1">Mapa</h6>

              <label className="map-selector-section">
                <span className="text-break setting-text-level-3">Vybrat widget mapy:</span>
                <SettingRow>
                  <MapWidgetSelector useMapWidgetIds={this.props.useMapWidgetIds} onSelect={this.onMapWidgetSelected} />
                </SettingRow>
              </label>

          </SettingSection>

          <SettingSection>
              <h6 className="setting-text-level-1">App Info</h6>

              <label className="data-selector-section">
                <span className="text-break setting-text-level-3">AppId</span>
                <Tooltip title="AppID, přes je aplikace provázána s Vaší organizací (Portal nebo ArcGIS Online)."><Button aria-label="Button" icon size="sm" type="tertiary" className="tooltip"><HelpOutlined/></Button></Tooltip>
                <TextInput className="standard-input" defaultValue={this.props.config.appInfo.appId} placeholder='ID aplikace' onChange={this.onAppIdChange}/>
              </label>

              <label className="data-selector-section">
                <span className="text-break setting-text-level-3">Portal URL</span>
                <Tooltip title="URL Vaší organizace (Portal nebo ArcGIS Online)."><Button aria-label="Button" icon size="sm" type="tertiary" className="tooltip"><HelpOutlined/></Button></Tooltip>
                <TextArea className="mb-2 url-input" defaultValue={this.props.config.appInfo.portalUrl} placeholder='např.: https://mapy.mesto-most.cz/portal' onChange={this.onPortalUrlChange}/>
              </label>
          </SettingSection>

          <SettingSection>
            <label className="data-selector-section">

                <span className="setting-text-level-1 text-break">Vrstvy</span>

                <Tooltip title='Nastavení vrstev, které se vloží do mapy po přihlášení: Vkládat lze vrstvy typu MapImageLayer, Sublayer, FeatureLayer. Vrstvám lze nastavovat veškeré vlastnosti (pop-up, viditelnost, ...), které jsou podporované v ArcGIS JS API 4.x a umožňují autocast. Konfigurace nastavení odpovídá ArcGIS JS API (více dokumentace). Každá vrstva / služba je objekt, který má 3 atributy: type, position, settings. "type" nabývá stringových hodnot FEATURE_LAYER nebo MAP_SERVICE. "position" ovlivňuje pořadí vrstvy v mapě (číslo). "settings" je objekt odpovídající nastavení vrstvy dle dokumentace ArcGIS JS API. PŘ. NASTAVENÍ: [{"type": "FEATURE_LAYER", "position": 2, "settings": {"portalItem": {"id": "8d26f04f3.."}, "title": "Název vrstvy"}},{"type": "MAP_SERVICE", "position": 4, "settings": {"url": "https://hostname/arcgis/rest/services/service/MapServer", "title": "Název vrstvy"}}]'><Button aria-label="Button" icon size="sm" type="tertiary" className="tooltip"><HelpOutlined/></Button></Tooltip>
                <TextArea spellCheck="false" className="mb-1 layers-input" defaultValue={JSON.stringify(this.props.config.layers, null, 2)} placeholder='[{"type": "FEATURE_LAYER", "settings": {"portalItem": {"id": "8d26f04f3.."}, "title": "Název vrstvy"}},{"type": "MAP_SERVICE", "settings": {"url": "https://hostname/arcgis/rest/services/service/MapServer", "title": "Název vrstvy"}}]' onChange={this.onDataSourceChange}/>
            </label>
            <Button onClick={this.onDataSourceSubmit}>Nastavit vrstvy</Button>
          </SettingSection>

          <SettingSection>
              <h6 className="setting-text-level-1">Formátování textu</h6>

              <div className='format-tools'>
                <label><FormattedMessage id='addSecureLayersFontColor' defaultMessage='Barva:' /></label>
                <div>
                  <ColorPicker
                    style={{ padding: '0' }} width={26} height={14}
                    onChange={this.onFontColorChange}
                    presetColors={this.presetColors}
                    color={this.props.config.textFormat.fontColor ? this.props.config.textFormat.fontColor : '#050505'}
                  />
                </div>
              </div>

              <div className='format-tools'>
                <label><FormattedMessage id='addSecureLayersFontSize' defaultMessage='Velikost:' />
                <Tooltip title="Velikost loga uživatele se automaticky přizpůsobí velikosti textu až po restartu aplikace."><Button aria-label="Button" icon size="sm" type="tertiary" className="tooltip"><HelpOutlined/></Button></Tooltip>
                </label>
                <div>
                  <NumericInput
                    style={{ width: '100px' }}
                    defaultValue={this.props.config.textFormat.fontSize ? this.props.config.textFormat.fontSize : 14}
                    formatter={function noRefCheck (size) { return (`${size}px`) }}
                    onChange={this.onFontSizeChange}
                    parser={function noRefCheck (size) { return (size.slice(0, -2)) }}
                    />
                  </div>
              </div>

              <div className='format-tools'>
                <label><FormattedMessage id='addSecureLayersTextAlign' defaultMessage='Zarovnání:' /></label>
                <div>
                  <Select value={this.props.config.textFormat.textAlign ? this.props.config.textFormat.textAlign : 'right'}
                          onChange={this.onTextAlignChange}
                          style={{ width: '100px' }}
                          autoWidth={false}
                        >
                    <Option value='right'>Vpravo</Option>
                    <Option value='left'>Vlevo</Option>
                    <Option value='center'>Na střed</Option>
                  </Select>
                </div>
              </div>

          </SettingSection>
        </div>
      </div>
    )
  }
}
