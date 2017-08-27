
/* IMPORT */

import * as _ from 'lodash';
import * as c from 'chalk';
import {abstract} from './abstract';
import config from '../config';
import Utils from '../utils';

/* TXT */

class txt extends abstract {

  renderedWithColors;

  /* HELPERS */

  _getExtension () {

    return '.txt';

  }

  _removeASCIIcodes ( str ) {

    return str.replace ( /\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '' );

  }

  /* RENDER */

  renderDates () {

    if ( this.lastUpdate ) {

      const date = new Date ( this.lastUpdate ).toString ();

      this.renderLine ( c.cyan ( `Prev update time: ${date}` ) );

    }

    const date = new Date ().toString ();

    this.renderLine ( c.cyan ( `Curr update time: ${date}` ) );

    this.renderLine ();

  }

  renderFeed () {

    Utils.feed.walk ( this.feeds, _.noop, ( group, config, depth ) => {

      this.renderLine ( group.name, depth );

    }, ( feed, config, depth ) => {

      if ( config.filter && !config.filter ( this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll ) ) return;

      const template = this._getTemplate ( config, 'txt' ),
            lines = this._parseTemplate ( template, this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll );

      this.renderLines ( lines, depth );

    });

  }

  renderLines ( lines, depth?, spaces? ) {

    lines.forEach ( line => this.renderLine ( line, depth, spaces ) );

  }

  renderLine ( str = '', depth = 0, spaces = 4 ) {

    const indentation = _.repeat ( _.repeat ( '\u00A0', spaces ), depth );

    this.renderedWithColors += `${indentation}${str}\n`;

  }

  render () {

    this.renderedWithColors = '';

    this.renderDates ();
    this.renderFeed ();

    this.rendered = this._removeASCIIcodes ( this.renderedWithColors );

  }

  /* API */

  log () {

    console.log ( this.renderedWithColors );

  }

  async run ( save, open, log: boolean = true ) {

    await super.run ( save, open );

    if ( log ) this.log ();

  }

}

/* EXPORT */

export {txt};
