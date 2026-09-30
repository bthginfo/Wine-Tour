const MAX_EDGE = 1200
const MAX_INPUT_BYTES = 12 * 1024 * 1024

export async function prepareImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.')
  if (file.size > MAX_INPUT_BYTES) throw new Error('The original image is too large. Choose a photo under 12 MB.')
  const source = await createImageBitmap(file)
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(source.width, source.height))
    const width = Math.max(1, Math.round(source.width * scale))
    const height = Math.max(1, Math.round(source.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('This browser cannot prepare the photo.')
    context.drawImage(source, 0, 0, width, height)
    return canvas.toDataURL('image/webp', .82)
  } finally {
    source.close()
  }
}

export const prepareBottlePhoto = prepareImage

async function uploadPreparedImage(preparedDataUrl:string,headers:Record<string,string>):Promise<{url:string;assetId:string}>{
  const image = await (await fetch(preparedDataUrl)).blob()
  const response = await fetch('/api/media/upload', { method:'POST', headers:{'Content-Type':'image/webp',...headers}, body:image, credentials:'same-origin' })
  if(!response.ok)throw new Error('Image upload failed.')
  const result=await response.json() as {url?:string;assetId?:string}
  if(!result.url||!result.assetId)throw new Error('Image upload returned incomplete metadata.')
  return {url:result.url,assetId:result.assetId}
}

export async function uploadBottlePhoto(preparedDataUrl: string): Promise<{url:string;assetId:string}> {
  return uploadPreparedImage(preparedDataUrl,{'X-Vine-Upload':'bottle-photo-v1'})
}

export async function uploadWorkspaceImage(preparedDataUrl:string,workspaceId:string){
  return uploadPreparedImage(preparedDataUrl,{'X-Vine-Upload':'workspace-media-v1','X-Vine-Workspace':workspaceId})
}

export async function uploadWineImage(preparedDataUrl:string,wineId:string){
  return uploadPreparedImage(preparedDataUrl,{'X-Vine-Upload':'catalog-wine-v1','X-Vine-Entity-Id':wineId})
}

export async function deleteBottlePhoto(assetId:string){
  const response=await fetch('/api/media/upload',{
    method:'DELETE',
    headers:{'Content-Type':'application/json','X-Vine-Upload':'bottle-photo-v1'},
    credentials:'same-origin',
    body:JSON.stringify({assetId}),
  })
  if(!response.ok)throw new Error('Bottle photo deletion failed.')
}

export async function deleteWorkspaceImage(assetId:string,workspaceId:string){
  const response=await fetch('/api/media/upload',{method:'DELETE',headers:{'Content-Type':'application/json','X-Vine-Upload':'workspace-media-v1','X-Vine-Workspace':workspaceId},credentials:'same-origin',body:JSON.stringify({assetId})})
  if(!response.ok)throw new Error('Workspace image deletion failed.')
}

export async function deleteWineImage(assetId:string){
  const response=await fetch('/api/media/upload',{method:'DELETE',headers:{'Content-Type':'application/json','X-Vine-Upload':'catalog-wine-v1'},credentials:'same-origin',body:JSON.stringify({assetId})})
  if(!response.ok)throw new Error('Wine image deletion failed.')
}
