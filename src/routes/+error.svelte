<script lang="ts">
 import {t} from '#lib/i18n.ts';import {page} from '$app/state';import Icon from '#lib/components/Icon.svelte';</script>
<div class="page-content"><div class="empty-state"><span class="teaser-icon peach"><Icon name="help" size={28}/></span><h1>{page.status===404?'Hier steht noch keine Flasche.':'Das hat gerade nicht geklappt.'}</h1><p>{page.error?.message}</p><a href="/" class="button primary">{t('m_90d08e27d5')}<Icon name="right" size={17}/></a></div></div>
