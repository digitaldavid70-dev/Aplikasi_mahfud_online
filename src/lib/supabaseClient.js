import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://peofoqzwoivxxivegjob.supabase.co";
// PERHATIAN: Masukkan Key Supabase 'anon public' Anda (yang berawalan eyJ...) di antara tanda kutip di bawah ini:
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlb2ZvcXp3b2l2eHhpdmVnam9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NzI2ODEsImV4cCI6MjA4NjM0ODY4MX0.qPf-pCPd2G9_eEVXVSxTmrJ74q2LxgyDZTFrOZCjZCc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
