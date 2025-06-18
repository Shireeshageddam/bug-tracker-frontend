import { createClient } from "@supabase/supabase-js";

const supabaseUrl =  "https://tocxscwaczjjjhhtbzam.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvY3hzY3dhY3pqampoaHRiemFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjYyNzIsImV4cCI6MjA2NTA0MjI3Mn0.9g1bwu-Vbg990mW_Km4qKUqUbnfB1k2KfwlD5Bb5cwk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);