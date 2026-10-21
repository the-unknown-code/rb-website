export enum IThreeOutput {
	ORTHO = 'three-output-ortho',
	SCENES = 'three-output-scenes',
}

export interface IThree {
	enabled: boolean;
	fixed: boolean;
	maxDpr: number;
	padding: number;
	postProcessing: boolean;
	output: IThreeOutput;
	mobile: boolean;

}

export const three: IThree = {
	enabled: false,
	fixed: true,
	maxDpr: 1.5,
	padding: 0,
	postProcessing: false,
	output: IThreeOutput.SCENES,
	mobile: true,
};
