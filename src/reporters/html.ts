
/* IMPORT */

import * as _ from 'lodash';
import {abstract} from './abstract';
import config from '../config';
import Utils from '../utils';

/* HTML */

class html extends abstract {

  /* HELPERS */

  _getExtension () {

    return '.html';

  }

  /* RENDER */

  renderDates () {

    if ( this.lastUpdate ) {

      const date = new Date ( this.lastUpdate ).toUTCString ();

      this.renderLine ( `Prev update time: ${date}`, 'p' );

    }

    const date = new Date ().toUTCString ();

    this.renderLine ( `Curr update time: ${date}`, 'p' );

    this.renderLine ();

  }

  renderFeed () {

    Utils.feed.walk ( this.feeds, _.noop, ( group, config, depth ) => {

      this.renderLine ( group.name, 'h4', depth );

    }, ( feed, config, depth ) => {

      if ( config.filter && !config.filter ( this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll ) ) return;

      const template = this._getTemplate ( config, 'html', 'txt' ),
            line = this._parseTemplate ( template, this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll );

      this.renderLine ( line, 'p', depth );

    });

  }

  renderLine ( str = '', tag = 'span', depth = 0, spaces = 4 ) {

    const indentation = _.repeat ( _.repeat ( '\u00A0', spaces ), depth ); // Avoiding space collapse

    this.rendered += `<${tag}>${indentation}${str}</${tag}>`;

  }

  render () {

    this.rendered = '';

    this.renderDates ();
    this.renderFeed ();

  }

  /* API */

  async run ( save: boolean = config.report.save, open: boolean = true ) {

    return super.run ( save, open );

  }

}

/* EXPORT */

export {html};
