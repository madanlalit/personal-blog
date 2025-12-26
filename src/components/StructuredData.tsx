import { Helmet } from 'react-helmet-async';

interface WebsiteSchemaProps {
    name?: string;
    description?: string;
    url?: string;
}

interface BlogPostSchemaProps {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    author?: string;
    image?: string;
}

interface PersonSchemaProps {
    name: string;
    url?: string;
    jobTitle?: string;
    location?: string;
}

// Website schema for the homepage
export const WebsiteSchema: React.FC<WebsiteSchemaProps> = ({
    name = "Lalit Madan | Blog",
    description = "Software engineer exploring AI, automation, and building things.",
    url
}) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name,
        description,
        url
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

// BlogPosting schema for individual blog posts
export const BlogPostSchema: React.FC<BlogPostSchemaProps> = ({
    title,
    description,
    url,
    datePublished,
    author = "Lalit Madan",
    image
}) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        url,
        datePublished,
        author: {
            "@type": "Person",
            name: author
        },
        ...(image && { image })
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

// Person schema for about page
export const PersonSchema: React.FC<PersonSchemaProps> = ({
    name,
    url,
    jobTitle = "Software Engineer",
    location = "India"
}) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name,
        url,
        jobTitle,
        address: {
            "@type": "PostalAddress",
            addressCountry: location
        }
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};
