type ResponsivePair<T> = [T, T];

export interface IGrid {
	columns: ResponsivePair<number>;
	gap: ResponsivePair<number>;
	margin: ResponsivePair<number>;
}

export const grid: IGrid = {
	columns: [4, 12],
	gap: [12, 12],
	margin: [8, 8],
};
