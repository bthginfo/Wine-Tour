<script lang="ts">
 import {t} from '#lib/i18n.ts';
 import Icon from './Icon.svelte';
 let {open=$bindable(false),title,children}:{open:boolean;title:string;children:any}=$props();let dialog:HTMLDialogElement;const titleId=$props.id();
 $effect(()=>{if(!dialog)return;if(open&&!dialog.open)dialog.showModal();if(!open&&dialog.open)dialog.close();});
</script>
<dialog bind:this={dialog} aria-labelledby={titleId} onclose={()=>open=false} onclick={(e)=>{if(e.target===dialog)open=false;}} onkeydown={(e)=>{if(e.key==='Escape')open=false;}}>
 <div class="modal"><div class="modal-heading"><h2 id={titleId}>{title}</h2><button class="icon-button" onclick={()=>open=false} aria-label={t('m_44424b1870')}><Icon name="close"/></button></div>{@render children()}</div>
</dialog>
