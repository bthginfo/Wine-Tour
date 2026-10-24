<script lang="ts">
 import {grapeSvg} from '#lib/illustration-art.ts';
 let {color='#8a5264'}:{color?:string}=$props();const id=$props.id();
</script>
<div class="grape-artwork" aria-hidden="true">{@html grapeSvg(color,id)}</div>
<style>.grape-artwork{width:100%;height:100%;min-height:0}.grape-artwork :global(svg){display:block;width:100%;height:100%}</style>
