import { Document, FSNode } from '~/FS/OPFS'
import { all } from '../samples'

interface Folder {
	name: string
	children: Array<Folder | Doc>
}
type Doc = {
	content: string
	name: string
}

export type DemoNode = Folder | Doc

export const demoNodes: DemoNode[] = [
	{
		name: 'Home',
		children: [
			{
				name: 'Movies',
				children: [
					{
						name: 'Action',
						children: [
							{
								name: '2000s',
								children: [
									{ name: 'Gladiator.mp4', content: 'Gladiator' },
									{ name: 'The-Dark-Knight.mp4', content: 'The Dark Knight' },
									{ name: 'Die-Hard-4.mp4', content: 'Die Hard 4' }
								]
							},
							{
								name: '2010s',
								children: [
									{
										name: 'Mad-Max-Fury-Road.mp4',
										content: 'Mad Max: Fury Road'
									},
									{ name: 'John-Wick.mp4', content: 'John Wick' }
								]
							},
							{
								name: '1990s',
								children: [
									{
										name: 'Terminator-2.mp4',
										content: 'Terminator 2: Judgment Day'
									},
									{ name: 'The-Matrix.mp4', content: 'The Matrix' }
								]
							}
						]
					},
					{
						name: 'Comedy',
						children: [
							{
								name: '2000s',
								children: [
									{ name: 'Superbad.mp4', content: 'Superbad' },
									{
										name: 'Anchorman.mp4',
										content: 'Anchorman: The Legend of Ron Burgundy'
									}
								]
							},
							{
								name: '1990s',
								children: [
									{ name: 'Dumb-and-Dumber.mp4', content: 'Dumb and Dumber' },
									{ name: 'The-Big-Lebowski.mp4', content: 'The Big Lebowski' }
								]
							}
						]
					},
					{
						name: 'Drama',
						children: [
							{
								name: '2000s',
								children: [
									{ name: 'American-Beauty.mp4', content: 'American Beauty' },
									{
										name: 'Requiem-for-a-Dream.mp4',
										content: 'Requiem for a Dream'
									}
								]
							},
							{
								name: '1990s',
								children: [
									{
										name: 'Shawshank-Redemption.mp4',
										content: 'The Shawshank Redemption'
									},
									{ name: 'Fight-Club.mp4', content: 'Fight Club' }
								]
							}
						]
					}
				]
			},
			{
				name: 'Music',
				children: [
					{
						name: 'Rock',
						children: [
							{ name: 'Led-Zeppelin-IV.mp3', content: 'Led Zeppelin - IV' },
							{
								name: 'Dark-Side-of-the-Moon.mp3',
								content: 'Pink Floyd - Dark Side of the Moon'
							}
						]
					},
					{
						name: 'Classical',
						children: [
							{
								name: 'Beethoven-Symphony-9.mp3',
								content: 'Beethoven - Symphony No. 9'
							},
							{ name: 'Mozart-Requiem.mp3', content: 'Mozart - Requiem' }
						]
					},
					{
						name: 'Jazz',
						children: [
							{
								name: 'Miles-Davis-Kind-of-Blue.mp3',
								content: 'Miles Davis - Kind of Blue'
							},
							{
								name: 'John-Coltrane-A-Love-Supreme.mp3',
								content: 'John Coltrane - A Love Supreme'
							}
						]
					}
				]
			},
			{
				name: 'Pictures',
				children: [
					{
						name: 'Vacation',
						children: [
							{ name: 'Beach.jpg', content: 'Beach Photo' },
							{ name: 'Mountains.jpg', content: 'Mountain Photo' }
						]
					},
					{
						name: 'Family',
						children: [
							{ name: 'Birthday.jpg', content: 'Birthday Celebration' },
							{ name: 'Christmas.jpg', content: 'Christmas Gathering' }
						]
					}
				]
			},
			{
				name: 'Documents',
				children: [
					{ name: 'Resume.docx', content: 'My Resume' },
					{ name: 'Project-Proposal.pdf', content: 'Project Proposal' },
					{ name: 'Report.xlsx', content: 'Annual Report' }
				]
			},
			{
				name: 'Work',
				children: [
					{
						name: 'Projects',
						children: [
							{ name: 'Website-Redesign', content: 'Website Redesign Project' },
							{ name: 'App-Development', content: 'App Development Project' }
						]
					},
					{
						name: 'Meetings',
						children: [
							{
								name: '2024-08-01-Meeting-Notes.docx',
								content: 'Notes from August 1st Meeting'
							},
							{
								name: '2024-08-10-Meeting-Agenda.pdf',
								content: 'Agenda for August 10th Meeting'
							}
						]
					}
				]
			},
			{ name: 'passwords.txt', content: 'List of passwords' }
		]
	}
] as const

