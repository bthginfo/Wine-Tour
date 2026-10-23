<script lang="ts">
 import HostSpeech from './HostSpeech.svelte';
 import {t} from '#lib/i18n.ts';
 import Icon from './Icon.svelte';
 let {paragraphs,canSpeak=false}:{paragraphs:string[];canSpeak?:boolean}=$props();let expanded=$state(false);
 const entries=$derived(paragraphs.map(text=>{const split=text.indexOf('\n');return split>0&&split<110?{title:text.slice(0,split),body:text.slice(split+1)}:{title:'',body:text};}));
 const topics=$derived(entries.filter(entry=>entry.title));
</script>
<div class="host-background">
 <HostSpeech {paragraphs} enabled={canSpeak}/>
 {#each entries.filter(entry=>!entry.title) as entry}<p>{entry.body}</p>{/each}
 {#if topics.length}
  <div class="host-topic-heading"><span>{t('host.backgroundTopics')} · {topics.length}</span><button type="button" class="text-button" aria-expanded={expanded} onclick={()=>expanded=!expanded}>{expanded?t('host.collapseTopics'):t('host.expandTopics')}<Icon name={expanded?'collapse':'expand'} size={16}/></button></div>
  <div class="host-topics">{#each topics as topic}<details open={expanded}><summary><h4>{topic.title}</h4><Icon name="next" size={16}/></summary><p>{topic.body}</p></details>{/each}</div>
 {/if}
</div>
<style>
 .host-topic-heading .text-button:hover{color:var(--ink)}
 .host-topic-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:26px;padding-top:20px;border-top:1px solid var(--line)}.host-topic-heading>span{font-size:12px;font-weight:650;line-height:1.6}.host-topic-heading .text-button{font-size:12px;min-height:44px;text-align:right;justify-content:flex-end}.host-topics{display:grid;gap:10px;margin-top:12px}.host-topics details{border:1px solid var(--line);border-radius:11px;overflow:hidden;background:var(--surface)}.host-topics summary{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:17px 18px;cursor:pointer;list-style:none;min-height:52px}.host-topics summary::-webkit-details-marker{display:none}.host-topics summary:focus-visible{outline:3px solid #91ac6d;outline-offset:-3px}.host-topics h4{font-size:14px;line-height:1.6;font-weight:650}.host-topics summary>:global(svg){transition:transform .16s ease}.host-topics details[open] summary>:global(svg){transform:rotate(90deg)}.host-topics details>p{padding:0 18px 20px!important;margin:0!important;color:var(--ink)}
 @media(max-width:640px){.host-topic-heading{flex-wrap:wrap;gap:4px}.host-topic-heading .text-button{margin-left:auto}.host-topics h4{font-size:13px}.host-topics summary{padding:15px 14px}.host-topics details>p{padding:0 14px 18px!important}}
</style>
