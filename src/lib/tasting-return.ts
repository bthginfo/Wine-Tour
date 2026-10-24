export type JoinedTasting={code:string;name:string;step:number;closed:boolean;isHost?:boolean;settings?:Record<string,unknown>};
export type TastingVisit={owner:string;code:string};
const roomCode=/^[A-Z2-9]{6}$/;

export function readTastingVisit(value:string|null,owner:string):TastingVisit|undefined{
 try{const visit=JSON.parse(value||'null');if(owner&&visit?.owner===owner&&roomCode.test(visit.code))return{owner,code:visit.code};}catch{}
}

export function ongoingTasting(rooms:JoinedTasting[],lastCode=''):JoinedTasting|undefined{
 const open=rooms.filter(room=>!room.closed&&roomCode.test(room.code));
 return open.find(room=>room.code===lastCode)||open[0];
}
