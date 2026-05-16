require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'test_agent@example.com',
    password: 'testpassword123',
    email_confirm: true,
  });
  if (error) console.error('Error:', error.message);
  else console.log('User created:', data.user.email);
}

main();
