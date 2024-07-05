import { useStaticPages } from "../../EditStaticPagesContext";
import Editor from "../Editor";

const Editors = ({data, onChangeDetails, onChange}) => {
    return <>
        <Editor
            editorValue={data}
            onChange={onChange}
            title={'Terms And Condition'}
        />
    </>
}

export default Editors;