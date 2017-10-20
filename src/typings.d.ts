declare namespace NodeJS
{
  interface Global
  {
    SCRIPT_VERSION: number
    lastTick: number
    LastMemory: Memory
    Memory: Memory
    roomData: { [key: string]: RoomData }
  }
}

interface RawMemory
{
  _parsed: Memory
}

interface Memory
{
  log: any;
}

interface SerializedProcess
{
  name: string
  priority: number
  metaData: object
  suspend: string | number | boolean
  parent: string | undefined
}

interface RoomData
{
  [name: string]: any
  constructionSites: ConstructionSite[]
  containers: StructureContainer[]
  extensions: StructureExtension[]
  extractor: StructureExtractor | undefined
  generalContainers: StructureContainer[]
  mineral: Mineral | undefined
  labs: StructureLab[]
  links: StructureLink[]
  ramparts: StructureRampart[]
  roads: StructureRoad[]
  spawns: StructureSpawn[]
  sources: Source[]
  sourceContainers: StructureContainer[]
  sourceContainerMaps: { [id: string]: StructureContainer }
  towers: StructureTower[]
}

interface IPCMessage
{
  from: string
  to: string
  message: object
}

interface DeliveryTarget extends Structure
{
  energy: number
  energyCapacity: number
  store: { [resource: string]: number }
  storeCapacity: number
}

interface CreepMetaData
{
  creep: string
}

interface DeliverProcessMetaData extends CreepMetaData
{
  target: string
  resource: string
}

interface EnergyManagementMetaData
{
  roomName: string
  harvestCreeps: { [source: string]: string[] }
  distroCreeps: { [container: string]: string }
  upgradeCreeps: string[]
  linker: string
  linkRequests:
  {
    link: string
    send: boolean
    stage: number
  }[]
}

declare module "*.json"
{
  const value: any;
  export default value;
}

declare const __REVISION__: string;
