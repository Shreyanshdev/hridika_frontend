export default function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hridika-jewels.onrender.com';

    const routes = [
        '',
        '/about',
        '/products',
        '/articles',
        '/bespoke',
        '/contact',
        '/login',
        '/register',
        '/sizing-chart',
        '/policy/privacy',
        '/policy/shipping',
        '/policy/terms',
    ];

    const staticRoutes = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    const categories = ['bangles', 'brooches', 'necklace', 'rings', 'bracelets'];
    const categoryRoutes = categories.map((route) => ({
        url: `${baseUrl}/category/${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
    }));

    return [...staticRoutes, ...categoryRoutes];
}
