interface skelJsonData {
  skeleton: any
  bones: any
  slots: any
  ik: any
  transform: any
  path: any
  skins: any
  skinsName: any
  events: any
  eventsName: any
  animations: any
}

declare function skel2Json(binary: ArrayBuffer): skelJsonData

export {
  skel2Json
}
