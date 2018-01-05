declare const require: (module: string) => any;
declare var module: any;
declare var global: any

declare namespace NodeJS
{
    interface Global
    {
        SCRIPT_VERSION: number
        lastTick: number
        LastMemory: Memory
        Memory: Memory
        roomData: { [key: string]: RoomData }
        cc: any
    }
}

interface CreepMemory { [name: string]: any }

interface FlagMemory { [name: string]: any }

interface SpawnMemory { [name: string]: any }

interface RoomMemory { [name: string]: any }

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
    myStructures: Structure[]
    ramparts: StructureRampart[]
    roads: StructureRoad[]
    spawns: StructureSpawn[]
    sources: Source[]
    sourceContainers: StructureContainer[]
    sourceContainerMaps: { [id: string]: StructureContainer }
    towers: StructureTower[]
    walls: StructureWall[]
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
    resource: _ResourceConstantSansEnergy
}

interface EnergyManagementMetaData
{
    roomName: string
    miningCreeps: { [source: string]: string[] }
    harvestCreeps: { [source: string]: string[] }
    courierCreeps: string[]
    upgradeCreeps: string[]
    storageCreep: string | undefined
    transportCreeps: { [container: string]: string }
}

interface RoomPosition
{
    offset(this: RoomPosition, x: number, y: number): RoomPosition
}

declare module "*.json"
{
    const value: any;
    export default value;
}

declare const __REVISION__: string;
