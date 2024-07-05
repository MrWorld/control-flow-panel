import { StaticPagesProvider } from "./EditStaticPagesContext";
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from './components/PageHeader';
import Editors from "./components/Editors";

const TermsAndConditionEditor = ({data, onChange}) => {
    return <StaticPagesProvider data={data}>
        <Editors data={data} onChange={onChange}/>
    </StaticPagesProvider>
}

export default TermsAndConditionEditor;