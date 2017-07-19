
/* IMPORT */

import {argv} from 'yargs';
import config from './config';
import Utils from './utils';

/* FEEDS */

const filepath = argv.feeds || config.feeds.path,
      {feeds} = Utils.require.js ( filepath );

/* EXPORT */

export default feeds;
