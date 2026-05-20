import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sowoslejxuesltgmpruh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JtN9t_9DExugGH69zDF6xw_Wz3bg4gf';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
