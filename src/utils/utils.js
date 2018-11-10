// @flow strict
'use strict'

const copyArray = (array: Array<{}>): Array<{}> => array.map( (x: {}): {} => x)

export { copyArray }