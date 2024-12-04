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
    dateOfBirth: string;
}

export type Bia = {
    id: number | undefined;
    userId: number | undefined;
    timestamp: Date | undefined;
    weight: number;
    muscleMass: number;
    fatMass: number;
    waterMass: number;
}
