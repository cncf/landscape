import React from 'react';
import { Timeline } from 'react-twitter-widgets'
import { NavLink } from 'react-router-dom';
import Icon from 'material-ui/Icon';
import _ from 'lodash';
import { OutboundLink } from 'react-ga';
import millify from 'millify';
import relativeDate from 'relative-date';
import { filtersToUrl } from '../utils/syncToUrl';
import formatNumber from '../utils/formatNumber';
import saneName from '../utils/saneName';

const formatDate = function(x) {
  if (x.text) {
    return x.text;
  }
  return relativeDate(new Date(x));
};
const formatTwitter = function(x) {
  const name = x.split('/').slice(-1)[0];
  return '@' + name;
}

import '../styles/itemModal.scss';
import fields from '../types/fields';

const iconGithub = <svg viewBox="0 0 24 24">
    <path fill="#000000" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58
    9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81
    5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18
    9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5
     6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84
    13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39
    18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68
    14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
    </svg>

const cncfTag = function(cncfRelation) {
  const text = _.find(fields.cncfRelation.values, {id: cncfRelation}).tag;
  if (cncfRelation === false) {
    return null;
  }
  if (cncfRelation === 'member') {
    return (<span className="tag tag-blue">
      <span className="tag-value"><NavLink to={filtersToUrl({filters:{cncfRelation: cncfRelation}})}>{text}</NavLink></span>
    </span>)
  }
  return (<NavLink to={filtersToUrl({filters:{cncfRelation: cncfRelation}})} className="tag tag-blue">
    <span className="tag-name">CNCF Project</span>
    <span className="tag-value">{text}</span>
  </NavLink>)
};
const openSourceTag = function(oss) {
  if (!oss) {
    return null;
  }
  return (<NavLink to="/grouping=license&license=open-source" className="tag tag-grass">
    <span className="tag-value">Open Source Software</span>
  </NavLink>)
}
const licenseTag = function(license) {
  const text = _.find(fields.license.values, {id: license}).label;
  return (<NavLink to={filtersToUrl({grouping: 'license', filters:{license: license}})} className="tag tag-green">
    <span className="tag-name">License</span>
    <span className="tag-value">{text}</span>
  </NavLink>);
}
const ItemDialogContent = ({itemInfo}) => {
  const linkToOrganization = filtersToUrl({grouping: 'organization', filters: {organization: itemInfo.organization}});
  const itemCategory = function(path) {
    var separator = <span className="product-category-separator">•</span>;
    var [category, subcategory] = path.split(' / ');
    var categoryMarkup = (
      <NavLink to={`/grouping=landscape&landscape=${saneName(category)}`}>{category}</NavLink>
    )
    var subcategoryMarkup = (
      <NavLink to={filtersToUrl({grouping: 'landscape', filters: {landscape: path}})}>{subcategory}</NavLink>
    )
    return (<span>{[categoryMarkup, separator, subcategoryMarkup]}</span>);
  }
  return (
        <div className="modal-content">
            <div className="product-logo">
              <img src={itemInfo.href} className='product-logo-img'/>
            </div>

            <div className="product-tags">
              <div>{cncfTag(itemInfo.cncfRelation)}</div>
              <div>{openSourceTag(itemInfo.oss)}</div>
              <div>{licenseTag(itemInfo.license)}</div>
            </div>

            <div className="product-scroll">

              <div className="product-main">
                <div className="product-name">{itemInfo.name}</div>
                <div className="product-parent"><NavLink to={linkToOrganization}>{itemInfo.organization}</NavLink></div>
                <div className="product-category">{itemCategory(itemInfo.landscape)}</div>
                <div className="product-description">{itemInfo.description}</div>
              </div>

              <div className="product-properties">
                <div className="product-property row">
                  <div className="product-property-name col col-20">Website</div>
                  <div className="product-property-value col col-80">
                    <OutboundLink eventLabel={itemInfo.homepage_url} to={itemInfo.homepage_url} target="_blank">{itemInfo.homepage_url}</OutboundLink>
                  </div>
                </div>
                {itemInfo.repo_url &&
                <div className="product-property row">
                  <div className="product-property-name col col-20">Repository</div>
                  <div className="product-property-value product-repo col col-80">
                    <OutboundLink eventLabel={itemInfo.repo_url} to={itemInfo.repo_url} target="_blank">{itemInfo.repo_url}</OutboundLink>
                  </div>
                </div>
                }
                {itemInfo.starsAsText &&
                <div className="product-property row">
                  <div className="product-property-name col col-20"></div>
                  <div className="product-property-value col col-80">
                    <span className="product-repo-stars">
                      <Icon>{iconGithub}</Icon>
                      <Icon>star</Icon>
                      {itemInfo.starsAsText}
                    </span>
                  </div>
                </div>
                }
                {itemInfo.crunchbase &&
                <div className="product-property row">
                  <div className="product-property-name col col-20">Crunchbase</div>
                  <div className="product-property-value col col-80">
                    <OutboundLink eventLabel={itemInfo.crunchbase} to={itemInfo.crunchbase} target="_blank">{itemInfo.crunchbase}</OutboundLink>
                  </div>
                </div>
                }
                {itemInfo.crunchbaseData && itemInfo.crunchbaseData.linkedin &&
                <div className="product-property row">
                  <div className="product-property-name col col-20">LinkedIn</div>
                  <div className="product-property-value col col-80">
                    <OutboundLink eventLabel={itemInfo.crunchbaseData.linkedIn} to={itemInfo.crunchbaseData.linkedin} target="_blank">{itemInfo.crunchbaseData.linkedin}</OutboundLink>
                  </div>
                </div>
                }
                <div class="row">
                  <div class="col col-50">
                    {itemInfo.twitter &&
                      <div className="product-property row">
                        <div className="product-property-name col col-40">Twitter</div>
                        <div className="product-property-value col col-60">
                          <OutboundLink eventLabel={itemInfo.twitter} to={itemInfo.twitter} target="_blank">{formatTwitter(itemInfo.twitter)}</OutboundLink>
                        </div>
                      </div>
                    }
                    { itemInfo.firstCommitDate && (
                      <div className="product-property row">
                        <div className="product-property-name col col-40">First Commit</div>
                        <div className="product-property-value tight-col col-60">
                          <OutboundLink eventLabel={itemInfo.firstCommitLink} to={itemInfo.firstCommitLink} target="_blank">{formatDate(itemInfo.firstCommitDate)}</OutboundLink>
                        </div>
                      </div>
                    )
                    }
                    { itemInfo.contributorsCount && (
                      <div className="product-property row">
                        <div className="product-property-name col col-40">Contributors</div>
                        <div className="product-property-value tight-col col-60">
                          <OutboundLink eventLabel={itemInfo.contributorsLink} to={itemInfo.contributorsLink} target="_blank">{itemInfo.contributorsCount}</OutboundLink>
                        </div>
                      </div>
                    )
                    }
                    { itemInfo.headquarters && itemInfo.headquarters !== 'N/A' && (
                      <div className="product-property row">
                        <div className="product-property-name col col-40">Headquarters</div>
                        <div className="product-property-value tight-col col-60"><NavLink to={filtersToUrl({grouping: 'headquarters', filters:{headquarters:itemInfo.headquarters}})}>{itemInfo.headquarters}</NavLink></div>
                      </div>
                    )
                    }
                    {Number.isInteger(itemInfo.amount) && (
                    <div className="product-property row">
                      <div className="product-property-name col col-40">{itemInfo.amountKind === 'funding' ? 'Funding' : 'Market Cap'}</div>
                      {  itemInfo.amountKind === 'funding' &&
                          <div className="product-property-value tight-col col-60">
                            <OutboundLink
                              target="_blank"
                              eventLabel={itemInfo.crunchbase + '#section-funding-rounds'}
                              to={itemInfo.crunchbase + '#section-funding-rounds'}
                            >{'$' + millify(itemInfo.amount)}
                            </OutboundLink>
                          </div>
                      }
                      { itemInfo.amountKind !== 'funding' &&
                          <div className="product-property-value tight-col col-60">
                            <OutboundLink
                              target="_blank"
                              eventLabel={'https://finance.yahoo.com/quote/' + itemInfo.crunchbaseData.ticker}
                              to={'https://finance.yahoo.com/quote/' + itemInfo.crunchbaseData.ticker}
                            >{'$' + millify(itemInfo.amount)}
                            </OutboundLink>
                          </div>
                      }
                    </div>
                    )
                    }
                    {itemInfo.ticker && (
                    <div className="product-property row">
                      <div className="product-property-name col col-40">Ticker</div>
                      <div className="product-property-value tight-col col-60">
                        <OutboundLink target="_blank" eventLabel={"https://finance.yahoo.com/quote/" + itemInfo.ticker} to={"https://finance.yahoo.com/quote/" + itemInfo.ticker}>{itemInfo.ticker}</OutboundLink>
                      </div>
                    </div>
                    )
                    }
                    </div>
                    <div class="col col-50">
                      { itemInfo.twitter && (
                        <div className="product-property row">
                          <div className="product-property-name col col-50">Latest Tweet</div>
                          <div className="product-property-value col col-50">
                            { itemInfo.latestTweetDate && (
                            <OutboundLink eventLabel={itemInfo.latestTweetDate} to={itemInfo.latestTweetDate} target="_blank">{formatDate(itemInfo.latestTweetDate)}</OutboundLink>
                            )}
                          </div>
                        </div>
                      )
                      }
                      { itemInfo.latestCommitDate && (
                        <div className="product-property row">
                          <div className="product-property-name col col-50">Latest Commit</div>
                          <div className="product-property-value col col-50">
                            <OutboundLink eventLabel={itemInfo.latestCommitLink} to={itemInfo.latestCommitLink} target="_blank">{formatDate(itemInfo.latestCommitDate)}</OutboundLink>
                          </div>
                        </div>
                      )
                      }
                      { itemInfo.releaseDate && (
                        <div className="product-property row">
                          <div className="product-property-name col col-50">Latest Release</div>
                          <div className="product-property-value col col-50">
                            <OutboundLink eventLabel={itemInfo.releaseLink} to={itemInfo.releaseLink} target="_blank">{formatDate(itemInfo.releaseDate)}</OutboundLink>
                          </div>
                        </div>
                      )
                      }
                      { itemInfo.crunchbaseData && itemInfo.crunchbaseData.numEmployeesMin && (
                        <div className="product-property row">
                          <div className="product-property-name col col-50">Headcount</div>
                          <div className="product-property-value col col-50">{formatNumber(itemInfo.crunchbaseData.numEmployeesMin)}-{formatNumber(itemInfo.crunchbaseData.numEmployeesMax)}</div>
                        </div>
                      )
                      }
                  </div>
              </div>
            </div>

              { itemInfo.twitter && (
                <div className="product-twitter">
                <Timeline
                  dataSource={{
                    sourceType: 'profile',
                    screenName: itemInfo.twitter.split('/').filter( x => !!x).slice(-1)[0]
                  }}
                  options={{
                    username: itemInfo.name,
                    tweetLimit: 3
                  }}
                  onLoad={() => console.log('Timeline is loaded!')}
                />
                </div>
              )}
            </div>
        </div>
  );
}
export default ItemDialogContent;
