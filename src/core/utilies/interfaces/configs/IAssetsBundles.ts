export interface IAssetsBundles {
    bundles: IAssetsBundle[];
}

export interface IAssetsBundle {
    name: string;
    assets: IAssetsInfo[];
}

export interface IAssetsInfo {
    alias: string;
    src: string;
}