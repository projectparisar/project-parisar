import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get('city')

    let query = supabase
      .from('aqi_readings')
      .select('*')
      .order('updated_at', { ascending: false })

    if (city) {
      query = query.ilike('city_name', `%${city}%`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      city_name,
      pincode,
      latitude,
      longitude,
      aqi,
      pm25,
      pm10,
      temperature,
      humidity,
      visibility,
      weather_condition,
      no2,
      so2,
      o3,
      wind_speed,
      wind_direction,
      pressure,
      status,
    } = body

    if (!city_name || latitude === undefined || longitude === undefined || aqi === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: city_name, latitude, longitude, aqi' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('aqi_readings')
      .upsert(
        {
          city_name,
          pincode,
          latitude,
          longitude,
          aqi,
          pm25,
          pm10,
          temperature,
          humidity,
          visibility,
          weather_condition,
          no2,
          so2,
          o3,
          wind_speed,
          wind_direction,
          pressure,
          status,
        },
        { onConflict: 'city_name' }
      )
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}