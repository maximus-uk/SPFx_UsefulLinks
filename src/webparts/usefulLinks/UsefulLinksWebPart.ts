import { Version } from '@microsoft/sp-core-library';
import { SPComponentLoader } from '@microsoft/sp-loader';

import {  
  SPHttpClient, 
  SPHttpClientResponse, 
  ISPHttpClientOptions
} from '@microsoft/sp-http';

import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneButton,
  PropertyPaneButtonType,
  IWebPartPropertiesMetadata
} from '@microsoft/sp-webpart-base';

import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

import { escape } from '@microsoft/sp-lodash-subset';
import styles from './UsefulLinksWebPart.module.scss';
import * as strings from 'UsefulLinksWebPartStrings';

//*** Custom Imports ***/
//import UsefulLinksHTML from './UsefulLinksHTML';

// import node module external libraries
require('popper.js');
import 'jquery';
import 'bootstrap';
import './styles/custom.css';

export interface IUsefulLinksWebPartProps {
  description: string;
}

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  LinkGroup : string;
  LinkGroupID : number;
  LinkTeam: string;
  LinkID : number;
  LinkName : string;
  LinkURL : string;
  LinkBrowse : string;
}

export default class UsefulLinksWebPart extends BaseClientSideWebPart<IUsefulLinksWebPartProps> {

  private _getListData(): Promise<ISPLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('Useful Links')/Items?$orderby=LinkGroup&$orderby=LinkID",SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }
  private ButtonClick(oldVal: any): any {  
    let currentWebUrl = this.context.pageContext.web.absoluteUrl; 
    window.open(currentWebUrl+'/Lists/UsefulLinks/AllItems.aspx','_blank');  
    //return "test"  
  }
  private _renderListAsync(): void {
    // Local environment
  if (Environment.type == EnvironmentType.SharePoint ||
          Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getListData()
        .then((response) => {
          this._renderList(response.value);
        });
    }
  }
  private _renderList(items: ISPList[]): void {
    let currentWebUrl = this.context.pageContext.web.absoluteUrl; 
    let html: string = '';
    let prevLinkGroup: string = '';
    let groupCardHTML: string = '';
    let linkHTML: string = '';
    let linkCount: number=0;
    let groupID=1;
    console.log(currentWebUrl); 

    items.forEach((item: ISPList) => {
      let linkGroup: string=item.LinkGroup;
      let linkTeam: string=item.LinkTeam;
      let cardIDName: string=item.LinkGroup.replace(/\s/g, '');        
      let linkGroupId: number=Math.floor(item.LinkGroupID);
      let linkName: string=item.LinkName;
      let groupRef: string="";

      switch(linkGroupId){
        case 3:{
          groupRef="#maxLinks";
          break;
        }
        case 2:{
          groupRef="#buLinks";
          break;
        }
        case 1:{
          groupRef="#teamLinks";
          break;
        }
      }
      console.log(linkTeam);

      const groupContainer: Element = this.domElement.querySelector(groupRef);

      if(linkGroup!==prevLinkGroup){
        groupCardHTML = `<!-- ***** Group `+groupID+` is the ${item.LinkGroup} links ***** -->
                        <div class="card" id="usefulLinks`+cardIDName+`">                     
                          <a class="card-link" data-toggle="collapse" href="#group`+groupID+`" style="text-decoration:none">
                            <div class="card-header">
                              <h5 id="groupTitle`+groupID+`">${item.LinkGroup}</h5>
                              <div class="accordionToggle"></div> 
                            </div>
                          </a>
                          <div id="group`+groupID+`" class="card-body collapse" data-parent="#linksAccordion">
                            <div class="list-group" id="links`+cardIDName+`">
                              <a href="${item.LinkURL}" target="${item.LinkBrowse}">
                                <div class="list-group-item">${item.LinkName}</div>
                              </a>
                            </div>
                          </div>
                        </div>`;
        groupContainer.innerHTML = groupCardHTML;
        groupID++;
      }

    const linkContainer: Element = this.domElement.querySelector('#links'+cardIDName);

    if(linkGroup === prevLinkGroup && linkCount>0){
      $('#links'+cardIDName).append('<a href="${item.LinkURL}" target="${item.LinkBrowse}"><div class="list-group-item">'+linkName+'</div></a>');
      //linkHTML = `<a href="${item.LinkURL}" target="${item.LinkBrowse}"><div class="list-group-item">${item.LinkName}</div></a>`;
      //linkContainer.innerHTML= linkHTML;
    }
    prevLinkGroup = linkGroup;
    linkCount++;
  });
}
  
public render(): void {
    //let currentWebUrl = this.context.pageContext.web.absoluteUrl; 
    let bootstrapCssURL = "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css";
    let fontawesomeCssURL = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/regular.min.css";
    SPComponentLoader.loadCss(bootstrapCssURL);
    SPComponentLoader.loadCss(fontawesomeCssURL);
    
    this.domElement.innerHTML = `
    <div class="usefulLinksSection">
      <div class="row linkContainer" id="usefulLinks">
        <div id="linksAccordion" style="width:100%">                        
          <div id="teamLinks"></div>
          <div id="buLinks"></div>
          <div id="maxLinks"></div>
        </div>
      </div> 
    </div>`;

     this._renderListAsync();        

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
                }),            
                PropertyPaneButton('Edit Links', {
                  text: "Edit Links",
                  buttonType: PropertyPaneButtonType.Primary,
                  onClick: this.ButtonClick.bind(this)  
                })    
              ]
            }
          ]
        }
      ]
    };
  }
}