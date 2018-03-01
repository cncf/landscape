import React from 'react';
import millify from 'millify';
import formatNumber from '../utils/formatNumber';
import _ from 'lodash';

const getText = ({summary}) => {
  if (!summary.total) {
    return 'There are no cards matching your filters';
  }
  const startText = `You are viewing ${formatNumber(summary.total)} cards with a total`;
  const starsSection = summary.stars ? `of ${formatNumber(summary.stars)} stars` : null;
  const marketCapSection = summary.marketCap ? `market cap of $${millify(summary.marketCap)}` : null;
  const fundingSection = summary.funding ? `funding of $${millify(summary.funding)}` : null;

  const parts = [starsSection, marketCapSection, fundingSection].filter( (x) => !!x);
  const startPartsText = _.slice(parts, 0, -1).join(', ');
  const lastPart = _.slice(parts, -1)[0];
  const text = [startPartsText, lastPart].filter( (x) => !!x).join(' and ');
  return `${startText} ${text}.`;
}

const Summary = ({summary}) => {
  return <h4 className="summary">{getText({summary})}</h4>;
}
export default Summary;
