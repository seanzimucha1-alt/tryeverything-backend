// Simple connection test - no Expo dependencies
import fetch from 'node-fetch';

const API_BASE_URL = 'https://tryeverything-backend.vercel.app';
const SUPABASE_URL = 'https://afgnyavcxsvmwpaqxbn.supabase.co';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testBackendConnection() {
  console.log('\n🔗 Testing Vercel Backend Connection...');
  console.log(`Backend URL: ${API_BASE_URL}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend Health Check: OK');
      console.log('Response:', JSON.stringify(data, null, 2));
      return { status: 'success', data };
    } else {
      const text = await response.text();
      console.log(`⚠️  Response: ${text.substring(0, 200)}`);
      return { status: 'reachable', statusCode: response.status };
    }
  } catch (error) {
    console.error('❌ Backend Connection Failed:', error.message);
    return { status: 'error', error: error.message };
  }
}

async function testSupabaseConnection() {
  console.log('\n🔗 Testing Supabase Connection...');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  
  try {
    // Test basic connectivity to Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZ255YXZjeHN2bXdwYXhxYm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjg5ODMsImV4cCI6MjA4Mzk0NDk4M30.172TemagW0zJg8A02whzm1ZdIySwlchXWvBNw2yxfLU',
      },
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Supabase Connection: OK');
      console.log(`✅ Successfully queried products table`);
      console.log(`Sample data count: ${Array.isArray(data) ? data.length : 0}`);
      return { status: 'success', count: Array.isArray(data) ? data.length : 0 };
    } else {
      console.log(`⚠️  Status: ${response.status}`);
      return { status: 'reachable', statusCode: response.status };
    }
  } catch (error) {
    console.error('❌ Supabase Connection Failed:', error.message);
    return { status: 'error', error: error.message };
  }
}

async function testApiEndpoints() {
  console.log('\n📡 Testing API Endpoints...');
  
  const endpoints = [
    { path: '/api/products', name: 'Get Products' },
    { path: '/api/stores', name: 'Get Stores' },
    { path: '/health', name: 'Health Check' },
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint.path}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const status = `${response.status} ${response.statusText}`;
      const mark = response.ok || response.status === 404 ? '✅' : '⚠️ ';
      console.log(`  ${mark} ${endpoint.name}: ${status}`);
    } catch (error) {
      console.log(`  ❌ ${endpoint.name}: ${error.message}`);
    }
  }
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════');
  console.log('🧪 TRY EVERYTHING - Connection Tests');
  console.log('═══════════════════════════════════════════════════');
  
  const results = {};
  
  // Run tests
  results.backend = await testBackendConnection();
  await sleep(500);
  
  results.supabase = await testSupabaseConnection();
  await sleep(500);
  
  await testApiEndpoints();
  
  // Summary
  console.log('\n═══════════════════════════════════════════════════');
  console.log('📊 Test Summary:');
  console.log(`Backend: ${results.backend.status === 'success' ? '✅ Connected' : results.backend.status === 'reachable' ? '⚠️  Reachable' : '❌ Failed'}`);
  console.log(`Supabase: ${results.supabase.status === 'success' ? '✅ Connected' : results.supabase.status === 'reachable' ? '⚠️  Reachable' : '❌ Failed'}`);
  console.log('═══════════════════════════════════════════════════\n');
  
  return results;
}

// Run tests
runAllTests().catch(console.error);
