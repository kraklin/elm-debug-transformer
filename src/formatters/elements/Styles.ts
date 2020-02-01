import {ITheme} from '../../CommonTypes'

// elm colors
// ---------------
// yellow - da9e26
// green  - 81cf46
// darkgreen - 70b53c
// dark   - 34495e
// blue   - da9e26


export const GreyedOutStyle =  'color: grey; font-weight: normal;';

const ElmLogoElementStyle =
    'width: 12px; height: 12px; display: inline-block; position: relative; top: 2px;background-size: contain; background-repeat: no-repeat; margin-right: 0.5em; background-position: center center; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1NnB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+Cgk8Zz4KCQk8cG9seWdvbiBmaWxsPSIjNUZCNENCIiBwb2ludHM9IjEyOCAxMzUuMDIyMDI5IDcuMDIyODIxMDUgMjU2IDI0OC45Nzc5NzEgMjU2Ij48L3BvbHlnb24+CgkJPHBvbHlnb24gZmlsbD0iI0VFQTQwMCIgcG9pbnRzPSIyMDIuMzMyMzEzIDE5NS4zMTEwNzUgMjU2IDI0OC45Nzk1NTQgMjU2IDE0MS42NDMzODgiPjwvcG9seWdvbj4KCQk8cG9seWdvbiBmaWxsPSIjNTk2Mjc3IiBwb2ludHM9IjEyMC45Nzc5NzEgMTI4IDAgNy4wMjIwMjkyMSAwIDI0OC45Nzk1NTQiPjwvcG9seWdvbj4KCQk8cG9seWdvbiBmaWxsPSIjNUZCNENCIiBwb2ludHM9IjI1NiAxMTMuODA2Mjg0IDI1NiAwIDE0Mi4xOTI5MjQgMCI+PC9wb2x5Z29uPgoJCTxwb2x5Z29uIGZpbGw9IiM4Q0Q2MzYiIHBvaW50cz0iMTk1LjU4MzUwNCA2Ny40MzQyMTU5IDI1NS44NzIzMTIgMTI3LjcyMzAyNCAxOTUuMzA4NTg5IDE4OC4yODY3NDggMTM1LjAxOTc4IDEyNy45OTc5NCI+PC9wb2x5Z29uPgoJCTxwb2x5Z29uIGZpbGw9IiM4Q0Q2MzYiIHBvaW50cz0iNy4wMjEyMzczNyAwIDYyLjc0NjEyMjggNTUuNzI1Njc3MiAxODMuODc1MzM1IDU1LjcyNTY3NzIgMTI4LjE0OTY1OCAwIj48L3BvbHlnb24+CgkJPHBvbHlnb24gZmlsbD0iI0VFQTQwMCIgcG9pbnRzPSIxMjggMTIwLjk3ODc2MyAxODMuMzIxODM5IDY1LjY1NjEzMTUgNzIuNjc3MzY4OSA2NS42NTYxMzE1Ij48L3BvbHlnb24+Cgk8L2c+Cjwvc3ZnPgo=);';

export const lightTheme: ITheme = {
  booleanStyle: 'color: #65b5ca; font-weight: normal;',
  bytesStyle: 'color: #34495e; font-weight: normal;',
  customTypeNameStyle: 'color: #70b53c; font-weight: bold;',
  dataStructureNameStyle: 'color: #70b53c; font-weight: normal;',
  debugTagStyle: 'color: grey; font-weight: normal;',
  elmLogoElementStyle: ElmLogoElementStyle,
  expandableBorderStyle: 'margin-left: 4px; padding-left: 11px; border-left: 1px solid grey;',
  greyedItalicsStyle: 'color: grey; font-weight: normal; font-style: italic;',
  greyedStyle: 'color: grey; font-weight: normal;',
  keyElementStyle: 'color: #34495e; font-weight: normal; font-style: italic;',
  numberStyle: 'color: #da9e26; font-weight: normal;',
  stringStyle: 'color: #65b5ca; font-weight: normal;',
  typeNameStyle: 'color: #70b53c; font-weight: bold;',
}

export const darkTheme: ITheme = {
  ...lightTheme, 
  debugTagStyle: 'color: white; font-weight: normal;',
  keyElementStyle: 'color: #ed78e6; font-weight: normal; font-style: italic;'
}


