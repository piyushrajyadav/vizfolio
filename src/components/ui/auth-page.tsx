'use client';

import Link from "next/link";
import { motion } from 'framer-motion';
import { Button } from './button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, signIn } from '@/lib/supabase';

import {
	AtSignIcon,
	ChevronLeftIcon,
	Grid2x2PlusIcon,
	LockIcon,
	EyeIcon,
	EyeOffIcon,
	LoaderIcon,
} from 'lucide-react';
import { Input } from './input';

export function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');

		// Validation
		if (password.length < 6) {
			setError('Password must be at least 6 characters long');
			setLoading(false);
			return;
		}

		if (!isLogin && password !== confirmPassword) {
			setError('Passwords do not match');
			setLoading(false);
			return;
		}

		try {
			if (isLogin) {
				// Sign in
				const { data, error } = await signIn(email, password);
				if (error) {
					setError(error.message);
				} else if (data.user) {
					setSuccess('Successfully signed in! Redirecting...');
					setTimeout(() => {
						router.push('/dashboard');
					}, 1500);
				}
			} else {
				// Sign up
				const { data, error } = await signUp(email, password);
				if (error) {
					setError(error.message);
				} else if (data.user) {
					if (data.user.email_confirmed_at) {
						setSuccess('Account created successfully! Redirecting...');
						setTimeout(() => {
							router.push('/dashboard');
						}, 1500);
					} else {
						setSuccess('Account created successfully! We have sent a confirmation link to your email address. Please check your email (including spam folder) and click the verification link to activate your account.');
					}
				}
			}
		} catch (err) {
			setError('An unexpected error occurred. Please try again.');
			console.error('Auth error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
			<div className="bg-muted/60 relative hidden h-full flex-col border-r p-10 lg:flex">
				<div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
				<div className="z-10 flex items-center gap-2">
					<Grid2x2PlusIcon className="size-6" />
					<p className="text-xl font-semibold">Vizfolio</p>
				</div>
				<div className="z-10 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-xl">
							&ldquo;Vizfolio has helped me showcase my work and land amazing clients faster than ever before.&rdquo;
						</p>
						<footer className="font-mono text-sm font-semibold">
							~ Sarah Chen, UX Designer
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>
			<div className="relative flex min-h-screen flex-col justify-center p-4">
				<div
					aria-hidden
					className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
				>
					<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full" />
				</div>
				<Link href="/" className="absolute top-7 left-5">
					<Button variant="ghost" asChild>
						<span>
							<ChevronLeftIcon className='size-4 me-2' />
							Home
						</span>
					</Button>
				</Link>
				<div className="mx-auto space-y-6 sm:w-sm">
					<div className="flex items-center gap-2 lg:hidden">
						<Grid2x2PlusIcon className="size-6" />
						<p className="text-xl font-semibold">Vizfolio</p>
					</div>
					<div className="flex flex-col space-y-2">
						<h1 className="font-heading text-2xl font-bold tracking-wide">
							{isLogin ? 'Welcome Back!' : 'Create Your Account'}
						</h1>
						<p className="text-muted-foreground text-base">
							{isLogin 
								? 'Sign in to your Vizfolio account to continue building your portfolio.' 
								: 'Join Vizfolio and start creating your professional portfolio today.'}
						</p>
					</div>

					{/* Error/Success Messages */}
					{error && (
						<div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
							{error}
						</div>
					)}
					{success && (
						<div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-md">
							{success}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Email Field */}
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">Email</label>
							<div className="relative">
								<Input
									id="email"
									placeholder="your.email@example.com"
									className="peer ps-9"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={loading}
									required
								/>
								<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
									<AtSignIcon className="size-4" aria-hidden="true" />
								</div>
							</div>
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<label htmlFor="password" className="text-sm font-medium">Password</label>
							<div className="relative">
								<Input
									id="password"
									placeholder="Enter your password (min 6 characters)"
									className="peer ps-9 pr-9"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									minLength={6}
									disabled={loading}
									required
								/>
								<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
									<LockIcon className="size-4" aria-hidden="true" />
								</div>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 hover:text-foreground"
									disabled={loading}
								>
									{showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
								</button>
							</div>
						</div>

						{/* Confirm Password Field - Only for Sign Up */}
						{!isLogin && (
							<div className="space-y-2">
								<label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
								<div className="relative">
									<Input
										id="confirmPassword"
										placeholder="Confirm your password"
										className="peer ps-9"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										minLength={6}
										disabled={loading}
										required
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
										<LockIcon className="size-4" aria-hidden="true" />
									</div>
								</div>
							</div>
						)}

						<Button type="submit" className="w-full" size="lg" disabled={loading}>
							{loading ? (
								<>
									<LoaderIcon className="size-4 mr-2 animate-spin" />
									{isLogin ? 'Signing In...' : 'Creating Account...'}
								</>
							) : (
								isLogin ? 'Sign In' : 'Create Account'
							)}
						</Button>
					</form>

					{/* Toggle between Login/Sign Up */}
					<div className="text-center">
						<p className="text-muted-foreground text-sm">
							{isLogin ? "Don't have an account?" : "Already have an account?"}
						</p>
						<button
							type="button"
							onClick={() => {
								setIsLogin(!isLogin);
								setError('');
								setSuccess('');
							}}
							className="text-primary hover:underline text-sm font-medium"
							disabled={loading}
						>
							{isLogin ? 'Sign up for free' : 'Sign in instead'}
						</button>
					</div>

					<p className="text-muted-foreground mt-8 text-sm text-center">
						By continuing, you agree to our{' '}
						<a
							href="#"
							className="hover:text-primary underline underline-offset-4"
						>
							Terms of Service
						</a>{' '}
						and{' '}
						<a
							href="#"
							className="hover:text-primary underline underline-offset-4"
						>
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</main>
	);
}

function FloatingPaths({ position }: { position: number }) {
	const paths = Array.from({ length: 36 }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
			380 - i * 5 * position
		} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
			152 - i * 5 * position
		} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
			684 - i * 5 * position
		} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		color: `rgba(15,23,42,${0.1 + i * 0.03})`,
		width: 0.5 + i * 0.03,
	}));

	return (
		<div className="pointer-events-none absolute inset-0">
			<svg
				className="h-full w-full text-slate-950 dark:text-white"
				viewBox="0 0 696 316"
				fill="none"
			>
				<title>Background Paths</title>
				{paths.map((path) => (
					<motion.path
						key={path.id}
						d={path.d}
						stroke="currentColor"
						strokeWidth={path.width}
						strokeOpacity={0.1 + path.id * 0.03}
						initial={{ pathLength: 0.3, opacity: 0.6 }}
						animate={{
							pathLength: 1,
							opacity: [0.3, 0.6, 0.3],
							pathOffset: [0, 1, 0],
						}}
						transition={{
							duration: 20 + Math.random() * 10,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				))}
			</svg>
		</div>
	);
}