import supabase from './db/supabaseClient.js';

async function testConnection() {
  const { data, error } = await supabase.from('disasters').select('*');
  if (error) {
    console.error('❌ Error connecting to Supabase:', error);
  } else {
    console.log('✅ Supabase connected ✅ Data:', data);
  }
}

testConnection();
