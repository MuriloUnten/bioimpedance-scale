import { Storage } from "@/services/storage"
import { User } from "@/services/types"
import Users from "@/components/Users"

import { Button, Text, View, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { Link, useRouter, useFocusEffect, Redirect } from "expo-router";

export default function Index() {
    const [users, setUsers] = useState<User[]>([]);
    const [userId, setUserId] = useState<number|null>();
    const [db, setDB] = useState<Storage>();

    // let db: Storage;
    // Storage.getInstance(false)
    //     .then((result) => {
    //         setLoadingDB(false);
    //         db = result;
    //     });
    useEffect(() => {
        async function setup() {
            const db = await Storage.getInstance(false);
            setDB(db);

            const userId = await db.getCurrentUserId();
            setUserId(userId);
        }
        if (!db || userId === undefined) {
            setup();
        }
    }, [])
    


    if (!db) {
        return (
            <ScrollView
            contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Text>Loading Database</Text>
            </ScrollView>
        );
    }

    if (userId === null) {
        return <Redirect href="/NewUser"/>;
    }

    return (
        <ScrollView
        contentContainerStyle={{
            flex: 1,
            // justifyContent: "center",
            alignItems: "center",
        }}>
            <Link href="/NewUser" asChild>
                <Button title="Create User" />
            </Link>

            <Button title="Get Users" onPress={ async () => setUsers(await db.getUsers()) }/>

            <Users users={users}/>
        </ScrollView>
    );
}
