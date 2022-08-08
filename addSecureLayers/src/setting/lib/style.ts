import { ThemeVariables, css, SerializedStyles } from 'jimu-core'

export function getStyle (theme: ThemeVariables): SerializedStyles {
  return css`
    .widget-setting {
      font-weight: lighter;
      font-size: 13px;

      .data-selector-section, .map-selector-section {
        width: 100%;

        .url-input, standard-input {
          height: 70px;
        }

        .layers-input {
          height: 300px;
          font-family: consolas;
          font-size: 12px;
          color: #D3AD67;
          width: calc(100% + 30px);
          margin-left: -15px;
        }

        .tooltip {
          margin-top: -2px;
        }

        .popup-input {
          height: 200px;
        }

      }

      .format-tools {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;

        label {
          margin-bottom: 0px;
        }
      }

    }
  `
}
