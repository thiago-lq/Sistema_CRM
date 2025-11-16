import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://uvwzveuytsxswmlgoskn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2d3p2ZXV5dHN4c3dtbGdvc2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzQ3MjksImV4cCI6MjA3NTkxMDcyOX0.ExF5aTKf_pfTVAz6pfujqNjCg2Y5t9pashh1ZU0-ews'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);