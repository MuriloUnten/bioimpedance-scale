import { Bia } from "@/services/types";
import BiaCard from "@/components/BiaCard";

import { ScrollView } from "react-native";

type BiasProp = {
    bias: Bia[];
}

const Bias = (props: BiasProp): any => {
    return (
        <ScrollView>
        {
            // TODO
            // Using index here is a dirty fix.
            // It's being used because the user's id can be undefined.
            // Even though id is never really going to be undefined,
            // it would be a good idea to come up with a better solution
            props.bias.map((b: Bia, index: number) => (
                <BiaCard bia={b} key={b.id ?? index}/>
            ))
        }
        </ScrollView>
    );
}

export default Bias;
