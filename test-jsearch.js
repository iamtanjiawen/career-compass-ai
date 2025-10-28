// test-jsearch.js - Place this in your project root
// Run with: node test-jsearch.js

async function testJSearchAPI() {
  const RAPIDAPI_KEY = 'cb6d33f8afmshe7e3588e2129c24p1e0bb2jsn3110ee6a6336';
  
  console.log('🧪 Testing JSearch API...\n');
  
  try {
    const params = new URLSearchParams({
      query: 'Software Developer in Singapore',
      page: '1',
      num_pages: '1',
      date_posted: 'month'
    });

    console.log('📡 Making request to JSearch API...');
    
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

    console.log(`📊 Response status: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ SUCCESS! API is working!\n');
    console.log(`📈 Found ${data.data.length} jobs\n`);
    
    // Display first 3 jobs
    console.log('🎯 Sample Jobs:\n');
    data.data.slice(0, 3).forEach((job, idx) => {
      console.log(`${idx + 1}. ${job.job_title}`);
      console.log(`   Company: ${job.employer_name}`);
      console.log(`   Location: ${job.job_city}, ${job.job_country}`);
      console.log(`   Source: ${job.job_publisher}`);
      console.log(`   Posted: ${job.job_posted_at_datetime_utc}`);
      console.log(`   Apply: ${job.job_apply_link}`);
      console.log('');
    });
    
    console.log('🎉 Your RapidAPI key is working perfectly!\n');
    console.log('💡 Next steps:');
    console.log('   1. Add the key to your .env.local file');
    console.log('   2. Restart your Next.js dev server');
    console.log('   3. Test the app - jobs should load!\n');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if you subscribed to the JSearch API');
    console.log('   2. Verify your API key is correct');
    console.log('   3. Make sure you have requests remaining (1000/month free)');
  }
}

testJSearchAPI();