<script lang="ts">
 import copy from '#lib/locales/de/region-profiles.json';
 let {slug}:{slug:string}=$props();const profile=$derived(copy[slug as keyof typeof copy]);
</script>
{#if profile}
 <section class="region-profile" aria-label={profile.title}><span class="eyebrow">LANDSCHAFT & WEIN</span><h3>{profile.title}</h3>
  <svg viewBox="0 0 600 205" role="img" aria-label={profile.caption}>
   {#if slug==='rheinhessen'}
    <path d="M32 99Q150 64 265 98V182H32Z" fill="#c9b389"/><path d="M335 98Q454 60 568 98V182H335Z" fill="#abb09b"/>
    <g stroke="currentColor" stroke-width="2" fill="none" opacity=".7"><path d="M145 101V60m0 16q-21-20-34-7 14 18 34 12m0-8q20-23 34-11-10 20-34 19M451 98V57m0 15q-22-18-34-5 13 15 34 12m0-10q21-22 34-9-11 20-34 20"/><path d="M145 103v49m0-30-24 23m24-9 21 20m285-55v51m0-29-23 20m23-8 24 20"/></g>
    <g fill="#8b754e" opacity=".5">{#each [[67,120],[96,151],[199,130],[231,161],[178,170],[217,111],[45,164],[110,115],[82,173]] as [x,y]}<circle cx={x} cy={y} r="2.5"/>{/each}</g>
    <g fill="#e3e3cd" stroke="#8e967c" stroke-width="1">{#each [[362,122],[403,156],[493,129],[540,158],[481,169],[529,112],[351,167],[417,114],[380,176]] as [x,y]}<path d={'M'+x+','+y+'l12-5 8 8-10 5Z'}/>{/each}</g>
    <text x="145" y="33" text-anchor="middle">Löss</text><text x="451" y="30" text-anchor="middle">Kalkmergel</text>
   {:else}
    <path d={slug==='pfalz'?'M0 106Q38 60 72 81Q111 18 164 77Q203 38 247 101L600 165V205H0Z':'M0 166L147 135L287 39Q307 29 324 51L471 172H600V205H0Z'} fill="var(--profile-hill)"/>
    <path d={slug==='pfalz'?'M0 172Q123 116 257 116Q350 116 433 166H600V205H0Z':'M0 183L137 162L296 71L464 188H600V205H0Z'} fill="var(--profile-front)"/>
    {#if slug==='pfalz'}<g stroke="var(--ink)" stroke-width="2" fill="var(--profile-tree)">{#each [[54,96],[83,85],[113,74],[143,88],[173,81]] as [x,y]}<path d={'M'+x+','+(y+36)+'v-32m-14 20 14-29 14 29Z'}/>{/each}</g><path d="M499 160q-28 12 1 20t-8 25" stroke="#7aacae" stroke-width="20" fill="none"/><text x="103" y="38" text-anchor="middle">Westen</text><text x="513" y="133" text-anchor="middle">Rhein</text>
    {:else}<circle cx="499" cy="45" r="19" fill="#e4c67c"/><g stroke="#c5a65f" stroke-width="2" stroke-linecap="round"><path d="M499 14V7m0 76v-7m-31-31h-7m76 0h-7m-53-22-6-6m56 56-6-6m0-44 6-6m-56 56 6-6"/></g><path d="m469 76-89 50m109-42-86 65" stroke="#c5a65f" stroke-width="1.5" stroke-dasharray="4 6" opacity=".7"/><path d="M425 197q70-18 175-4" stroke="#7aacae" stroke-width="15" fill="none"/><g stroke="var(--muted)" stroke-width="2" opacity=".6"><path d="m301 130 22 11m-34 5 22 11m16-3 22 11m-30 5 22 11"/></g>{/if}
    <g stroke="var(--ink)" stroke-width="1.7" fill="none" stroke-linecap="round">{#each (slug==='pfalz'?[[226,132],[254,135],[282,139],[310,145],[338,151],[366,158]]:[[318,90],[342,111],[365,134],[389,155],[410,174]]) as [x,y]}<path d={'M'+x+','+(y+15)+'v-19m0 5q-10-7-13 1m13-2q8-9 12-1'}/>{/each}</g>
   {/if}
  </svg>
  <div class="profile-parts">{#each profile.parts as part,i}<div><span>0{i+1}</span><h4>{part.title}</h4><p>{part.body}</p></div>{/each}</div><small>{profile.caption}</small>
 </section>
{/if}
<style>
 .region-profile{--profile-hill:#bac5aa;--profile-front:#d6ddc6;--profile-tree:#8c9d7b;margin:30px 0;padding:24px;border:1px solid var(--line);border-radius:14px;background:var(--visual-surface);color:var(--ink)}:global([data-theme=dark]) .region-profile{--profile-hill:#425343;--profile-front:#314634;--profile-tree:#718c66}.region-profile>.eyebrow{font-size:9px}.region-profile>h3{font:700 23px/1.4 Manrope,sans-serif;letter-spacing:-.6px;margin:9px 0 5px}.region-profile>svg{width:100%;height:auto;display:block;max-height:215px;margin:7px 0 17px;border-radius:7px;overflow:hidden}.region-profile text{font:11px 'DM Sans',sans-serif;fill:var(--ink)}.profile-parts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.profile-parts>div{border-top:1px solid var(--line);padding-top:12px}.profile-parts span{font-size:10px;color:var(--muted)}.profile-parts h4{font-size:12px;line-height:1.6;font-weight:650;margin:5px 0}.profile-parts p{font-size:11px!important;line-height:1.8!important;margin:0!important;color:var(--muted)}.region-profile>small{display:block;margin-top:17px;font-size:9px;line-height:1.6;color:var(--muted)}@media(max-width:640px){.region-profile{padding:18px 16px}.region-profile>h3{font-size:21px}.profile-parts{grid-template-columns:minmax(0,1fr);gap:15px}.profile-parts>div{padding-top:11px;display:grid;grid-template-columns:22px minmax(0,1fr);column-gap:9px}.profile-parts span{grid-row:1/3;margin-top:4px}.profile-parts h4{font-size:13px;margin:0 0 4px}.profile-parts p{font-size:12px!important}}
</style>
