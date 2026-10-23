<script lang="ts">import {page} from '$app/state';import Tasting from '#lib/components/Tasting.svelte';</script>
{#key page.params.code}<Tasting code={page.params.code!.toUpperCase()} hostMode/>{/key}
