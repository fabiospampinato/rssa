
/* IMPORT */

import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import Fetch from './fetch';

/* EXTRACT */

const Extract = {

  async page ( options ) {

    const {url, tokens, headless} = options,
          page = await Fetch.do ( url, headless ),
          $ = cheerio['load'] ( page );

    return Extract.tokens ( page, $, tokens );

  },

  tokens ( page, $, tokens ) {

    return _.transform ( tokens, ( acc, value, key ) => {

      acc[key] = Extract.token ( page, $, value );

    }, {} );

  },

  token ( page, $, options ) {

    const extractor = _.isArray ( options ) ? options[0] : options,
          callback = _.isArray ( options ) ? options[1] : _.identity;

    let value;

    if ( _.isRegExp ( extractor ) ) {

      const parts = page.match ( extractor );

      value = parts ? parts[1] : null;

    } else if ( _.isString ( extractor ) ) {

      value = $( extractor ).text ();

    } else if ( _.isFunction ( extractor ) ) {

      value = extractor ( page, $ );

    } else {

      throw new Error ( 'Unsupported extractor' );

    }

    return callback ( value );

  }

};

/* EXPORT */

export default Extract;
