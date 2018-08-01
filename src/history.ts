
/* IMPORT */

import * as _ from 'lodash';
import config from './config';
import Utils from './utils';

/* HISTORY */

const History = {

  async read () {

    const content = await Utils.file.read ( config.history.path );

    if ( !content ) return {};

    const history = _.attempt ( JSON.parse, content );

    if ( _.isError ( history ) ) return {};

    return history;

  },

  async update ( history, tokensAll ) {

    const date = Date.now ();

    _.forOwn ( tokensAll, ( tokens, url ) => {

      if ( !history[url] ) history[url] = [];

      history[url].push ({ date, tokens });

    });

    return Utils.file.make ( config.history.path, JSON.stringify ( history, undefined, 2 ) );

  },

  getLast ( history, url ) {

    if ( !history[url] || !history[url].length ) return;

    return _.findLast ( history[url], val => val && val['tokens'] );

  }

};

/* EXPORT */

export default History;
