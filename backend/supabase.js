const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Add this line at the top of your file


// console.log(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;