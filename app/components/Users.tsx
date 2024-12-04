import { User } from "@/services/types";
import UserTestComponent from "@/components/UserCard";

import { ScrollView } from "react-native";

type UsersProp = {
    users: User[];
}

const Users = (props: UsersProp): any => {
    return (
        <ScrollView>
        {
            // TODO
            // Using index here is a dirty fix.
            // It's being used because the user's id can be undefined.
            // Even though id is never really going to be undefined,
            // it would be a good idea to come up with a better solution
            props.users.map((u: User, index: number) => (
                <UserTestComponent user={u} key={u.id ?? index}/>
            ))
        }
        </ScrollView>
    );
}

export default Users;
