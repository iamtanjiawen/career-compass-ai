// app/lib/jobAPIs.js - COMPLETE IMPLEMENTATION with JSearch v2

/**
 * Fetch jobs from JSearch API v2 (scrapes LinkedIn, Indeed, Glassdoor, ZipRecruiter)
 * Your API Key: cb6d33f8afmshe7e3588e2129c24p1e0bb2jsn3110ee6a6336
 * Free Tier: 1000 requests/month
 */
export async function fetchJSearchJobs(jobTitle, location, country) {
  const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
  
  if (!RAPIDAPI_KEY) {
    console.warn('⚠️ RapidAPI key not configured');
    return [];
  }

  try {
    // Build search query
    const searchQuery = location 
      ? `${jobTitle} in ${location}` 
      : `${jobTitle} in ${country}`;

    const params = new URLSearchParams({
      query: searchQuery,
      page: '1',
      num_pages: '1',
      date_posted: 'month' // Jobs from last month
    });

    console.log(`🔍 JSearch API: Searching for "${searchQuery}"`);

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?${params}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`JSearch API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.warn('⚠️ No jobs found from JSearch');
      return [];
    }

    console.log(`✅ Found ${data.data.length} jobs from JSearch`);
    
    // Transform to our format
    return data.data.map(job => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city && job.job_country 
        ? `${job.job_city}, ${job.job_country}` 
        : job.job_country || country,
      salary: formatSalary(job),
      type: job.job_employment_type || 'Full-time',
      url: job.job_apply_link || job.job_google_link, // Direct link to apply
      description: job.job_description 
        ? job.job_description.substring(0, 200) + '...' 
        : 'Click to view full description',
      posted: formatJobDate(job.job_posted_at_timestamp, job.job_posted_at_datetime_utc),
      source: determineJobSource(job.job_publisher), // LinkedIn, Indeed, Glassdoor, etc.
      logo: job.employer_logo,
      isRemote: job.job_is_remote || false,
      benefits: extractBenefits(job.job_highlights),
      requirements: extractRequirements(job.job_highlights)
    })).slice(0, 10);
    
  } catch (error) {
    console.error('❌ JSearch API error:', error.message);
    return [];
  }
}

// Helper: Format salary information
function formatSalary(job) {
  if (job.job_min_salary && job.job_max_salary) {
    const currency = job.job_salary_currency || 'USD';
    const period = job.job_salary_period || 'year';
    
    const min = Math.round(job.job_min_salary);
    const max = Math.round(job.job_max_salary);
    
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}/${period}`;
  }
  
  return job.job_salary_currency ? `${job.job_salary_currency} Competitive` : 'Competitive';
}

