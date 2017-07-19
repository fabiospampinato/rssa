
/* IMPORT */

import * as _ from 'lodash';
import * as absolute from 'absolute';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as pify from 'pify';
import * as requireAbsolute from 'require-absolute';

/* UTILS */

const Utils = {

  require: {

    json ( filepath ) {

      return JSON.parse ( fs.readFileSync ( filepath, { encoding: 'utf8' } ) );

    },

    js ( filepath ) {

      return absolute ( filepath ) ? requireAbsolute ( filepath ) : require ( filepath );

    }

  },

  file: {

    async make ( filepath, content ) {

      await pify ( mkdirp )( path.dirname ( filepath ) );

      return Utils.file.write ( filepath, content );

    },

    async read ( filepath ) {

      try {
        return (  await pify ( fs.readFile )( filepath, { encoding: 'utf8' } ) ).toString ();
      } catch ( e ) {
        return;
      }

    },

    async write ( filepath, content ) {

      return pify ( fs.writeFile )( filepath, content, {} );

    }

  },

  feed: {

    /* WALK */

    walk ( obj, objCallback, groupCallback, feedCallback, sortGroups = false, sortFeeds = false, config = Utils.feed.getConfig ( obj ), depth = 0 ) {

      if ( obj.groups ) { // Running it now ensures that groups are always on top

        const groups = sortGroups ? _.sortBy ( obj.groups, 'name' ) : obj.groups;

        groups.forEach ( group => {

          const newConfig = _.merge ( {}, config, Utils.feed.getConfig ( group ) );

          objCallback ( group, newConfig, depth );

          groupCallback ( group, newConfig, depth );

          Utils.feed.walk ( group, objCallback, groupCallback, feedCallback, sortGroups, sortFeeds, newConfig, depth + 1 );

        });

      }

      if ( obj.feeds ) {

        const feeds = sortFeeds ? _.sortBy ( obj.feeds, 'url' ) : obj.feeds;

        feeds.forEach ( feed => {

          const newConfig = _.merge ( {}, config, Utils.feed.getConfig ( feed ) );

          objCallback ( feed, newConfig, depth );

          feedCallback ( feed, newConfig, depth );

        });

      }

      if ( obj.feed ) {

        const newConfig = _.merge ( {}, config, Utils.feed.getConfig ( obj.feed ) );

        objCallback ( obj.feed, newConfig, depth );

        feedCallback ( obj.feed, newConfig, depth );

      }

    },

    walkGroups ( obj, callback, sortGroups? ) {

      Utils.feed.walk ( obj, _.noop, callback, _.noop, sortGroups );

    },

    walkFeeds ( obj, callback, sortFeeds? ) {

      Utils.feed.walk ( obj, _.noop, _.noop, callback, undefined, sortFeeds );

    },

    /* CONFIG */

    getConfig ( obj ) {

      if ( _.isString ( obj ) ) return Utils.feed.getConfig ({ url: obj }); //FIXME: This probably shouldn't be here

      if ( !_.isPlainObject ( obj ) ) return {};

      return _.omit ( obj, ['groups', 'feeds'] );

    }

  }

};

/* EXPORT */

export default Utils;
