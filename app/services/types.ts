export enum Sex {
    MALE = 0,
    FEMALE,
}

export type User = {
    id: number | undefined;
    firstName: string;
    lastName: string;
    height: number;
    sex: Sex.MALE | Sex.FEMALE;
    dateOfBirth: string; // TODO find out best solution for this
}

export type Bia = {
    id: number;
    userId: number;
    timestamp: Date | undefined; // TODO find out best solution for this
    weight: number;
    muscleMass: number;
    fatMass: number;
    waterMass: number;
}
