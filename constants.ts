
import { Product, User, Bundle } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex@aashok.com',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  role: 'owner',
  purchases: [] // Starting empty to ensure simulated checkout is required
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'The SaaS Blueprint: Zero to $10k MRR',
    description: 'A comprehensive guide to building, launching, and scaling your software business.',
    price: 49.00,
    originalPrice: 99.00,
    category: 'eBook',
    rating: 4.8,
    reviewsCount: 2,
    image: 'https://picsum.photos/seed/saas/800/600',
    features: ['150+ Pages', 'Checklists included', 'Community Access', 'Lifetime Updates'],
    longDescription: 'Master the art of SaaS. This eBook covers everything from ideation to marketing and scaling. Perfect for solo founders and small teams.',
    fileSize: '12MB PDF',
    downloadUrl: '/downloads/saas-blueprint.pdf',
    author: 'Aashok Team',
    pageCount: 154,
    reviews: [
      {
        id: 'r1',
        userName: 'Sarah Jenkins',
        userAvatar: 'https://picsum.photos/seed/sarah/100/100',
        rating: 5,
        comment: 'Absolutely game changing. The marketing section alone is worth 10x the price.',
        date: '2023-11-15'
      },
      {
        id: 'r2',
        userName: 'Mike Ross',
        userAvatar: 'https://picsum.photos/seed/mike/100/100',
        rating: 4,
        comment: 'Very solid advice, though some of the SEO tips are a bit basic.',
        date: '2024-01-20'
      }
    ]
  },
  {
    id: '2',
    title: 'Modern UI/UX Design System Pro',
    description: '1000+ Premium Figma components for lightning fast design workflows.',
    price: 79.00,
    originalPrice: 149.00,
    category: 'Template',
    rating: 4.9,
    reviewsCount: 1,
    image: 'https://picsum.photos/seed/design/800/600',
    features: ['Figma Source File', 'Dark/Light Mode', 'Auto-layout 4.0', 'Free Icons'],
    longDescription: 'Accelerate your design process with this robust UI kit. Built specifically for modern web applications and mobile apps.',
    fileSize: '45MB FIG',
    downloadUrl: '/downloads/design-system.fig',
    reviews: [
      {
        id: 'r3',
        userName: 'Elena Rodriguez',
        userAvatar: 'https://picsum.photos/seed/elena/100/100',
        rating: 5,
        comment: 'Best Figma kit I have ever used. Auto-layout is configured perfectly.',
        date: '2023-12-05'
      }
    ]
  },
  {
    id: '3',
    title: 'Mastering React & Gemini AI',
    description: 'Video course on integrating LLMs into modern web applications.',
    price: 129.00,
    originalPrice: 199.00,
    category: 'Course',
    rating: 5.0,
    reviewsCount: 1,
    image: 'https://picsum.photos/seed/course/800/600',
    features: ['12 Hours HD Video', 'Source Code Access', 'Discord Support', 'Certificate'],
    longDescription: 'Learn how to build the next generation of AI-powered apps. We cover everything from RAG architectures to UI streaming with Gemini.',
    fileSize: '4.2GB MP4',
    downloadUrl: '/downloads/react-gemini-course.zip',
    reviews: [
      {
        id: 'r4',
        userName: 'David Chen',
        userAvatar: 'https://picsum.photos/seed/david/100/100',
        rating: 5,
        comment: 'The Gemini integration sections are pure gold. Highly recommended for devs.',
        date: '2024-02-10'
      }
    ]
  },
  {
    id: '4',
    title: 'SEO Power Toolkit 2024',
    description: 'Custom scripts and tools to automate your technical SEO audits.',
    price: 35.00,
    originalPrice: 50.00,
    category: 'Tool',
    rating: 4.7,
    reviewsCount: 0,
    image: 'https://picsum.photos/seed/seo/800/600',
    features: ['Python Scripts', 'Excel Templates', 'API Connectors', 'Usage Guide'],
    longDescription: 'Automate tedious SEO tasks. These tools help you identify crawl errors, analyze backlinks, and track rankings with minimal effort.',
    fileSize: '5MB ZIP',
    downloadUrl: '/downloads/seo-toolkit.zip',
    reviews: []
  }
];

export const BUNDLES: Bundle[] = [
  {
    id: 'b1',
    title: 'Ultimate Founder Pack',
    description: 'Get the SaaS Blueprint and the SEO Power Toolkit together and save 30%!',
    productIds: ['1', '4'],
    price: 59.00,
    originalPrice: 84.00,
    image: 'https://picsum.photos/seed/bundle1/800/600'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    role: 'Founder @ BloomUI',
    content: 'AashokDigital is my go-to for high-quality templates. The UI kits saved us at least 40 hours of work.',
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  },
  {
    name: 'David Chen',
    role: 'Indie Hacker',
    content: 'The SaaS Blueprint eBook provided the clarity I needed to launch my first product. Highly recommended.',
    avatar: 'https://picsum.photos/seed/david/100/100'
  }
];
