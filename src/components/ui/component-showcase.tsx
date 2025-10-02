import { LightPullThemeSwitcher } from '@/components/ui/light-pull-theme-switcher';
import { Footer } from '@/components/ui/footer';

export default function ComponentShowcase() {
	return (
		<div className="relative flex min-h-screen flex-col bg-white dark:bg-black transition-colors duration-300">
			{/* Theme Switcher Section */}
			<div className="min-h-screen flex flex-col items-center justify-center">
				<div className="text-center mb-8">
					<h1 className='font-mono text-4xl font-bold text-black dark:text-white mb-4'>
						Interactive Theme Switcher
					</h1>
					<p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
						Pull down the sun/moon to toggle between light and dark theme
					</p>
				</div>
				
				<LightPullThemeSwitcher />
				
				<div className="mt-8 p-6 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
					<h3 className="text-lg font-semibold text-black dark:text-white mb-2">How it works:</h3>
					<ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
						<li>• Click and drag the sun/moon downward</li>
						<li>• Release to toggle the theme</li>
						<li>• Watch the smooth transition between light and dark modes</li>
					</ul>
				</div>
				
				<p className="text-sm text-neutral-500 dark:text-neutral-400 mt-8">
					Scroll down to see the footer component ↓
				</p>
			</div>
			
			{/* Spacer section */}
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className='font-mono text-3xl font-bold text-black dark:text-white mb-4'>
						Portfolio Footer
					</h2>
					<p className="text-lg text-neutral-600 dark:text-neutral-400">
						Professional footer with animated sections and social links
					</p>
				</div>
			</div>
			
			{/* Footer */}
			<Footer />
		</div>
	);
}