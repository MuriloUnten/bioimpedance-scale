import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

import { User, Bia } from "./types";

const DB_NAME: string = "sqlite.db";

export class Storage {
    static #instance: Storage;
    private db: SQLite.SQLiteDatabase;
    private dbName: string;

    public static async getInstance(resetOldDB: boolean): Promise<Storage> {
        if (!Storage.#instance) {
            Storage.#instance = await Storage.loadDatabase(resetOldDB);
        }

        return Storage.#instance;
    }

    private constructor() {
            this.dbName = DB_NAME;
            this.db = SQLite.openDatabaseSync(this.dbName);
        try {
            this.setupTables();
        } catch (error) {
            console.log(error)
        }

    }

    public async createUser(user: User): Promise<number> {
        console.log("inside createUser. User: ", user);
        const query = await this.db.prepareAsync(`
            INSERT INTO user (first_name, last_name, height, sex, date_of_birth) values (?, ?, ?, ?, ?);
        `);
        const result = await query.executeAsync(user.firstName, user.lastName, user.height, user.sex, user.dateOfBirth);

        return result.lastInsertRowId;
    }

    public async getUser(id: number): Promise<User|null> {
        const query = await this.db.prepareAsync(`
            SELECT id_user, first_name, last_name, height, sex, date_of_birth FROM user
            WHERE id_user = ?;
        `);
        const result = await query.executeAsync(id);
        const userData: any = await result.getFirstAsync();

        const user: User = {
            id: userData.id_user,
            firstName: userData.first_name,
            lastName: userData.last_name,
            height: userData.height,
            sex: userData.sex,
            dateOfBirth: userData.dateOfBirth,
        };
        return user;
    }

    public async getUsers(): Promise<User[]> {
        const result = await this.db.getAllAsync(`
            SELECT id_user, first_name, last_name, height, sex, date_of_birth FROM user;
        `);
        result.forEach((user: any) => console.log(user.first_name))

        return result.map<User>((u: any) => {
            const user: User = {
                id: u.id_user,
                firstName: u.first_name,
                lastName: u.last_name,
                height: u.height,
                sex: u.sex,
                dateOfBirth: u.dateOfBirth,
            };
            return user;
        });
    }

    public async deleteUser(id: number): Promise<number> {
        const query = "DELETE FROM user WHERE id_user = ?";
        const result = await this.db.runAsync(query, id);
        return result.changes;
    }

    public async getCurrentUserId(): Promise<number | null> {
        const result = await this.db.getFirstAsync<number>(`
            SELECT id_user FROM current_user;
        `);

        return result;
    }

    public async setCurrentUserId(id: number): Promise<number> {
        const userExists = await this.db.getFirstAsync<number>("SELECT 1 FROM user WHERE id_user = ?", id);
        if (!userExists) {
            return 0;
        }
        
        const oldUserId = await this.getCurrentUserId();
        if (oldUserId != null && oldUserId === id) {
            return 1;
        } else if (oldUserId != null) {
            await this.db.runAsync("DELETE FROM current_user WHERE id_user = ?", oldUserId);
        }
        
        const query = "INSERT INTO current_user (id_user) VALUES (?)";
        const result = await this.db.runAsync(query, id);

        return result.changes;
    }

    public async createBia(bia: Bia) {
        const time = new Date().toISOString();
        const userId = await this.getCurrentUserId();
        if (!userId) {
            return;
        }

        const query = await this.db.prepareAsync(`
            INSERT INTO bia (id_user, timestamp, weight, muscle_mass, fat_mass, water_mass) values (?, ?, ?, ?, ?, ?);
        `);
        await query.executeAsync(userId, time, bia.weight, bia.muscleMass, bia.fatMass, bia.waterMass);
        return;
    }

    public async getBia(id: number): Promise<Bia|null> {
        const query = await this.db.prepareAsync(`
            SELECT id_bia, id_user, timestamp, weight, muscle_mass, fat_mass, water_mass FROM bia
            WHERE id_bia = ?;
        `);

        const result = await query.executeAsync(id);
        const biaData: any = await result.getFirstAsync();

        const bia: Bia = {
            id: biaData.id_bia,
            userId: biaData.id_user,
            timestamp: new Date(biaData.timestamp),
            weight: biaData.weight,
            muscleMass: biaData.muscle_mass,
            fatMass: biaData.fat_mass,
            waterMass: biaData.water_mass,
        };
        return bia;
    }

    public async getBias(): Promise<Bia[]> {
        const userId = await this.getCurrentUserId();
        if (!userId) {
            return [];
        }

        const query = "SELECT id_bia, id_user, timestamp, weight, muscle_mass, fat_mass, water_mass FROM bia WHERE id_user = ?";
        const result = await this.db.getAllAsync(query , userId);

        return result.map<Bia>((el: any) => {
            const bia: Bia = {
                id: el.id_bia,
                userId: el.id_user,
                timestamp: el.timestamp,
                weight: el.weight,
                muscleMass: el.muscle_mass,
                fatMass: el.fat_mass,
                waterMass: el.water_mass,
            };
            return bia;
        });
    }

    public async deleteBia(id: number): Promise<number> {
        const query = "DELETE FROM bia WHERE id_bia = ?";
        const result = await this.db.runAsync(query, id);
        return result.changes;
    }

    public setupTables(): number {
        let changes = 0;
        let result = this.db.runSync(`
            CREATE TABLE IF NOT EXISTS user (
                id_user INTEGER PRIMARY KEY NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                height DECIMAL(3,2) NOT NULL,
                sex INTEGER NOT NULL,
                date_of_birth TEXT NOT NULL
            );
        `);
        changes += result.changes;

        result = this.db.runSync(`
            CREATE TABLE IF NOT EXISTS bia (
                id_bia INTEGER PRIMARY KEY NOT NULL,
                id_user INTEGER NOT NULL,
                timestamp TEXT NOT NULL,
                weight FLOAT NOT NULL,
                muscle_mass FLOAT NOT NULL,
                fat_mass FLOAT NOT NULL,
                water_mass FLOAT NOT NULL,
                FOREIGN KEY (id_user) REFERENCES user (id_user)
            );
        `);
        changes += result.changes;
        

        result = this.db.runSync(`
            CREATE TABLE IF NOT EXISTS current_user (id_user);
        `);
        changes += result.changes;

        return changes;
    }

    private static async loadDatabase(resetOldDB: boolean): Promise<Storage> {
            const dbName: string = DB_NAME;
            const dbAsset = require(`../assets/database/${dbName}`);
            const dbUri = Asset.fromModule(dbAsset).uri;
            const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

            if(resetOldDB && (await Storage.databaseExists(dbName))) {
                console.log("deleting old database");
                await FileSystem.deleteAsync(dbFilePath);
            }
            else if (!(await Storage.databaseExists(dbName))) {
                await FileSystem.makeDirectoryAsync(
                    `${FileSystem.documentDirectory}SQLite`,
                    { intermediates: true }
                );
                
                await FileSystem.downloadAsync(dbUri, dbFilePath);
            }

        return new Storage();
    }

    static async databaseExists(dbName: string): Promise<boolean> {
        const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
        const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
        return fileInfo.exists;
    }

    static async catDatabase(dbName: string): Promise<string> {
        const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
        const content = await FileSystem.readAsStringAsync(dbFilePath);

        return content;
    }
}
