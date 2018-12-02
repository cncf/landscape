import React from 'react';
const EmbeddedFooter = () => {
  const originalLink = window.location.pathname.replace('&embed=yes', '').replace('&embed=true', '');
  return <h1 style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>
    <a target="_blank" href={originalLink}>View</a> the full interactive landscape
  </h1>
}
export default EmbeddedFooter;