export const nextApp: DemoNode[] = [
	{
		name: 'MyNextApp',
		children: [
			{
				name: 'pages',
				children: [
					{ name: 'main.tsx', content: all },

					{
						name: 'index.tsx',
						content:
							'export default function Home() { return <div>Home Page</div>; }'
					},
					{
						name: '_app.tsx',
						content:
							'import "../styles/globals.css"; function MyApp({ Component, pageProps }) { return <Component {...pageProps} />; } export default MyApp;'
					},
					{
						name: '_document.tsx',
						content:
							'import Document, { Html, Head, Main, NextScript } from "next/document"; class MyDocument extends Document { render() { return (<Html><Head /><body><Main /><NextScript /></body></Html>); }} export default MyDocument;'
					},
					{
						name: 'about',
						children: [
							{
								name: 'index.tsx',
								content:
									'export default function About() { return <div>About Us</div>; }'
							}
						]
					},
					{
						name: 'blog',
						children: [
							{
								name: '[id].tsx',
								content:
									'export default function BlogPost({ params }) { return <div>Blog Post {params.id}</div>; }'
							},
							{
								name: 'index.tsx',
								content:
									'export default function Blog() { return <div>Blog Home Page</div>; }'
							}
						]
					},
					{
						name: 'products',
						children: [
							{
								name: '[id].tsx',
								content:
									'export default function ProductPage({ params }) { return <div>Product {params.id}</div>; }'
							},
							{
								name: 'index.tsx',
								content:
									'export default function Products() { return <div>Product Listing</div>; }'
							},
							{
								name: 'categories',
								children: [
									{
										name: '[category].tsx',
										content:
											'export default function CategoryPage({ params }) { return <div>Category {params.category}</div>; }'
									}
								]
							}
						]
					}
				]
			},
			{
				name: 'components',
				children: [
					{
						name: 'Header.tsx',
						content:
							'export default function Header() { return <header>Header Component</header>; }'
					},
					{
						name: 'Footer.tsx',
						content:
							'export default function Footer() { return <footer>Footer Component</footer>; }'
					},
					{
						name: 'Navbar.tsx',
						content:
							'export default function Navbar() { return <nav>Navbar Component</nav>; }'
					},
					{
						name: 'ProductCard.tsx',
						content:
							'export default function ProductCard({ product }) { return <div>{product.name}</div>; }'
					},
					{
						name: 'BlogPostCard.tsx',
						content:
							'export default function BlogPostCard({ post }) { return <div>{post.title}</div>; }'
					},
					{
						name: 'Layout.tsx',
						content:
							'export default function Layout({ children }) { return (<><Header /><main>{children}</main><Footer /></>); }'
					}
				]
			},
			{
				name: 'styles',
				children: [
					{
						name: 'globals.css',
						content: 'body { margin: 0; font-family: Arial, sans-serif; }'
					},
					{ name: 'Home.module.css', content: '.home { padding: 2rem; }' },
					{ name: 'About.module.css', content: '.about { color: blue; }' },
					{
						name: 'Products.module.css',
						content: '.product-card { border: 1px solid #ddd; padding: 1rem; }'
					}
				]
			},
			{
				name: 'public',
				children: [
					{ name: 'favicon.ico', content: 'Binary content of favicon.ico' },
					{ name: 'logo.png', content: 'Binary content of logo.png' }
				]
			},
			{
				name: 'utils',
				children: [
					{
						name: 'api.ts',
						content:
							'export async function fetchProducts() { return await fetch("/api/products").then(res => res.json()); }'
					},
					{
						name: 'helpers.ts',
						content:
							'export function formatPrice(price: number) { return `$${price.toFixed(2)}`; }'
					},
					{
						name: 'validators.ts',
						content:
							'export function validateEmail(email: string) { return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email); }'
					}
				]
			},
			{
				name: 'api',
				children: [
					{
						name: 'products.ts',
						content:
							'export default function handler(req, res) { res.status(200).json([{ id: 1, name: "Product 1" }, { id: 2, name: "Product 2" }]); }'
					},
					{
						name: 'blog.ts',
						content:
							'export default function handler(req, res) { res.status(200).json([{ id: 1, title: "First Post" }, { id: 2, title: "Second Post" }]); }'
					}
				]
			},
			{
				name: 'config',
				children: [
					{
						name: 'next.config.js',
						content: 'module.exports = { reactStrictMode: true };'
					},
					{
						name: 'eslint.config.js',
						content:
							'module.exports = { extends: ["next", "next/core-web-vitals"] };'
					}
				]
			},
			{
				name: 'hooks',
				children: [
					{
						name: 'useProduct.ts',
						content:
							'import { useEffect, useState } from "react"; import { fetchProducts } from "../utils/api"; export default function useProduct() { const [products, setProducts] = useState([]); useEffect(() => { fetchProducts().then(setProducts); }, []); return products; }'
					},
					{
						name: 'useAuth.ts',
						content:
							'import { useState, useEffect } from "react"; export default function useAuth() { const [user, setUser] = useState(null); useEffect(() => { /* Simulate an auth check */ setTimeout(() => setUser({ name: "John Doe" }), 1000); }, []); return user; }'
					}
				]
			},
			{
				name: 'contexts',
				children: [
					{
						name: 'AuthContext.tsx',
						content:
							'import { createContext, useContext, useState } from "react"; const AuthContext = createContext(null); export const AuthProvider = ({ children }) => { const [user, setUser] = useState(null); return (<AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>); }; export const useAuth = () => useContext(AuthContext);'
					}
				]
			},
			{
				name: 'lib',
				children: [
					{
						name: 'db.ts',
						content:
							'import { MongoClient } from "mongodb"; const client = new MongoClient(process.env.MONGO_URI); export async function connectToDatabase() { if (!client.isConnected()) await client.connect(); return client.db(); }'
					},
					{
						name: 'auth.ts',
						content:
							'import { getSession } from "next-auth/client"; export async function checkAuth(ctx) { const session = await getSession(ctx); if (!session) { return { redirect: { destination: "/login", permanent: false } }; } return { props: { session } }; }'
					}
				]
			},
			{
				name: 'pages/api',
				children: [
					{
						name: 'login.ts',
						content:
							'import { signIn } from "next-auth/client"; export default function handler(req, res) { signIn("credentials", { redirect: false, username: req.body.username, password: req.body.password }); res.status(200).end(); }'
					},
					{
						name: 'logout.ts',
						content:
							'import { signOut } from "next-auth/client"; export default function handler(req, res) { signOut({ redirect: false }); res.status(200).end(); }'
					}
				]
			},
			{
				name: 'README.md',
				content:
					'# MyNextApp\n\nThis is a Next.js project with a focus on modular design and scalability.'
			},
			{
				name: 'package.json',
				content:
					'{ "name": "mynextapp", "version": "1.0.0", "scripts": { "dev": "next dev", "build": "next build", "start": "next start" }, "dependencies": { "next": "latest", "react": "latest", "react-dom": "latest", "mongodb": "^4.1.0", "next-auth": "^3.28.0" } }'
			},
			{
				name: 'tsconfig.json',
				content:
					'{ "compilerOptions": { "target": "es5", "lib": ["dom", "dom.iterable", "esnext"], "allowJs": true, "skipLibCheck": true, "strict": true, "forceConsistentCasingInFileNames": true, "noEmit": true, "esModuleInterop": true, "module": "esnext", "moduleResolution": "node", "resolveJsonModule": true, "isolatedModules": true, "jsx": "preserve", "incremental": true }, "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"], "exclude": ["node_modules"] }'
			},
			{
				name: '.eslintrc.js',
				content:
					'module.exports = { extends: ["next", "next/core-web-vitals"] };'
			},
			{
				name: '.gitignore',
				content:
					'/node_modules\n/.next\n/out\n.DS_Store\n.env.local\n.env.development.local\n.env.test.local\n.env.production.local\n\nnode_modules\n/.next\n/out\n*.log\n*.lock\n*.pid\n*.seed\n*.tsbuildinfo'
			}
		]
	}
] as const
