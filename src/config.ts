
/* IMPORT */

import * as _ from 'lodash';
import {argv} from 'yargs';
import Utils from './utils';

/* CONFIG */

let config = Utils.require.json ( 'config.json' );

if ( argv.config ) {

  config = _.merge ( config, Utils.require.json ( argv.config ) );

}

/* EXPORT */

export default config;
