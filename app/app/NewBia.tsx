import { Bia } from "@/services/types";
import { Storage } from "@/services/storage"

import { useState, useEffect } from "react";
import { View, Text, Button, TextInput } from "react-native";

export default function NewBia() {
    const [bia, setBia] = useState<Bia>();
    const [weight, setWeight] = useState<string>();
    const [muscleMass, setMuscleMass] = useState<string>();
    const [fatMass, setFatMass] = useState<string>();
    const [waterMass, setWaterMass] = useState<string>();

    const [db, setDB] = useState<Storage>();
    
    useEffect(() => {
        async function setup() {
            const db = await Storage.getInstance(false);
            setDB(db);
        }
        if (!db) {
            setup();
        }
    }, [])

    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Text>Weight</Text>
            <TextInput value={ `${weight}kg` } editable={ false }/>

            <Text>Muscle Mass</Text>
            <TextInput value={ `${muscleMass}kg` } editable={ false }/>

            <Text>Fat Mass</Text>
            <TextInput value={ `${fatMass}kg` } editable={ false }/>

            <Text>Water Mass</Text>
            <TextInput value={ `${waterMass}kg` } editable={ false }/>

            <View style={{ margin: 10 }}>
                <Button title="Generate random values" onPress={() => {
                    assembleRandomBia();
                }}/>
            </View>
            <View style={{ margin: 10 }}>
                <Button title="Create" onPress={() => {
                    if (bia) {
                        db?.createBia(bia);
                    }
                }}/>
            </View>
        </View>
    );

    // TODO Remove this function.
    // This is only temporary, while we dont have the scale integrated with the app
    function assembleRandomBia(): Bia {
        const weight = (Math.random() * 70 + 40);
        const muscleMass = weight * Math.random();
        const fatMass = (weight - muscleMass) * Math.random();
        const waterMass = (weight - muscleMass - fatMass);

        setWeight(weight.toFixed(2).toString());
        setMuscleMass(muscleMass.toFixed(2).toString());
        setFatMass(fatMass.toFixed(2).toString());
        setWaterMass(waterMass.toFixed(2).toString());

        // TODO think about how to properly do userId in this case.
        // It would be better to get the user id inside of the storage method.
        const bia: Bia = {
            id: undefined,
            userId: undefined,
            timestamp: undefined,
            weight,
            muscleMass,
            fatMass,
            waterMass,
        };
        setBia(bia);

        return bia;
    }
}
