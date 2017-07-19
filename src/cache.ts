
/* IMPORT */

import * as _ from 'lodash';
import * as sha1 from 'sha1';
import config from './config';
import Utils from './utils';

/* CACHE */

const Cache = {

  read ( url ) {

    if ( !config.cache.enabled ) return;

    const hash = sha1 ( url );

    return Utils.file.read ( `${config.cache.path}/${hash}` );

  },

  write ( url, content ) {

    if ( !config.cache.enabled ) return;

    const hash = sha1 ( url );

    Utils.file.make ( `${config.cache.path}/${hash}`, content );

  }

};

/* EXPORT */

export default Cache;
