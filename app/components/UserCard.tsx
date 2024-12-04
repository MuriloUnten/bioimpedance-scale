import { Storage } from  "@/services/storage"
import { User, Sex } from "@/services/types";

import { View, Text } from "react-native";

type UserProp = {
    user: User;
    key: number;
}

const UserCard = (props: UserProp) => {
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
                backgroundColor: "#b6d6cc",
                padding: 8,
                borderRadius: 8,
                margin: 8,
            }}
        >
            <Text style={{fontWeight:"bold", ...textStyle}}>{`${props.user.firstName} ${props.user.lastName}`}</Text>
            <Text style={textStyle}>{`Height: ${props.user.height}cm`}</Text>
            <Text style={textStyle}>{`Sex: ${props.user.sex === Sex.MALE? "Male" : "Female"}`}</Text>
        </View>
    );
}

export default UserCard;
