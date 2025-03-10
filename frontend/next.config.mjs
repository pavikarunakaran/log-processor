/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true, // Enable the App Router
    },
    env: {
        // Expose environment variables to the frontend
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    },
  };
  
  export default nextConfig;