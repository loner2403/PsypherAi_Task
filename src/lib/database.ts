import { supabase } from './supabase'

// Helper function with built-in retry logic
export async function fetchEventsWithRetry(maxRetries = 3) {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {

      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })

      if (error) {
        throw error
      }


      return { data, error: null }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt < maxRetries) {
        // Exponential backoff: wait longer between retries
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)

        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  return { data: null, error: lastError }
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('count', { count: 'exact', head: true })
    
    return { 
      success: !error, 
      count: data, 
      error: error?.message 
    }
  } catch (error) {
    return { 
      success: false, 
      count: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
