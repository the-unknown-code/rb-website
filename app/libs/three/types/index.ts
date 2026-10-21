import type { Camera, Scene, Vector3 } from 'three';

export enum TManifestItemType {
	TEXTURE = 'texture',
	MODEL = 'model',
}

export interface IManifestItem {
	id: string;
	src: string;
	type: TManifestItemType;
}

export type IManifest = IManifestItem[];

export interface IPoint {
	x: number;
	y: number;
}

export interface IScene {
	id: string;
	camera?: {
		fov?: number;
		position?: Vector3;
		near?: number;
		far?: number;
	};
}

export const ISceneDefaults: Required<IScene> = {
	id: 'default-scene',
	camera: {
		fov: 45,
		position: { x: 0, y: 0, z: 0 } as Vector3,
		near: 0.1,
		far: 1000,
	},
};

export interface IActiveScene {
	scene: Scene;
	camera: Camera;
}

export interface IObject {
	id: string;
	tracking: {
		enabled: boolean;
		id: string;
	};
	interactive: boolean;
}

export const IObjectDefaults: Required<IObject> = {
	id: 'default-object',
	tracking: {
		enabled: false,
		id: '',
	},
	interactive: false,
};
