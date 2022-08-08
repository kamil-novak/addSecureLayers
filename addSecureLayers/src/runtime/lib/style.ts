import { ThemeVariables, css, SerializedStyles } from 'jimu-core'

export function getStyle (theme: ThemeVariables): SerializedStyles {
  return css`
    .widget-body {
        height: 100%;
        padding-right: 8px;
        padding-left: 8px;
        display: flex;
        align-items: center;
        justify-content: right;
        font-size: 14px;

        .logBox {
          display: flex;
          align-items:center;
        }

        .logBtn {
            text-decoration: underline;
            cursor: pointer;
        }

        .userThb {
            width: 20px;
            height: 20px;
            margin-left: 2px;
          }
        }
        

    }
  `
}
