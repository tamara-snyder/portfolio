<script>
	import Header from './Header.svelte'
	import Overview from './Overview.svelte'
	import About from './About.svelte'
	import Contact from './Contact.svelte'
	import Portfolio from './Portfolio.svelte'
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
</style>