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
</main>
<Contact/>

<style>
	main {
		text-align: center;
		margin: 0 auto;
	}

	/* @media (min-width: 640px) {
		main {
			max-width: none;
		}
	} */
</style>