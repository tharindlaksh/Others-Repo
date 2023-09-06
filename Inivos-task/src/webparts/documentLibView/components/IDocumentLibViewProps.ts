import { WebPartContext } from '@microsoft/sp-webpart-base'

/*
Interface for ViewProps
*/
export interface IDocumentLibViewProps {
  context: WebPartContext;
}

/*
Interface for ViewState
*/
export interface IDocumentLibViewState {
  items: any[];
}
