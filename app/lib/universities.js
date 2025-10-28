/**
 * Fetch universities from the Hipo University Domains API
 * @param {string} countryName - Full country name (e.g., "Malaysia", "United States")
 * @returns {Promise<Array>} Array of university objects
 */
export async function fetchUniversitiesByCountry(countryName) {
  try {
    const response = await fetch(
      `http://universities.hipolabs.com/search?country=${encodeURIComponent(countryName)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch universities');
    }
    
    const data = await response.json();
    
    // Transform API response to react-select format
    return data.map(uni => ({
      value: uni.name.toLowerCase().replace(/\s+/g, '-'),
      label: uni.name,
      domain: uni.domains?.[0] || null,
      website: uni.web_pages?.[0] || null
    }));
  } catch (error) {
    console.error('Error fetching universities:', error);
    return [];
  }
}

/**
 * Country code to full name mapping for the API
 */
export const countryNameMap = {
  'MY': 'Malaysia',
  'SG': 'Singapore',
  'US': 'United States',
  'UK': 'United Kingdom',
  'AU': 'Australia',
  'CA': 'Canada',
  'IN': 'India',
  'CN': 'China',
  'JP': 'Japan',
  'KR': 'Korea, Republic of',
  'TH': 'Thailand',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'VN': 'Vietnam',
  'NZ': 'New Zealand',
  'FR': 'France',
  'DE': 'Germany',
  'IT': 'Italy',
  'ES': 'Spain',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'BR': 'Brazil',
  'MX': 'Mexico',
  'AR': 'Argentina',
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'NG': 'Nigeria',
  'KE': 'Kenya',
  'AE': 'United Arab Emirates',
  'SA': 'Saudi Arabia',
  'PK': 'Pakistan',
  'BD': 'Bangladesh',
  'LK': 'Sri Lanka',
  'NP': 'Nepal',
  'HK': 'Hong Kong',
  'TW': 'Taiwan',
};
