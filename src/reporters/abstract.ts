
/* IMPORT */

import * as _ from 'lodash';
import * as openFile from 'open';
import * as path from 'path';
import config from '../config';
import feeds from '../feeds';
import History from '../history';
import Extract from '../extract';
import Utils from '../utils';

/* ABSTRACT */

class abstract {

  feeds; history; lastUpdate; tokensAll; tokensAllOld; savePath; rendered;

  /* HELPERS */

  _getExtension () {

    return '';

  }

  _getTemplate ( config, type, fallback: boolean | string = false ) {

    if ( config.templates && config.templates[type] ) return config.templates[type];

    if ( fallback ) return this._getTemplate ( config, fallback );

    return config.template;

  }

  _getSavePath () {

    const extension = this._getExtension (),
          name = this._replaceDateTokens ( config.report.name ),
          folder = this._replaceDateTokens ( config.report.path );

    return path.join ( folder, `${name}${extension}` );

  }

  _replaceWith ( str, search, replacement ) {

    const regex = new RegExp ( _.escapeRegExp ( search ), 'g' );

    return str.replace ( regex, replacement );

  }

  _replaceTokens ( str, tokens ) {

    _.forOwn ( tokens, ( value, key ) => {

      str = this._replaceWith ( str, `[${key}]`, value );

    });

    return str;

  }

  _replaceDateTokens ( str ) {

    const date = new Date ();

    return this._replaceTokens ( str, {
      year: date.getFullYear (),
      month: _.padStart ( `${date.getMonth ()}`, 2, '0' ),
      day: _.padStart ( `${date.getDate ()}`, 2, '0' ),
      hour: _.padStart ( `${date.getHours ()}`, 2, '0' ),
      minute: _.padStart ( `${date.getMinutes ()}`, 2, '0' ),
      second: _.padStart ( `${date.getSeconds ()}`, 2, '0' ),
      timestamp: Math.floor ( date.getTime () / 1000 )
    });

  }

  _parseTemplate ( template, tokens, tokensOld, tokensAll ) {

    let parsed = _.isFunction ( template ) ? template ( tokens, tokensOld, tokensAll ) : template;

    _.forOwn ( tokens, ( value, key ) => {

      parsed = this._replaceTokens ( parsed, {
        [`${key}`]: value,
        [`old:${key}`]: tokensOld && tokensOld.hasOwnProperty ( key ) ? tokensOld[key] : '-'
      });

    });

    return parsed;

  }

  /* INIT */

  async init () {

    this.feeds = feeds;

    await this.initHistory ();
    this.initLastUpdate ();
    await this.initTokensAll ();
    await this.initTokensAllOld ();

  }

  async initHistory () {

    this.history = await History.read ();

  }

  async initLastUpdate () {

    this.lastUpdate = Math.max ( ..._.compact ( _.flatMap ( this.history, value => _.get ( _.last ( value ), 'date' ) ) ) as number[] );

  }

  async initTokensAll () {

    this.tokensAll = {};

    Utils.feed.walkFeeds ( this.feeds, ( feed, config ) => {

      this.tokensAll[config.url] = Extract.page ( config );

    });

    for ( let url in this.tokensAll ) {

      if ( !this.tokensAll.hasOwnProperty ( url ) ) continue;

      this.tokensAll[url] = await this.tokensAll[url];

    }

  }

  async initTokensAllOld () {

    this.tokensAllOld = {};

    for ( let url in this.tokensAll ) {

      if ( !this.tokensAll.hasOwnProperty ( url ) ) continue;

      this.tokensAllOld[url] = _.get ( History.getLast ( this.history, url ), 'tokens', {} );

    }

  }

  /* RENDER */

  render () {}

  /* API */

  save () {

    Utils.file.make ( this._getSavePath (), this.rendered );

  }

  open () {

    openFile ( this.savePath );

  }

  async run ( save: boolean = config.report.save, open: boolean = false ) {

    await this.init ();
    await this.render ();

    this.savePath = this._getSavePath ();

    if ( save || open ) await this.save ();
    if ( open ) await this.open ();

    History.update ( this.history, this.tokensAll );

  }

}

/* EXPORT */

export {abstract};
