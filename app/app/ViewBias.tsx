import { Storage } from "@/services/storage";
import { Bia } from "@/services/types";
import Bias from "@/components/Bias";

import { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { View } from "react-native";


export default function ViewBias() {
    const [bias, setBias] = useState<Bia[]>([]);
    const [db, setDB] = useState<Storage>();
    
    useEffect(() => {
        async function setup() {
            const db = await Storage.getInstance(false);
            setDB(db);

            setBias(await db.getBias());
        }
        if (!db) {
            setup();
        }

    }, [])

    return (
        <View>
            <Bias bias={bias}/>
        </View>
    )
}
