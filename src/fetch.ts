
/* IMPORT */

import * as execa from 'execa';
import * as pify from 'pify';
import * as request from 'request';
import Cache from './cache';
import config from './config';

/* FETCH */

const Fetch = {

  async headless ( url: string ) { // With JS

    try {

      const {stdout} = await execa.shell ( `${config.fetch.chrome_path} --headless --disable-gpu --dump-dom ${url}` );

      return stdout;

    } catch ( e ) {

      return;

    }

  },

  async basic ( url: string ) { // Without JS

    const headers = {
      'User-Agent': 'rssa' // Required by some APIs (ie. GitHub)
    };

    try {

      const response = await pify ( request )({ url, headers });

      return response.toJSON ().body;

    } catch ( e ) {

      return;

    }

  },

  async do ( url: string, headless: boolean = config.fetch.headless ) {

    const cached = await Cache.read ( url );

    if ( cached ) return cached;

    const fetcher = headless ? Fetch.headless : Fetch.basic,
          page = await fetcher ( url );

    if ( page ) Cache.write ( url, page );

    return page;

  }

};

/* EXPORT */

export default Fetch;
