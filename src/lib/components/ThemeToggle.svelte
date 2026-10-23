<script lang="ts">
 import {onMount}from'svelte';let dark=$state(false);
 onMount(()=>{dark=document.documentElement.dataset.theme==='dark';});
 function toggle(){dark=!dark;document.documentElement.dataset.theme=dark?'dark':'light';localStorage.setItem('sip:theme',dark?'dark':'light');document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#151c19':'#f7f8f5');}
</script>
<button class="icon-button theme-toggle" onclick={toggle} aria-label={dark?'Helles Design aktivieren':'Dunkles Design aktivieren'} title={dark?'Helles Design':'Dunkles Design'} aria-pressed={dark}>{#if dark}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>{:else}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/></svg>{/if}</button>
