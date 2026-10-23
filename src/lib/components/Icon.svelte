<script lang="ts">
 import { House, Compass, NotebookPen, LibraryBig, Wine, ArrowUpRight, ArrowRight, ArrowLeft, Plus, Search, ChevronRight, ChevronLeft, Check, X, Users, QrCode, Radio, Play, Pause, Settings2, Copy, Download, LogOut, Menu, Sparkles, MapPin, Grape, BookOpen, Heart, CircleHelp, Star, LoaderCircle, Volume2 } from 'lucide-svelte';
 let {name,size=20,...rest}:{name:string;size?:number;[key:string]:any}=$props();
 const icons:Record<string,any>={home:House,compass:Compass,notes:NotebookPen,cellar:LibraryBig,wine:Wine,external:ArrowUpRight,right:ArrowRight,left:ArrowLeft,plus:Plus,search:Search,next:ChevronRight,prev:ChevronLeft,check:Check,close:X,users:Users,qr:QrCode,live:Radio,play:Play,pause:Pause,settings:Settings2,copy:Copy,download:Download,logout:LogOut,menu:Menu,sparkles:Sparkles,pin:MapPin,grape:Grape,book:BookOpen,heart:Heart,help:CircleHelp,star:Star,loader:LoaderCircle,sound:Volume2};
 const Component=$derived(icons[name]||Wine);
</script>
<Component {size} strokeWidth={1.7} aria-hidden="true" {...rest}/>
