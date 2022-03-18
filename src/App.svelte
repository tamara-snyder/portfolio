<script>
	import Header from './Header.svelte'
	import Home from './Home.svelte'
	import Overview from './Overview.svelte'
	import About from './About.svelte'
	import Contact from './Contact.svelte'
	import Portfolio from './Portfolio.svelte'
	import BonusAbout from './BonusAbout.svelte'
	export let name
</script>

<Header/>
<main>
	<Overview/>
	<About/>
	<Portfolio/>
	<BonusAbout/>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>
<Contact/>

<style>
	main {
		text-align: center;
		/* max-width: 240px; */
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>