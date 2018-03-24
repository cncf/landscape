const isEmbed = window.location.pathname.indexOf('embed=true') !== -1 || window.location.pathname.indexOf('embed=yes') !== -1;
export default isEmbed;
