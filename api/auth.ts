import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password, action } = req.body

  try {
    let result

    if (action === 'signup') {
      result = await supabase.auth.signUp({
        email,
        password,
      })
    } else if (action === 'login') {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
    } else {
      return res.status(400).json({ error: 'Invalid action' })
    }

    if (result.error) {
      throw result.error
    }

    return res.status(200).json(result.data)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}