// Helper: Format job posted date
function formatJobDate(timestamp, datetimeUtc) {
  if (!timestamp && !datetimeUtc) return 'Recently';
  
  try {
    const date = timestamp 
      ? new Date(timestamp * 1000) 
      : new Date(datetimeUtc);
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch (error) {
    return 'Recently';
  }
}

// Helper: Determine job source (LinkedIn, Indeed, Glassdoor, etc.)
function determineJobSource(publisher) {
  if (!publisher) return 'Job Board';
  
  const source = publisher.toLowerCase();
  
  if (source.includes('linkedin')) return 'LinkedIn';
  if (source.includes('indeed')) return 'Indeed';
  if (source.includes('glassdoor')) return 'Glassdoor';
  if (source.includes('ziprecruiter')) return 'ZipRecruiter';
  if (source.includes('monster')) return 'Monster';
  if (source.includes('careerbuilder')) return 'CareerBuilder';
  
  // Return original publisher name if not recognized
  return publisher.split('.')[0].charAt(0).toUpperCase() + publisher.split('.')[0].slice(1);
}

// Helper: Extract benefits from job highlights
function extractBenefits(highlights) {
  if (!highlights || !highlights.Benefits) return [];
  return highlights.Benefits.slice(0, 3); // Top 3 benefits
}

// Helper: Extract requirements from job highlights
function extractRequirements(highlights) {
  if (!highlights || !highlights.Qualifications) return [];
  return highlights.Qualifications.slice(0, 3); // Top 3 requirements
}

/**
 * Main function to fetch jobs
 * This is what your API route will call
 */
export async function fetchAllJobs(jobTitle, location, country) {
  console.log(`🔍 Fetching jobs for: ${jobTitle} in ${country}`);
  
  try {
    // Use JSearch as primary source
    const jobs = await fetchJSearchJobs(jobTitle, location, country);
    
    if (jobs.length > 0) {
      console.log(`✅ Successfully fetched ${jobs.length} jobs`);
      return jobs;
    }
    
    console.warn('⚠️ No jobs found');
    return [];
    
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    return [];
  }
}

// Generate direct platform search links
export function generateJobSearchLinks(targetRole, country) {
  const encodedRole = encodeURIComponent(targetRole);
  const encodedLocation = encodeURIComponent(country);
  
  return {
    'LinkedIn': `https://www.linkedin.com/jobs/search/?keywords=${encodedRole}&location=${encodedLocation}`,
    'Indeed': getIndeedUrl(country, encodedRole),
    'Glassdoor': `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodedRole}`,
    'JobStreet': getJobStreetUrl(country, encodedRole),
  };
}

function getIndeedUrl(country, encodedRole) {
  const indeedDomains = {
    'Singapore': 'sg.indeed.com',
    'Malaysia': 'malaysia.indeed.com',
    'United Kingdom': 'uk.indeed.com',
    'United States': 'www.indeed.com',
    'Australia': 'au.indeed.com',
    'Canada': 'ca.indeed.com',
    'India': 'www.indeed.co.in',
  };
  
  const domain = indeedDomains[country] || 'www.indeed.com';
  return `https://${domain}/jobs?q=${encodedRole}`;
}

function getJobStreetUrl(country, encodedRole) {
  if (country === 'Singapore') {
    return `https://www.jobstreet.com.sg/en/job-search/${encodedRole}-jobs/`;
  } else if (country === 'Malaysia') {
    return `https://www.jobstreet.com.my/en/job-search/${encodedRole}-jobs/`;
  }
  return `https://www.jobstreet.com/en/job-search/${encodedRole}-jobs/`;
}

// Get company-specific job listings
export function getCompanyJobListings(targetRole, country) {
  const companiesByCountry = {
    'Singapore': ['Google', 'Meta', 'ByteDance', 'Grab', 'Shopee', 'Sea Group', 'Microsoft', 'Amazon'],
    'Malaysia': ['Microsoft', 'Intel', 'Google', 'Motorola', 'ByteDance', 'Shopee', 'Grab', 'Petronas'],
    'United States': ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Tesla', 'Uber'],
    'United Kingdom': ['Google', 'Meta', 'Amazon', 'Microsoft', 'DeepMind', 'Revolut', 'Wise', 'ARM'],
    'India': ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Swiggy', 'Zomato', 'Paytm', 'Infosys'],
    'Australia': ['Atlassian', 'Canva', 'Google', 'Microsoft', 'Amazon', 'Atlassian', 'REA Group'],
    'Canada': ['Shopify', 'Google', 'Amazon', 'Microsoft', 'OpenText', 'BlackBerry', 'Hootsuite'],
  };

  const companies = companiesByCountry[country] || companiesByCountry['United States'];
  
  return companies.slice(0, 8).map(company => ({
    company: company,
    role: targetRole,
    platform: 'LinkedIn',
    url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(targetRole)}&f_C=${encodeURIComponent(company)}&location=${encodeURIComponent(country)}`
  }));
}

// Get job boards by country
export function getJobBoardsByCountry(country) {
  const jobBoards = {
    'Singapore': [
      { name: 'MyCareersFuture', url: 'https://www.mycareersfuture.gov.sg' },
      { name: 'JobStreet Singapore', url: 'https://www.jobstreet.com.sg' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs' },
      { name: 'Indeed Singapore', url: 'https://sg.indeed.com' }
    ],
    'Malaysia': [
      { name: 'JobStreet Malaysia', url: 'https://www.jobstreet.com.my' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs' },
      { name: 'Maukerja', url: 'https://www.maukerja.my' },
      { name: 'Indeed Malaysia', url: 'https://malaysia.indeed.com' },
      { name: 'Ricebowl', url: 'https://www.ricebowl.my' }
    ],
    'United States': [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs' },
      { name: 'Indeed', url: 'https://www.indeed.com' },
      { name: 'Glassdoor', url: 'https://www.glassdoor.com/Job' },
      { name: 'ZipRecruiter', url: 'https://www.ziprecruiter.com' }
    ],
    'United Kingdom': [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs' },
      { name: 'Indeed UK', url: 'https://uk.indeed.com' },
      { name: 'Reed', url: 'https://www.reed.co.uk' },
      { name: 'Totaljobs', url: 'https://www.totaljobs.com' }
    ],
    'Australia': [
      { name: 'Seek', url: 'https://www.seek.com.au' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs' },
      { name: 'Indeed Australia', url: 'https://au.indeed.com' },
      { name: 'CareerOne', url: 'https://www.careerone.com.au' }
    ],
    'Canada': [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs' },
      { name: 'Indeed Canada', url: 'https://ca.indeed.com' },
      { name: 'Workopolis', url: 'https://www.workopolis.com' },
      { name: 'Monster Canada', url: 'https://www.monster.ca' }
    ],
    'India': [
      { name: 'Naukri', url: 'https://www.naukri.com' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs' },
      { name: 'Indeed India', url: 'https://www.indeed.co.in' },
      { name: 'Shine', url: 'https://www.shine.com' }
    ],
    'default': [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs' },
      { name: 'Indeed', url: 'https://www.indeed.com' },
      { name: 'Glassdoor', url: 'https://www.glassdoor.com/Job' }
    ]
  };

  return jobBoards[country] || jobBoards['default'];
}