
/* IMPORT */

const _ = require ( 'lodash' ),
      c = require ( 'chalk' );

/* FEEDS */

module.exports.feeds = {
  filter: ( tokens, tokensOld ) => !tokensOld || tokens.value !== tokensOld.value,
  groups: [{
    name: 'Stock Market',
    tokens: {
      company: '#sectionTitle h1',
      value: ['.sectionQuoteDetail [style]', _.trim]
    },
    template: `[company] ${c.gray ( '[old:value]' )} -> ${c.yellow ( '[value]' )}`,
    feeds: [
      'http://www.reuters.com/finance/stocks/overview?symbol=AAPL.O',
      'http://www.reuters.com/finance/stocks/overview?symbol=GOOGL.O',
      "http://www.reuters.com/finance/stocks/overview?symbol=TSLA.O"
    ]
  }, {
    name: 'Social',
    feeds: [{
      url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      tokens: {
        value: /"view_count":"([0-9]+)"/
      },
      template: `Gangnam Style (Views) ${c.gray ( '[old:value]' )} -> ${c.yellow ( '[value]' )}`
    }, {
      url: 'https://twitter.com/barackobama',
      tokens: {
        value: '.ProfileHeaderCard-bio'
      },
      template: `Barack Obama (Desc) ${c.gray ( '"[old:value]"' )} -> ${c.yellow ( '"[value]"' )}`
    }]
  }, {
    name: 'GitHub',
    tokens: {
      fullname: /"full_name":"([^"]+)",/,
      value: /"stargazers_count":([^"]+),/
    },
    template: `[fullname] (Stars) ${c.gray ( '[old:value]' )} -> ${c.yellow ( '[value]' )}`,
    feeds: [
      'https://api.github.com/repos/twbs/bootstrap',
      'https://api.github.com/repos/fabiospampinato/rssa'
    ]
  }],
  feed: {
    url: 'https://en.wikipedia.org/wiki/Main_Page',
    tokens: {
      value: '#articlecount [title="Special:Statistics"]'
    },
    template: `Wikipedia Articles (EN) ${c.gray ( '[old:value]' )} -> ${c.yellow ( '[value]' )}`
  },
};
