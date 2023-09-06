import * as React from 'react';
import { IDocumentLibViewProps, IDocumentLibViewState } from './IDocumentLibViewProps';
import styles from './DocumentLibView.module.scss';

import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView" 
import { SPHttpClient } from "@microsoft/sp-http"

/*
DocumentLibView Class
*/
export default class DocumentLibView extends React.Component<IDocumentLibViewProps, IDocumentLibViewState> {

  /**
   * Constructor
   */
  constructor(props: IDocumentLibViewProps) {
    super(props);
    
    this.state = {
      items: []
    }
  }

  // Render elements
  public render(): React.ReactElement<IDocumentLibViewProps> {
 
    // Declare ViewFields
    const viewFields: IViewField[] = [
      {
        name: "Name",
        linkPropertyName: "ServerRelativeUrl",
        displayName: "Name",
        sorting: true,
        minWidth: 250,
      }
    ];

    // Declare Group By Fields
    const groupByFields: IGrouping[] = [
      {
        name: "ListItemAllFields.DepartmentName",
        order: GroupOrder.ascending
      },
      {
        name: "ListItemAllFields.DocumentCategory",
        order: GroupOrder.ascending
      },
      {
        name: "ListItemAllFields.DocumentType",
        order: GroupOrder.ascending
      }
    ];


    // Return React response control with
    return (
      <ListView className={styles.documentLibListView}
        items={this.state.items}
        viewFields={viewFields}
        iconFieldName="ServerRelativeUrl"
        compact={true}
        selectionMode={SelectionMode.multiple}
        selection={this._getSelection}
        groupByFields={groupByFields}
        stickyHeader={true} />
    );
  }

  /*
  Web Part get selection method | Only logs selected items in this occasion
  */
  private _getSelection(items: any[]) {
    console.log('Selected items:', items);
  }

  /*
  // Web part mount event
  */
  public componentDidMount(): void {

    // Construct api url by expanding ListItemAllFields, Files and Folders
    const apiRequestURL = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/GetFolderByServerRelativeUrl('/sites/Contoso-Demo/Company Documents')/Files?$expand=ListItemAllFields,Folders,Files`;

    // Call SharePoint Rest endpoint to fetch related data
    this.props.context.spHttpClient.get(apiRequestURL, SPHttpClient.configurations.v1)
      .then(response => { return response.json(); })
      .then(items => {
        this.setState({
          items: items.value ? items.value : []
        });

        // log items
        console.log(items);
      }).catch(error => {
        console.log(error);
      });
  }
}
