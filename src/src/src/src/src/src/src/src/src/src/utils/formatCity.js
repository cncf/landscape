export default function formatCity({city, region, country}) {
  if (!city) {
    return null;
  }
  if (!country) {
    return `${city}, ${region}`;
  }
  if (country === 'United States') {
    return `${city}, ${region}`;
  }
  return `${city}, ${country}`;
}
