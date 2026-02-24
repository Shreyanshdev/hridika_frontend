export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hridika-jewels.onrender.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api/', '/checkout', '/profile'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
