import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qazukjdcwnyclupbihyd.supabase.co";
const supabaseAnonKey = "sb_publishable_pGzwIl6nnyk0GdOveffY1w_BYbELyWo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);