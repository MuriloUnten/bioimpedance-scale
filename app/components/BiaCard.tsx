import { Storage } from  "@/services/storage"
import { Bia } from "@/services/types";

import { View, Text } from "react-native";

type biaProp = {
    bia: Bia;
    key: number;
}

const BiaCard = (props: biaProp) => {
    let db: Storage;
    Storage.getInstance(false)
        .then((result) => {
            db = result;
        });
    
    const textStyle = {
        fontSize: 16,
    }
    return (
        <View
            style={{
                justifyContent: "flex-start",
                backgroundColor: "#ffecb3",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                margin: 8,
            }}
        >
            <Text style={textStyle}>{`Weight: ${props.bia.weight}kg`}</Text>
            <Text style={textStyle}>{`Muscle Mass: ${props.bia.muscleMass}kg`}</Text>
            <Text style={textStyle}>{`Fat Mass: ${props.bia.fatMass}kg`}</Text>
            <Text style={textStyle}>{`Water Mass: ${props.bia.waterMass}kg`}</Text>
        </View>
    );
}

export default BiaCard;
