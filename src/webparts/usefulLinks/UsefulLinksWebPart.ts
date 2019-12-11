import { Version } from '@microsoft/sp-core-library';
import { SPComponentLoader } from '@microsoft/sp-loader';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './UsefulLinksWebPart.module.scss';
import * as strings from 'UsefulLinksWebPartStrings';

//*** Custom Imports ***/
import UsefulLinksHTML from './UsefulLinksHTML';

// import node modules external libraries
require('popper.js');
//import 'jquery';
import * as $ from 'jquery';
//import 'fontawesome';
import 'bootstrap';
import './styles/custom.css';
//require ("././././node_modules/@fortawesome/fontawesome-free/css/all.min.css");

export interface IUsefulLinksWebPartProps {
  description: string;
}

export default class UsefulLinksWebPart extends BaseClientSideWebPart<IUsefulLinksWebPartProps> {

  public render(): void {

    let bootstrapCssURL = "/node_modules/bootstrap/dist/css/bootstrap.min.css";
    let fontawesomeCssURL = "/node_modules/@fortawesome/fontawesome-free/css/solid.min.css";
    SPComponentLoader.loadCss(bootstrapCssURL);
    SPComponentLoader.loadCss(fontawesomeCssURL);
    this.domElement.innerHTML = UsefulLinksHTML.templateHtml;
    ($('.accordion', this.domElement) as any).accordion();    
/*
    this.domElement.innerHTML = `
      <div class="${ styles.usefulLinks }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description }">${escape(this.properties.description)}</p>
              <a href="https://aka.ms/spfx" class="${ styles.button }">
                <span class="${ styles.label }">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
  */    
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
